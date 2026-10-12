import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Applications" };

export default function ApplicationsPage() {
  return <PageHeader title="Applications" description="All your applications will show here." />;
}
