import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "./database.types";
import { supabasePublishableKey, supabaseUrl } from "./env";

// For Client Components. createBrowserClient reuses one instance,
// so calling this many times is cheap.
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabasePublishableKey);
}
