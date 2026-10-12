import { CalendarCheckIcon } from "lucide-react";
import type { Metadata } from "next";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Today" };

export default function TodayPage() {
  return (
    <>
      <PageHeader title="Today" description="Follow-ups that are due will show here." />
      <EmptyState icon={CalendarCheckIcon} title="Nothing is due" description="When a follow-up is due, it will show here." />
    </>
  );
}
