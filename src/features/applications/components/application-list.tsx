import Link from "next/link";

import { StageBadge } from "@/components/stage-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/dates";

import type { ApplicationListItem } from "../queries";

const empty = "–";

function detailPath(id: number) {
  return `/applications/${id}`;
}

function nextStepText({ next_step, next_step_on }: Pick<ApplicationListItem, "next_step" | "next_step_on">) {
  const parts = [next_step, next_step_on ? formatDate(next_step_on) : null].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : empty;
}

const companyLink = "font-medium underline-offset-4 hover:underline";

// A table needs width, so a phone gets a list of cards with the same data.
export function ApplicationList({ applications }: { applications: ApplicationListItem[] }) {
  return (
    <>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Next step</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>
                  <Link href={detailPath(application.id)} className={companyLink}>
                    {application.company}
                  </Link>
                </TableCell>
                <TableCell>{application.role}</TableCell>
                <TableCell>{application.source ?? empty}</TableCell>
                <TableCell>
                  <StageBadge stage={application.stage} />
                </TableCell>
                <TableCell>{application.applied_on ? formatDate(application.applied_on) : empty}</TableCell>
                <TableCell>{nextStepText(application)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul className="flex flex-col gap-3 md:hidden">
        {applications.map((application) => (
          <li key={application.id}>
            <Card size="sm">
              <CardHeader>
                <CardTitle>
                  <Link href={detailPath(application.id)} className={companyLink}>
                    {application.company}
                  </Link>
                </CardTitle>
                <CardDescription>{application.role}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <StageBadge stage={application.stage} />
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
                  <dt className="text-muted-foreground">Source</dt>
                  <dd>{application.source ?? empty}</dd>
                  <dt className="text-muted-foreground">Applied</dt>
                  <dd>{application.applied_on ? formatDate(application.applied_on) : empty}</dd>
                  <dt className="text-muted-foreground">Next step</dt>
                  <dd>{nextStepText(application)}</dd>
                </dl>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
