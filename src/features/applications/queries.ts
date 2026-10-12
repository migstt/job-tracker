import type { Stage } from "@/lib/stages";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

import type { ApplicationInput } from "./schema";

export type Application = Tables<"applications">;

const listColumns = "id, company, role, source, stage, applied_on, next_step, next_step_on";

export type ApplicationListItem = Pick<
  Application,
  "id" | "company" | "role" | "source" | "stage" | "applied_on" | "next_step" | "next_step_on"
>;

type ListFilters = {
  search?: string;
  stage?: Stage;
};

// RLS limits every query here to the signed-in user's rows.
export async function listApplications({ search, stage }: ListFilters): Promise<ApplicationListItem[]> {
  const supabase = await createClient();
  let query = supabase
    .from("applications")
    .select(listColumns)
    .order("created_at", { ascending: false });

  if (stage) query = query.eq("stage", stage);

  // These characters have a meaning in the filter text below, so they are taken out.
  const term = search?.replace(/[,()"\\%*]/g, " ").trim();
  if (term) query = query.or(`company.ilike.%${term}%,role.ilike.%${term}%`);

  const { data, error } = await query;
  if (error) throw new Error("Could not load applications.", { cause: error });
  return data;
}

export async function getApplication(id: number): Promise<Application | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("applications").select("*").eq("id", id).maybeSingle();

  if (error) throw new Error("Could not load the application.", { cause: error });
  return data;
}

// user_id is not sent. The column default fills in the signed-in user.
export async function insertApplication(input: ApplicationInput): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from("applications").insert(input);
  return !error;
}

// Returns false when nothing was saved, also when the row is not this user's.
export async function updateApplicationRow(id: number, input: ApplicationInput): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("applications")
    .update(input)
    .eq("id", id)
    .select("id")
    .maybeSingle();
  return !error && data !== null;
}
