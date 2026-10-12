import { SettingsIcon } from "lucide-react";
import type { Metadata } from "next";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Follow-up days, export, and account options will show here." />
      <EmptyState icon={SettingsIcon} title="No settings yet" description="Follow-up days, export, and account options are coming." />
    </>
  );
}
