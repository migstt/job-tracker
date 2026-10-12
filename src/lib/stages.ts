import { Constants, type Database } from "@/lib/supabase/database.types";

// The stage type and order come from the database enum, so they cannot drift.
export type Stage = Database["public"]["Enums"]["application_stage"];

export const stages = Constants.public.Enums.application_stage;

// The site is monochrome, so a stage is told apart by badge style, not color.
// "draft" is not sent yet, "active" is in progress, "won" is an offer, "closed" is over.
export type StageLook = "draft" | "active" | "won" | "closed";

// Record<Stage, ...> makes a missing stage a type error.
export const stageInfo: Record<Stage, { label: string; look: StageLook }> = {
  draft: { label: "Draft", look: "draft" },
  applied: { label: "Applied", look: "active" },
  screening: { label: "Screening", look: "active" },
  technical: { label: "Technical", look: "active" },
  final: { label: "Final", look: "active" },
  offer: { label: "Offer", look: "won" },
  rejected: { label: "Rejected", look: "closed" },
  no_reply: { label: "No reply", look: "closed" },
};

export function isStage(value: string): value is Stage {
  return (stages as readonly string[]).includes(value);
}
