import { createBrowserClient } from "@supabase/ssr";

import { supabasePublishableKey, supabaseUrl } from "./env";

// For Client Components. createBrowserClient reuses one instance,
// so calling this many times is cheap.
export function createClient() {
  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}
