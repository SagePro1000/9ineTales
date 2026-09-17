import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
// Execute the actual TypeScript modules without another dependency or fixture build.
function load(relative) {
  const filename = new URL(relative, import.meta.url);
  const output = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const module = { exports: {} };
  new Function("require", "module", "exports", output)(
    require,
    module,
    module.exports,
  );
  return module.exports;
}
const { createWaitlistHandler, CONSENT_VERSION } = load(
  "../src/lib/waitlist/handler.ts",
);
const { getWaitlistConfig } = load("../src/lib/waitlist/config.ts");
const config = {
  origin: "https://9inetales.example",
  brevoApiKey: "test-key",
  listId: 7,
  templateId: 8,
  redisUrl: "https://redis.example",
  redisToken: "test-token",
  hashSecret: "test-secret-".repeat(4),
  operator: "Test operator",
  privacyEmail: "privacy@example.com",
  retention: "Test retention policy.",
};
function request(values = {}, headers = {}) {
  return new Request(`${config.origin}/api/waitlist/`, {
    method: "POST",
    headers: {
      origin: config.origin,
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify({
      email: "person@example.com",
      role: "creator",
      consent: true,
      website: "",
      ...values,
    }),
  });
}
function provider({
  exists = false,
  failure = false,
  redisFailure = false,
} = {}) {
  const storage = new Map(),
    calls = [],
    confirmations = [];
  const transport = async (url, options) => {
    calls.push({ url, options });
    if (url === config.redisUrl) {
      if (redisFailure) return new Response("unavailable", { status: 503 });
      const [command, key, value, ...args] = JSON.parse(options.body);
      let result;
      if (command === "EVAL") {
        const counterKey = args[0];
        result = Number(storage.get(counterKey) || 0) + 1;
        storage.set(counterKey, result);
      } else if (command === "SET") {
        if (args.includes("NX") && storage.has(key)) result = null;
        else {
          storage.set(key, value);
          result = "OK";
        }
      } else if (command === "GET") result = storage.get(key) ?? null;
      else throw new Error(`Unexpected Redis command ${command}`);
      return Response.json({ result });
    }
    if (url.includes("doubleOptinConfirmation")) {
      confirmations.push(JSON.parse(options.body));
      return Response.json({}, { status: failure ? 503 : 201 });
    }
    assert.equal(options.method, undefined, "Existing contacts are only read");
    return Response.json(
      exists
        ? { emailBlacklisted: true, attributes: { AUDIENCE_ROLE: "reader" } }
        : {},
      { status: exists ? 200 : 404 },
    );
  };
  return {
    transport,
    storage,
    calls,
    confirmations,
    clearLocks() {
      for (const key of storage.keys())
        if (key.includes(":lock:")) storage.delete(key);
    },
  };
}

test("disabled collection never accesses providers", async () => {
  const p = provider();
  assert.equal(
    (await createWaitlistHandler(null, p.transport)(request())).status,
    503,
  );
  assert.equal(p.calls.length, 0);
});
test("invalid requests never reach storage or Brevo", async () => {
  const p = provider(),
    handler = createWaitlistHandler(config, p.transport);
  for (const values of [
    { email: "bad" },
    { email: "a..b@example.com" },
    { role: "admin" },
    { role: ["reader"] },
    { consent: "true" },
    { consent: false },
    { website: "bot" },
    { source: "<script>" },
  ]) {
    assert.equal((await handler(request(values))).status, 400);
  }
  assert.equal(
    (await handler(request({}, { origin: "https://other.example" }))).status,
    403,
  );
  assert.equal(
    (await handler(request({}, { "content-type": "text/plain" }))).status,
    415,
  );
  assert.equal(p.calls.length, 0);
});
test("request size is bounded even without Content-Length", async () => {
  const p = provider();
  const result = await createWaitlistHandler(
    config,
    p.transport,
  )(request({ extra: "x".repeat(5000) }));
  assert.equal(result.status, 400);
  assert.equal(p.calls.length, 0);
});
test("new signup requests DOI, normalizes email, and records server consent", async () => {
  const p = provider();
  const response = await createWaitlistHandler(
    config,
    p.transport,
  )(
    request({
      email: " Person@Example.COM ",
      role: "both",
      source: "instagram",
      CONSENT_AT: "fake",
    }),
  );
  assert.equal(response.status, 202);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const sent = p.confirmations[0];
  assert.equal(sent.email, "person@example.com");
  assert.deepEqual(sent.includeListIds, [7]);
  assert.equal(sent.templateId, 8);
  assert.equal(sent.redirectionUrl, `${config.origin}/waitlist/confirmation/`);
  assert.equal(sent.attributes.AUDIENCE_ROLE, "both");
  assert.equal(sent.attributes.SIGNUP_SOURCE, "instagram");
  assert.equal(sent.attributes.CONSENT_VERSION, CONSENT_VERSION);
  assert.match(sent.attributes.CONSENT_AT, /^\d{4}-\d\d-\d\dT/);
  assert.equal(sent.attributes.SIGNUP_AT, sent.attributes.CONSENT_AT);
  assert.ok(
    !JSON.stringify([...p.storage]).includes("person@example.com"),
    "Redis contains no plaintext email",
  );
});
test("repeat pending requests preserve original preferences and consent", async () => {
  const p = provider(),
    handler = createWaitlistHandler(config, p.transport);
  assert.equal((await handler(request())).status, 202);
  assert.equal((await handler(request({ role: "reader" }))).status, 202);
  assert.equal(p.confirmations.length, 1, "Immediate repeat cannot send again");
  p.clearLocks();
  assert.equal((await handler(request({ role: "reader" }))).status, 202);
  assert.deepEqual(
    p.confirmations[1].attributes,
    p.confirmations[0].attributes,
  );
});
test("existing and unsubscribed contacts are never updated or resubscribed", async () => {
  const p = provider({ exists: true });
  assert.equal(
    (await createWaitlistHandler(config, p.transport)(request())).status,
    202,
  );
  assert.equal(p.confirmations.length, 0);
  assert.equal(
    p.calls.filter((call) => call.url.includes("api.brevo.com")).length,
    1,
  );
});
test("provider failure cannot show accepted status on immediate retry", async () => {
  const p = provider({ failure: true }),
    handler = createWaitlistHandler(config, p.transport);
  assert.equal((await handler(request())).status, 503);
  assert.equal((await handler(request())).status, 429);
  assert.equal(p.confirmations.length, 1);
});
test("unavailable rate limiter fails closed without sending", async () => {
  const p = provider({ redisFailure: true });
  assert.equal(
    (await createWaitlistHandler(config, p.transport)(request())).status,
    503,
  );
  assert.equal(p.confirmations.length, 0);
  assert.equal(
    p.calls.filter((call) => call.url.includes("api.brevo.com")).length,
    0,
  );
});
test("shared IP limit applies across handler instances", async () => {
  const p = provider();
  for (let i = 0; i < 5; i++)
    assert.equal(
      (
        await createWaitlistHandler(
          config,
          p.transport,
        )(request({ email: `person${i}@example.com` }))
      ).status,
      202,
    );
  const limited = await createWaitlistHandler(
    config,
    p.transport,
  )(request({ email: "last@example.com" }));
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get("retry-after"), "600");
  assert.equal(p.confirmations.length, 5);
});
test("simultaneous submissions can send only one confirmation", async () => {
  const p = provider();
  const results = await Promise.all([
    createWaitlistHandler(config, p.transport)(request()),
    createWaitlistHandler(config, p.transport)(request({ role: "reader" })),
  ]);
  assert.ok(results.some((response) => response.status === 202));
  assert.equal(p.confirmations.length, 1);
});
test("the daily budget is shared and prevents another provider request", async () => {
  const p = provider();
  p.storage.set(
    `9inetales:sends:${new Date().toISOString().slice(0, 10)}`,
    100,
  );
  const result = await createWaitlistHandler(config, p.transport)(request());
  assert.equal(result.status, 429);
  assert.equal(result.headers.get("retry-after"), "86400");
  assert.equal(
    p.calls.filter((call) => call.url.includes("api.brevo.com")).length,
    0,
  );
});
test("a contact lookup outage cannot trigger a new confirmation", async () => {
  const p = provider();
  const transport = (url, options) =>
    url.includes("api.brevo.com")
      ? Promise.resolve(Response.json({}, { status: 503 }))
      : p.transport(url, options);
  assert.equal(
    (await createWaitlistHandler(config, transport)(request())).status,
    503,
  );
  assert.equal(p.confirmations.length, 0);
});
test("timed-out provider requests never claim success", async () => {
  const p = provider();
  const transport = (url, options) =>
    url.includes("doubleOptinConfirmation")
      ? Promise.reject(new Error("simulated timeout"))
      : p.transport(url, options);
  const handler = createWaitlistHandler(config, transport);
  assert.equal((await handler(request())).status, 503);
  assert.equal((await handler(request())).status, 429);
});
test("configuration requires explicit enablement, privacy, and every credential", () => {
  const settings = {
    WAITLIST_ENABLED: "true",
    WAITLIST_SITE_URL: config.origin,
    BREVO_API_KEY: config.brevoApiKey,
    BREVO_WAITLIST_LIST_ID: "7",
    BREVO_DOI_TEMPLATE_ID: "8",
    UPSTASH_REDIS_REST_URL: config.redisUrl,
    UPSTASH_REDIS_REST_TOKEN: config.redisToken,
    WAITLIST_HASH_SECRET: config.hashSecret,
    WAITLIST_OPERATOR_NAME: config.operator,
    WAITLIST_PRIVACY_EMAIL: config.privacyEmail,
    WAITLIST_RETENTION_NOTICE: config.retention,
    NEXT_STATIC_EXPORT: "false",
  };
  const previous = Object.fromEntries(
    Object.keys(settings).map((key) => [key, process.env[key]]),
  );
  try {
    Object.assign(process.env, settings);
    assert.deepEqual(getWaitlistConfig(), config);
    for (const key of Object.keys(settings).filter(
      (key) => key !== "NEXT_STATIC_EXPORT",
    )) {
      delete process.env[key];
      assert.equal(getWaitlistConfig(), null, key);
      process.env[key] = settings[key];
    }
    process.env.NEXT_STATIC_EXPORT = "true";
    assert.equal(
      getWaitlistConfig(),
      null,
      "Static output always remains a preview",
    );
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
