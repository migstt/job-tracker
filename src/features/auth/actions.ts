"use server";

import { redirect } from "next/navigation";

import { siteUrl } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

import { loginPathWithError } from "./errors";

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${siteUrl}/auth/callback` },
  });

  if (error || !data.url) {
    redirect(loginPathWithError("failed"));
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
