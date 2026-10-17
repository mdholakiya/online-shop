import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Proxy (formerly "middleware") runs before /admin pages render.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

// Only run on admin routes; the public shop doesn't need auth.
export const config = {
  matcher: ["/admin/:path*"],
};
