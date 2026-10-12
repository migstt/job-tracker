import type { Stage } from "@/lib/stages";

// Made-up data for the preview on the sign in page.

export const previewTasks = [
  { id: 1, company: "Northwind Labs", note: "Applied 7 days ago. Send a follow-up.", stage: "applied" },
  { id: 2, company: "Blue Harbor Studio", note: "Interview today at 3:00 PM.", stage: "technical" },
  { id: 3, company: "Pine Street Software", note: "No reply after 14 days. Mark it and move on.", stage: "applied" },
] satisfies { id: number; company: string; note: string; stage: Stage }[];

export const previewApplications = [
  { id: 1, company: "Northwind Labs", role: "Full Stack Developer", stage: "applied" },
  { id: 2, company: "Blue Harbor Studio", role: "Frontend Developer", stage: "technical" },
  { id: 3, company: "Pine Street Software", role: "Web Developer", stage: "applied" },
  { id: 4, company: "Lantern Apps", role: "React Developer", stage: "offer" },
  { id: 5, company: "Gray Finch Media", role: "Web Developer", stage: "rejected" },
  { id: 6, company: "Oakline Systems", role: "Backend Developer", stage: "draft" },
] satisfies { id: number; company: string; role: string; stage: Stage }[];

// Each filter shows a group of stages. null means every stage.
export const previewFilters = [
  { value: "all", label: "All", stages: null },
  { value: "applied", label: "Applied", stages: ["applied"] },
  { value: "interview", label: "Interview", stages: ["screening", "technical", "final", "offer"] },
  { value: "closed", label: "Closed", stages: ["rejected", "no_reply"] },
] satisfies { value: string; label: string; stages: Stage[] | null }[];

export const previewCounts = [
  { label: "Applied", value: 12 },
  { label: "Replies", value: 4 },
  { label: "Interviews", value: 2 },
];

export const previewReplyRates = [
  { source: "Referral", percent: 75 },
  { source: "Job board", percent: 40 },
  { source: "Company site", percent: 20 },
];
