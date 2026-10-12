import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { createApplication } from "@/features/applications/actions";
import { ApplicationForm } from "@/features/applications/components/application-form";
import { emptyApplicationValues } from "@/features/applications/schema";

export const metadata: Metadata = { title: "Add application" };

export default function NewApplicationPage() {
  return (
    <>
      <PageHeader title="Add application" description="Only company and role are required." />
      <ApplicationForm
        initialValues={emptyApplicationValues}
        save={createApplication}
        savedMessage="Application added."
        submitLabel="Add application"
        returnTo="/applications"
      />
    </>
  );
}
