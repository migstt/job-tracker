import { PencilIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { StageBadge } from "@/components/stage-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationDetails } from "@/features/applications/components/application-details";
import { DeleteApplicationButton } from "@/features/applications/components/delete-application-button";
import { StageHistory } from "@/features/applications/components/stage-history";
import { getApplication, listStageEvents } from "@/features/applications/queries";
import { parseApplicationId } from "@/features/applications/rules";
import { formatDate } from "@/lib/dates";

export const metadata: Metadata = { title: "Application" };

export default async function ApplicationPage({ params }: PageProps<"/applications/[id]">) {
  const id = parseApplicationId((await params).id);
  if (id === null) notFound();

  // The two reads do not depend on each other, so they run at the same time.
  // RLS returns no row for another user's id, so that is also "not found".
  const [application, events] = await Promise.all([getApplication(id), listStageEvents(id)]);
  if (!application) notFound();

  const longTexts = [
    { title: "Job post", text: application.job_post },
    { title: "Message I sent", text: application.message_sent },
    { title: "Notes", text: application.notes },
  ].filter((section): section is { title: string; text: string } => section.text !== null);

  return (
    <>
      <PageHeader
        title={application.company}
        description={application.role}
        actions={
          <>
            <Button nativeButton={false} render={<Link href={`/applications/${id}/edit`} />}>
              <PencilIcon data-icon="inline-start" />
              Edit
            </Button>
            <DeleteApplicationButton id={id} company={application.company} />
          </>
        }
      />

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <ApplicationDetails application={application} />
            </CardContent>
          </Card>
          {longTexts.map(({ title, text }) => (
            <Card key={title}>
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="break-words whitespace-pre-wrap">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Stage</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <StageBadge stage={application.stage} />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">Next step</span>
                <span>{application.next_step ?? "–"}</span>
                {application.next_step_on ? (
                  <time dateTime={application.next_step_on} className="text-xs text-muted-foreground">
                    {formatDate(application.next_step_on)}
                  </time>
                ) : null}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Stage history</CardTitle>
            </CardHeader>
            <CardContent>
              <StageHistory events={events} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
