import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return <PageHeader title="Settings" description="Follow-up days, export, and account options will show here." />;
}
