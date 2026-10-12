import { BriefcaseBusinessIcon, SearchXIcon } from "lucide-react";
import type { Metadata } from "next";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { AddApplicationButton } from "@/features/applications/components/add-application-button";
import { ApplicationFilters } from "@/features/applications/components/application-filters";
import { ApplicationList } from "@/features/applications/components/application-list";
import { listApplications } from "@/features/applications/queries";
import { isStage } from "@/lib/stages";

export const metadata: Metadata = { title: "Applications" };

export default async function ApplicationsPage({ searchParams }: PageProps<"/applications">) {
  const { q, stage: stageParam } = await searchParams;
  const search = typeof q === "string" ? q.trim() : "";
  // Anything that is not a real stage, like "all" or a typo in the URL, means no filter.
  const stage = typeof stageParam === "string" && isStage(stageParam) ? stageParam : undefined;
  const filtered = search !== "" || stage !== undefined;

  const applications = await listApplications({ search, stage });

  return (
    <>
      <PageHeader
        title="Applications"
        description="Every job you applied to, newest first."
        actions={<AddApplicationButton />}
      />
      {applications.length > 0 || filtered ? <ApplicationFilters search={search} stage={stage} /> : null}
      {applications.length > 0 ? (
        <ApplicationList applications={applications} />
      ) : filtered ? (
        <EmptyState
          icon={SearchXIcon}
          title="Nothing found"
          description="No application matches this search. Try other words or another stage."
        />
      ) : (
        <EmptyState
          icon={BriefcaseBusinessIcon}
          title="No applications yet"
          description="Add the first job you applied to, or one you plan to apply to."
          action={<AddApplicationButton />}
        />
      )}
    </>
  );
}
