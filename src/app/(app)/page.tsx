import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Today" };

export default function TodayPage() {
  return <PageHeader title="Today" description="Follow-ups that are due will show here." />;
}
