# Waitlist email collection setup

The integration is prepared for normal Next.js deployment on Vercel. It stays in
demonstration mode unless `WAITLIST_ENABLED=true` and every required setting is
valid. A Brevo key alone cannot enable collection. No live credentials belong in
this document or Git. Replace any key pasted into chat before setup.

## Brevo

Account setup completed: verified Gmail sender ID **2**, dedicated confirmed
waitlist list ID **3**, confirmation template ID **1**, and all five text
attributes below. The IDs are saved in private local settings. Redis connectivity
and atomic locks are verified. The operator-approved retention policy is saved
privately. One operator-authorized double opt-in test request was accepted by
Brevo. The operator received the email and confirmed successfully; Brevo list
membership, role `both`, consent version, and signup/consent timestamps were
verified. Public collection remains disabled until production settings are added
and Vercel is redeployed. Use `node scripts/setup-brevo.mjs` for
a read-only setup check; `--apply` creates only missing matching resources and
saves the list/template IDs. The HTML source is `docs/email/confirmation.html`.

`node scripts/test-waitlist-email.mjs --send` requests a real email to the operator
and requires explicit authorization. It exercises the actual signup handler with
role `both` and source `setup-test`, leaving public collection disabled. Until the
new confirmation route is deployed, the test redirect uses the existing homepage.
Do not rerun after an accepted send merely because the contact is still pending.
Exclude the operator's setup-test record from audience metrics/campaigns.

1. Operator: **Yusuf Oladosu**. Proposed sender, reply-to and privacy contact:
   `Ninetales154@gmail.com`. The operator does not currently own a custom domain.
   Verify the sender in Brevo and set sender/reply-to details in the confirmation
   template. Gmail and Vercel's `vercel.app` cannot be authenticated as your own
   domain. Brevo documents a temporary replacement of unauthenticated sender
   domains with `brevosend.com`; confirm availability in this account and test the
   actual received sender before enabling collection. A domain you control is the
   longer-term setup. See [Brevo's temporary sender replacement](https://help.brevo.com/hc/en-us/articles/16045394674066-Troubleshooting-issues-with-domain-authentication-Brevo-code-DKIM-DMARC).
   See [Brevo sender setup](https://help.brevo.com/hc/en-us/articles/208836149-Create-a-new-sender-From-name-and-From-email).
2. Create one dedicated list named **9inetales confirmed waitlist**. Record its
   numeric ID as `BREVO_WAITLIST_LIST_ID`. Do not import unverified addresses into
   this list. List membership from the DOI flow, alongside subscription and
   suppression eligibility, is the campaign gate.
3. Create these **text** contact attributes, with exactly these names:
   `AUDIENCE_ROLE`, `SIGNUP_AT`, `CONSENT_AT`, `CONSENT_VERSION`, `SIGNUP_SOURCE`.
   Timestamps use UTC ISO strings, so use text rather than date-only attributes.
4. Create and activate a double opt-in email template with the tag **optin**.
   Read its details back and confirm `doiTemplate=true`; merely having an active
   transactional template and a DOI variable is insufficient in this account.
   Set its confirmation
   button URL to `{{ params.DOIurl }}`. Never point that button directly at the
   website confirmation page: Brevo must verify the link first. Record its numeric
   ID as `BREVO_DOI_TEMPLATE_ID`.
5. Use this template copy as a starting point:

   **Subject:** Confirm your 9inetales waitlist signup

   **Body:** You requested 9inetales development and early-access emails. Confirm
   your email to join the waitlist. You can unsubscribe from updates at any time.
   If you didn’t request this, ignore this email; you won’t be added to the list.

   **Button:** Confirm my email

   Include the exact consent wording in the email: “I’d like 9inetales development
   and early-access emails. I can unsubscribe at any time.” The application records
   its version as `waitlist-2026-09-17-v1`. Update the version whenever wording changes.

Reference: [Brevo double opt-in API](https://developers.brevo.com/reference/create-doi-contact).
Confirmation links expire after 30 days according to
[Brevo’s DOI guide](https://help.brevo.com/hc/en-us/articles/208733449-Double-opt-in-DOI-What-it-is-and-how-to-track-user-sign-ups).

## Shared spam protection

Create an Upstash Redis database and obtain its HTTPS REST URL and REST token.
Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. See the
[Upstash REST API documentation](https://upstash.com/docs/redis/features/restapi).

The signup function is pinned to Vercel's `iad1` region. Use AWS N. Virginia
(`us-east-1`) for this Redis database so server-to-database requests stay nearby.

The endpoint uses atomic counters and per-email locks shared across all server
instances, a hidden bot trap, server validation, a bounded request body, and
same-origin checks. Missing or unavailable Redis fails closed. Default limits are
five attempts per IP per ten minutes, one provider attempt per address per ten
minutes, and 100 provider attempts per UTC day. Existing-contact checks also count
toward this conservative daily budget. Email campaigns have separate sending costs
and must fit the Brevo account’s current allowance. Add a bot challenge if abuse
requires it; these limits do not identify every automated request.

Generate `WAITLIST_HASH_SECRET` with a cryptographically random value of at least
32 characters. Redis uses HMAC identifiers rather than plaintext addresses/IPs;
it also stores original pending preference/consent/source attributes for 31 days.
On retries, those original attributes are reused. The per-email lock is kept on
failure for ten minutes because a timed-out send might still have been accepted.
Use separate Redis databases/secrets for testing and production. Rotate the hash
secret deliberately: changing it resets address matching and rate identifiers.

The IP header is trusted only on Vercel. Outside Vercel all requests share one
fallback IP bucket; configure a trusted ingress before hosting somewhere else.

## Vercel environment settings

Copy the variable names from `.env.example`. Fill them in `.env.local` for local
work and in Vercel project environment settings for production. The API key must
be a standard Brevo API key, not an SMTP key or an encoded credential wrapper.
Do not prefix any secret with `NEXT_PUBLIC_`.

The operator must supply `WAITLIST_OPERATOR_NAME`, `WAITLIST_PRIVACY_EMAIL`, and an
approved `WAITLIST_RETENTION_NOTICE`. The retention wording is shown verbatim in
the live privacy notice. Decide retention for subscribed contacts, unconfirmed
requests/provider logs, consent proof, and suppression records. The application
does not automatically delete Brevo contacts: configure provider retention or an
operator deletion procedure that fulfils the published policy.

Use `WAITLIST_SITE_URL=https://9inetales.vercel.app` until a custom website domain
is connected. The sender domain is a separate setting in Brevo. Never set
`NEXT_STATIC_EXPORT=true` on Vercel. Redeploy after setting/changing environment
variables: page copy, form mode, and privacy notice are rendered at build time.

Preview deployments should stay disabled. For an active test deployment, use its
exact HTTPS origin as `WAITLIST_SITE_URL`, isolated Redis, and a dedicated Brevo
test list/template. The production endpoint accepts only the configured origin.

## Validation before enabling production

- Run `npm run test:waitlist`, `npm run typecheck`, `npm run build`, and browser
  verification. Tests use fake HTTP transports and never send real emails.
- Test end-to-end with an address owned by the operator: the request must send the
  correct template, and list membership must appear only after confirmation.
- Check the five custom attributes after confirmation. The role must be reader,
  creator, or both; consent timestamps/version must match the request.
- Repeat a confirmed contact’s signup with another role: no update, preference
  change, or resubscription should occur. Repeat with an unsubscribed contact too.
- Confirm unsubscribe and suppression work before any campaign. Archive relevant
  Brevo consent/DOI logs as needed under the approved retention policy.
- Inspect the live privacy page, sender/reply-to details, and confirmation URL.
- Enable only after these settings and the actual provider flow are verified.

The confirmation redirect page is a thank-you page; opening it directly does not
prove membership or create a signup. Public responses are intentionally uniform
for existing contacts and eligible new requests; they do not expose membership.
They also do not promise another email for a repeat request. Preference changes
and resubscriptions require a separate verified-link process; this endpoint never
updates existing Brevo contacts. No custom admin dashboard or optional format
question is collected in live mode.

## Campaign audiences

Use the confirmed list with current subscribed/delivery eligibility:

| Update | `AUDIENCE_ROLE` filter |
| --- | --- |
| Reader updates/testing | reader or both |
| Creator pilot information | creator or both |
| General development update | all roles, once per email |

`both` is one contact. Report total unique confirmed contacts separately from the
overlapping reader and creator segments. Keep unsubscribed, bounced, and suppressed
addresses excluded using Brevo’s sending controls.

## Static snapshots

`npm run export` forces demonstration mode and includes only TSX pages. The
`route.ts` API is omitted from `out/`; this static snapshot cannot collect emails.
Production email collection uses Vercel’s normal Next.js build.
