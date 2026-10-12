import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";

import type { Database } from "./database.types";
import { supabasePublishableKey, supabaseUrl } from "./env";

// For Server Components, Server Actions, and Route Handlers.
// Make a new client on every request, because each request has its own cookies.
export async function createClient() {
  // The Supabase client compares the session expiry with the current time.
  // connection() tells Next.js this code only runs for a real request,
  // so reading the clock is allowed.
  await connection();
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components cannot write cookies. The proxy refreshes the
          // session on every request, so it is safe to skip the write here.
        }
      },
    },
  });
}
