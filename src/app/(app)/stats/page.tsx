import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Stats" };

export default function StatsPage() {
  return <PageHeader title="Stats" description="Counts by stage and reply rates will show here." />;
}
