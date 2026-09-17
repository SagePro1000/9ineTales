import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";

const root = fileURLToPath(new URL("../", import.meta.url));
nextEnv.loadEnvConfig(root);
const apply = process.argv.includes("--apply");
const apiKey = process.env.BREVO_API_KEY;
const email = "ninetales154@gmail.com";
const listName = "9inetales confirmed waitlist";
const templateName = "9inetales waitlist confirmation v1";
const attributeNames = [
  "AUDIENCE_ROLE",
  "SIGNUP_AT",
  "CONSENT_AT",
  "CONSENT_VERSION",
  "SIGNUP_SOURCE",
];

async function api(path, body) {
  const response = await fetch(`https://api.brevo.com/v3/${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok)
    throw new Error(
      `Brevo setup request failed for ${path} (HTTP ${response.status}).`,
    );
  return response.status === 204 ? {} : response.json();
}

async function all(path, field) {
  const result = [];
  for (let offset = 0; ; offset += 50) {
    const page = await api(`${path}?limit=50&offset=${offset}`);
    const items = page[field] || [];
    result.push(...items);
    if (
      items.length < 50 ||
      (typeof page.count === "number" && result.length >= page.count)
    )
      return result;
  }
}

async function saveSetting(name, value) {
  const path = new URL("../.env.local", import.meta.url);
  let source = await readFile(path, "utf8");
  const expression = new RegExp(`^${name}=.*$`, "gm");
  if ((source.match(expression) || []).length > 1)
    throw new Error(`Duplicate ${name} settings; private file preserved.`);
  source = expression.test(source)
    ? source.replace(expression, () => `${name}=${value}`)
    : `${source.trimEnd()}\n${name}=${value}\n`;
  await writeFile(path, source, { mode: 0o600 });
}

try {
  if (!apiKey?.startsWith("xkeysib-"))
    throw new Error(
      "Save a standard Brevo API key privately in .env.local first.",
    );
  const senders = await api("senders");
  const sender = senders.senders?.find(
    (item) => item.email?.toLowerCase() === email && item.active,
  );
  if (!sender)
    throw new Error(
      "Verify ninetales154@gmail.com as a Brevo sender before setup.",
    );
  const lists = await all("contacts/lists", "lists");
  const matches = lists.filter((item) => item.name === listName);
  if (matches.length > 1)
    throw new Error(
      "Multiple matching waitlist lists; resolve the duplicate before setup.",
    );
  const folderId = lists.find((item) => item.folderId === 1)?.folderId;
  if (!matches.length && !folderId)
    throw new Error(
      "Default Brevo folder not found; choose a folder before setup.",
    );
  let list = matches[0];
  const attributes = await api("contacts/attributes");
  const missing = attributeNames.filter((name) => {
    const existing = attributes.attributes?.find((item) => item.name === name);
    if (
      existing &&
      (existing.category !== "normal" || existing.type !== "text")
    )
      throw new Error(
        `Attribute ${name} has a conflicting type; it was not changed.`,
      );
    return !existing;
  });
  const templates = await all("smtp/templates", "templates");
  const templateMatches = templates.filter(
    (item) => item.name === templateName,
  );
  if (templateMatches.length > 1)
    throw new Error(
      "Multiple matching confirmation templates; resolve the duplicate before setup.",
    );
  let template = templateMatches[0];
  if (template) {
    const detail = await api(`smtp/templates/${template.id}`);
    if (
      !detail.isActive ||
      detail.doiTemplate !== true ||
      !detail.htmlContent?.includes("{{ params.DOIurl }}") ||
      detail.sender?.email?.toLowerCase() !== email ||
      detail.replyTo?.toLowerCase() !== email
    ) {
      throw new Error(
        "The existing confirmation template needs review; it was not changed.",
      );
    }
  }
  console.log(
    JSON.stringify({
      senderVerified: true,
      mode: apply ? "apply" : "preview",
      createList: !list,
      createAttributes: missing,
      createTemplate: !template,
      sendsEmail: false,
    }),
  );
  if (apply) {
    if (!list) list = await api("contacts/lists", { name: listName, folderId });
    await saveSetting("BREVO_WAITLIST_LIST_ID", list.id);
    for (const name of missing)
      await api(`contacts/attributes/normal/${name}`, { type: "text" });
    if (!template)
      template = await api("smtp/templates", {
        sender: { id: sender.id },
        templateName,
        subject: "Confirm your 9inetales waitlist signup",
        htmlContent: await readFile(
          new URL("../docs/email/confirmation.html", import.meta.url),
          "utf8",
        ),
        isActive: true,
        replyTo: email,
        tag: "optin",
      });
    await saveSetting("BREVO_DOI_TEMPLATE_ID", template.id);
    // Read back actual provider records rather than relying only on create responses.
    const savedList = await api(`contacts/lists/${list.id}`);
    const savedTemplate = await api(`smtp/templates/${template.id}`);
    const savedAttributes = await api("contacts/attributes");
    if (
      savedList.name !== listName ||
      !savedTemplate.isActive ||
      savedTemplate.doiTemplate !== true ||
      !savedTemplate.htmlContent?.includes("{{ params.DOIurl }}") ||
      !attributeNames.every((name) =>
        savedAttributes.attributes?.some(
          (item) => item.name === name && item.type === "text",
        ),
      )
    ) {
      throw new Error(
        "Provider read-back did not match setup; collection remains disabled.",
      );
    }
    console.log(
      JSON.stringify({
        setupVerified: true,
        listId: list.id,
        templateId: template.id,
        collectionEnabled: process.env.WAITLIST_ENABLED === "true",
        sendsEmail: false,
      }),
    );
  }
} catch (error) {
  console.error(
    error instanceof Error && error.message.startsWith("Brevo setup")
      ? error.message
      : error instanceof Error && !error.message.includes(apiKey)
        ? error.message
        : "Setup failed; credentials were not displayed.",
  );
  process.exitCode = 1;
}
