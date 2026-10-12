import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { updateApplication } from "@/features/applications/actions";
import { ApplicationForm } from "@/features/applications/components/application-form";
import { getApplication } from "@/features/applications/queries";
import { toFormValues } from "@/features/applications/schema";

export const metadata: Metadata = { title: "Edit application" };

export default async function EditApplicationPage({ params }: PageProps<"/applications/[id]/edit">) {
  const { id: idParam } = await params;
  // Only whole numbers are ids. Anything else, like "abc", is not found.
  if (!/^\d{1,15}$/.test(idParam)) notFound();
  const id = Number(idParam);

  // RLS returns no row for another user's id, so that is also "not found".
  const application = await getApplication(id);
  if (!application) notFound();

  return (
    <>
      <PageHeader title="Edit application" description={`${application.company}, ${application.role}`} />
      <ApplicationForm
        initialValues={toFormValues((field) => application[field])}
        // bind sends the id along with the form. RLS still checks that the row is this user's.
        save={updateApplication.bind(null, id)}
        savedMessage="Changes saved."
        submitLabel="Save changes"
      />
    </>
  );
}
