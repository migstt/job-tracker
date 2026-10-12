import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

export type CurrentUser = {
  id: string;
  email: string | null;
  name: string | null;
};

// The signed-in user, or null. getClaims checks the token's signature, so this
// is safe to use for access checks. cache() makes it run once per request,
// even when a layout and a page both call it.
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data) return null;

  const { claims } = data;
  // user_metadata comes from Google and the user can edit it.
  // Use it for display only, never for access checks.
  const fullName = claims.user_metadata?.full_name;

  return {
    id: claims.sub,
    email: claims.email ?? null,
    name: typeof fullName === "string" && fullName.length > 0 ? fullName : null,
  };
});
