export type WaitlistConfig = {
  origin: string;
  brevoApiKey: string;
  listId: number;
  templateId: number;
  redisUrl: string;
  redisToken: string;
  hashSecret: string;
  operator: string;
  privacyEmail: string;
  retention: string;
};

/** A key alone never enables collection. Missing settings fail closed. */
export function getWaitlistConfig(): WaitlistConfig | null {
  if (
    process.env.WAITLIST_ENABLED !== "true" ||
    process.env.NEXT_STATIC_EXPORT === "true"
  )
    return null;
  const origin = process.env.WAITLIST_SITE_URL;
  const brevoApiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_WAITLIST_LIST_ID);
  const templateId = Number(process.env.BREVO_DOI_TEMPLATE_ID);
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const hashSecret = process.env.WAITLIST_HASH_SECRET;
  const operator = process.env.WAITLIST_OPERATOR_NAME?.trim();
  const privacyEmail = process.env.WAITLIST_PRIVACY_EMAIL?.trim();
  const retention = process.env.WAITLIST_RETENTION_NOTICE?.trim();
  if (
    !origin ||
    !brevoApiKey ||
    !redisUrl ||
    !redisToken ||
    !hashSecret ||
    hashSecret.length < 32 ||
    !operator ||
    !retention ||
    !privacyEmail ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(privacyEmail) ||
    !Number.isSafeInteger(listId) ||
    listId < 1 ||
    !Number.isSafeInteger(templateId) ||
    templateId < 1
  )
    return null;
  try {
    const site = new URL(origin);
    const redis = new URL(redisUrl);
    if (
      site.protocol !== "https:" ||
      site.username ||
      site.password ||
      site.pathname !== "/" ||
      site.search ||
      site.hash ||
      redis.protocol !== "https:" ||
      redis.username ||
      redis.password
    )
      return null;
    return {
      origin: site.origin,
      brevoApiKey,
      listId,
      templateId,
      redisUrl: redisUrl.replace(/\/$/, ""),
      redisToken,
      hashSecret,
      operator,
      privacyEmail,
      retention,
    };
  } catch {
    return null;
  }
}
