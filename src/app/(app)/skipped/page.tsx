import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Skipped" };

export default function SkippedPage() {
  return <PageHeader title="Skipped" description="Jobs you looked at and did not apply to will show here." />;
}
