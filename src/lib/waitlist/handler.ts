import { createHmac } from "node:crypto";
import type { WaitlistConfig } from "./config";

export const CONSENT_VERSION = "waitlist-2026-09-17-v1";
export const CONSENT_TEXT =
  "I’d like 9inetales development and early-access emails. I can unsubscribe at any time.";
const MAX_BYTES = 4096;
const PENDING_SECONDS = 31 * 24 * 60 * 60;
const accepted = { status: "pending" };

function reply(
  body: unknown,
  status = 200,
  headers: Record<string, string> = {},
) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

async function readBody(request: Request) {
  if (!request.body) throw new Error("empty");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) {
        await reader.cancel();
        throw new Error("oversize");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
}

function validEmail(email: string) {
  const [local, domain, extra] = email.split("@");
  return (
    email.length <= 254 &&
    !extra &&
    !!local &&
    local.length <= 64 &&
    /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(local) &&
    !local.startsWith(".") &&
    !local.endsWith(".") &&
    !local.includes("..") &&
    !!domain &&
    domain.length <= 253 &&
    domain.includes(".") &&
    domain
      .split(".")
      .every((label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label))
  );
}

// One atomic shared counter, with an expiry set on its first increment.
const limitScript =
  "local n = redis.call('INCR', KEYS[1]); if n == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end; return n";

/** Injectable HTTP transport lets tests prove safety without sending real email. */
export function createWaitlistHandler(
  config: WaitlistConfig | null,
  transport: typeof fetch = fetch,
) {
  return async function handle(request: Request): Promise<Response> {
    if (!config)
      return reply(
        {
          message:
            "Email registration isn’t active yet. Please check back soon.",
        },
        503,
      );
    if (
      request.headers.get("origin") !== config.origin ||
      request.headers.get("sec-fetch-site") === "cross-site"
    ) {
      return reply(
        { message: "Please submit the form from the 9inetales website." },
        403,
      );
    }
    if (
      request.headers.get("content-type")?.split(";")[0].trim() !==
      "application/json"
    ) {
      return reply({ message: "Please use the signup form." }, 415);
    }
    if (Number(request.headers.get("content-length")) > MAX_BYTES) {
      return reply({ message: "The signup request is too large." }, 413);
    }
    let raw: unknown;
    try {
      raw = await readBody(request);
    } catch {
      return reply(
        { message: "We couldn’t read your signup. Please try again." },
        400,
      );
    }
    if (!raw || typeof raw !== "object" || Array.isArray(raw))
      return reply({ message: "Please complete the signup form." }, 400);
    const body = raw as Record<string, unknown>;
    // A filled bot trap is rejected without touching providers or claiming success.
    if (typeof body.website !== "string" || body.website !== "")
      return reply(
        { message: "We couldn’t accept this signup. Please try again." },
        400,
      );
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!validEmail(email))
      return reply(
        {
          message: "Enter a valid email address, such as you@example.com.",
          field: "email",
        },
        400,
      );
    if (
      typeof body.role !== "string" ||
      !["reader", "creator", "both"].includes(body.role)
    )
      return reply({ message: "Choose reader, creator, or both." }, 400);
    if (body.consent !== true)
      return reply(
        {
          message:
            "Please confirm you’d like development and early-access emails.",
          field: "consent",
        },
        400,
      );
    if (
      body.source !== undefined &&
      (typeof body.source !== "string" ||
        !/^[a-z0-9_-]{1,64}$/i.test(body.source))
    )
      return reply({ message: "Please reload the page and try again." }, 400);

    const hash = (value: string) =>
      createHmac("sha256", config.hashSecret).update(value).digest("hex");
    async function redis(command: (string | number)[]) {
      const response = await transport(config!.redisUrl, {
        method: "POST",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${config!.redisToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) throw new Error("limiter_unavailable");
      const data = (await response.json()) as {
        result?: unknown;
        error?: string;
      };
      if (data.error || !("result" in data))
        throw new Error("limiter_unavailable");
      return data.result;
    }
    async function brevo(path: string, options: RequestInit = {}) {
      return transport(`https://api.brevo.com/v3/${path}`, {
        ...options,
        cache: "no-store",
        headers: {
          "api-key": config!.brevoApiKey,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(8000),
      });
    }
    async function withinLimit(key: string, seconds: number, maximum: number) {
      const count = await redis(["EVAL", limitScript, 1, key, seconds]);
      if (typeof count !== "number") throw new Error("limiter_unavailable");
      return count <= maximum;
    }
    try {
      // On Vercel this header is provided by the platform. Do not trust a caller's
      // generic x-forwarded-for header. Outside Vercel use a shared fallback bucket.
      const ip =
        process.env.VERCEL === "1"
          ? request.headers
              .get("x-vercel-forwarded-for")
              ?.split(",")[0]
              .trim() || "unknown"
          : "local";
      if (!(await withinLimit(`9inetales:ip:${hash(ip)}`, 600, 5)))
        return reply(
          {
            message:
              "Too many signup attempts. Please wait 10 minutes and try again.",
          },
          429,
          { "Retry-After": "600" },
        );
      const emailHash = hash(email);
      const recordKey = `9inetales:pending:${emailHash}`;
      // Atomic per-address lock prevents simultaneous sends across instances.
      const reserved = await redis([
        "SET",
        `9inetales:lock:${emailHash}`,
        "processing",
        "NX",
        "EX",
        600,
      ]);
      if (reserved === null) {
        const record = await redis(["GET", recordKey]);
        if (typeof record === "string" && JSON.parse(record).accepted === true)
          return reply(accepted, 202);
        return reply(
          {
            message:
              "A signup attempt is already in progress. Please check your inbox or try again in 10 minutes.",
          },
          429,
          { "Retry-After": "600" },
        );
      }
      if (reserved !== "OK") throw new Error("limiter_unavailable");
      const timestamp = new Date().toISOString();
      const initial = {
        accepted: false,
        attributes: {
          AUDIENCE_ROLE: body.role,
          SIGNUP_AT: timestamp,
          CONSENT_AT: timestamp,
          CONSENT_VERSION,
          SIGNUP_SOURCE: body.source || "website",
        },
      };
      // Keep the first pending preferences and consent on retries, including when
      // Brevo accepted a request but the network timed out. No plaintext email or
      // IP is stored here. The 31-day record outlives a 30-day confirmation link.
      await redis([
        "SET",
        recordKey,
        JSON.stringify(initial),
        "NX",
        "EX",
        PENDING_SECONDS,
      ]);
      const stored = await redis(["GET", recordKey]);
      if (typeof stored !== "string")
        throw new Error("pending_record_unavailable");
      const record = JSON.parse(stored) as typeof initial;
      // Count all sends against a shared daily budget; campaign sends need room too.
      if (
        !(await withinLimit(
          `9inetales:sends:${new Date().toISOString().slice(0, 10)}`,
          172800,
          100,
        ))
      )
        return reply(
          {
            message:
              "Email signup is temporarily busy. Please try again tomorrow.",
          },
          429,
          { "Retry-After": "86400" },
        );
      const existing = await brevo(`contacts/${encodeURIComponent(email)}`);
      if (existing.ok) {
        // Never update attributes, list membership, or suppression on this path.
        await redis([
          "SET",
          recordKey,
          JSON.stringify({ ...record, accepted: true }),
          "EX",
          PENDING_SECONDS,
        ]);
        return reply(accepted, 202);
      }
      if (existing.status !== 404) throw new Error("contact_lookup_failed");
      const response = await brevo("contacts/doubleOptinConfirmation", {
        method: "POST",
        body: JSON.stringify({
          email,
          includeListIds: [config.listId],
          templateId: config.templateId,
          redirectionUrl: `${config.origin}/waitlist/confirmation/`,
          attributes: record.attributes,
        }),
      });
      if (!response.ok) throw new Error("confirmation_failed");
      // Brevo confirmation links expire after 30 days. Keep the reservation one
      // day longer, so a public resubmission cannot overwrite pending preferences.
      await redis([
        "SET",
        recordKey,
        JSON.stringify({ ...record, accepted: true }),
        "EX",
        PENDING_SECONDS,
      ]);
      return reply(accepted, 202);
    } catch {
      // Never log email addresses, keys, or provider response bodies. Keep the
      // short reservation on failure; a timeout might follow an accepted send.
      return reply(
        {
          message:
            "We couldn’t complete your signup. Please keep your details and try again in 10 minutes.",
        },
        503,
      );
    }
  };
}
