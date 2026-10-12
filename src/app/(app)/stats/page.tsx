import { ChartColumnIcon } from "lucide-react";
import type { Metadata } from "next";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Stats" };

export default function StatsPage() {
  return (
    <>
      <PageHeader title="Stats" description="Counts by stage and reply rates will show here." />
      <EmptyState icon={ChartColumnIcon} title="No stats yet" description="Stats will show after you add some applications." />
    </>
  );
}
