import "server-only";
import { getWaitlistConfig } from "@/lib/waitlist/config";
import { createWaitlistHandler } from "@/lib/waitlist/handler";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return createWaitlistHandler(getWaitlistConfig())(request);
}
