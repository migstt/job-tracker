import { BriefcaseBusinessIcon } from "lucide-react";
import type { Metadata } from "next";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Applications" };

export default function ApplicationsPage() {
  return (
    <>
      <PageHeader title="Applications" description="All your applications will show here." />
      <EmptyState icon={BriefcaseBusinessIcon} title="No applications yet" description="Jobs you apply to will be listed here." />
    </>
  );
}
