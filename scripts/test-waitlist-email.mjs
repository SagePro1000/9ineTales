import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";
import ts from "typescript";

const require = createRequire(import.meta.url);
nextEnv.loadEnvConfig(fileURLToPath(new URL("../", import.meta.url)));
function load(relative) {
  const output = ts.transpileModule(
    readFileSync(new URL(relative, import.meta.url), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    },
  ).outputText;
  const module = { exports: {} };
  new Function("require", "module", "exports", output)(
    require,
    module,
    module.exports,
  );
  return module.exports;
}

if (!process.argv.includes("--send")) {
  console.log(
    "This sends one real double opt-in setup test to the operator. Run with --send only after explicit authorization.",
  );
  process.exit(0);
}

try {
  const { getWaitlistConfig } = load("../src/lib/waitlist/config.ts");
  const { createWaitlistHandler } = load("../src/lib/waitlist/handler.ts");
  const previous = process.env.WAITLIST_ENABLED;
  // Enable only this private, in-process test; no server or public form is enabled.
  process.env.WAITLIST_ENABLED = "true";
  const config = getWaitlistConfig();
  if (previous === undefined) delete process.env.WAITLIST_ENABLED;
  else process.env.WAITLIST_ENABLED = previous;
  if (!config)
    throw new Error(
      "Complete all private settings, including approved retention, before testing.",
    );
  const existing = await fetch(
    "https://api.brevo.com/v3/contacts/" +
      encodeURIComponent("ninetales154@gmail.com"),
    {
      headers: { "api-key": config.brevoApiKey },
      signal: AbortSignal.timeout(10000),
    },
  );
  if (existing.status !== 404)
    throw new Error(
      "Test address already exists or lookup failed; no email was requested and no contact was changed.",
    );
  const transport = async (url, options) => {
    if (url === "https://api.brevo.com/v3/contacts/doubleOptinConfirmation") {
      const body = JSON.parse(options.body);
      // Until the new route is deployed, use the existing homepage for this test.
      body.redirectionUrl = `${config.origin}/?waitlist_test=confirmed`;
      options = { ...options, body: JSON.stringify(body) };
    }
    const response = await fetch(url, options);
    if (url.startsWith("https://api.brevo.com/"))
      console.log(
        JSON.stringify({ service: "Brevo", httpStatus: response.status }),
      );
    return response;
  };
  const response = await createWaitlistHandler(
    config,
    transport,
  )(
    new Request(`${config.origin}/api/waitlist/`, {
      method: "POST",
      headers: { origin: config.origin, "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "ninetales154@gmail.com",
        role: "both",
        consent: true,
        website: "",
        source: "setup-test",
      }),
    }),
  );
  const result = await response.json();
  console.log(
    JSON.stringify({
      testRequestAccepted:
        response.status === 202 && result.status === "pending",
      httpStatus: response.status,
      publicCollectionEnabled: false,
    }),
  );
  if (response.status !== 202) process.exitCode = 1;
} catch (error) {
  console.error(
    error instanceof Error &&
      /^(Complete all private|Test address already)/.test(error.message)
      ? error.message
      : "Test failed; credentials were not displayed. Do not retry a send without checking its status.",
  );
  process.exitCode = 1;
}
