import { BanIcon } from "lucide-react";
import type { Metadata } from "next";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Skipped" };

export default function SkippedPage() {
  return (
    <>
      <PageHeader title="Skipped" description="Jobs you looked at and did not apply to will show here." />
      <EmptyState icon={BanIcon} title="No skipped jobs yet" description="Save a job here so you do not look at it twice." />
    </>
  );
}
