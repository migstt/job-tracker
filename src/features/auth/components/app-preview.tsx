import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Made-up data. It shows people what the app does before they sign in.
const dueToday = [
  {
    company: "Northwind Labs",
    role: "Full Stack Developer",
    note: "Applied 7 days ago. Send a follow-up.",
    stage: "Applied",
  },
  {
    company: "Blue Harbor Studio",
    role: "Frontend Developer",
    note: "Interview today at 3:00 PM.",
    stage: "Technical",
  },
  {
    company: "Pine Street Software",
    role: "Web Developer",
    note: "No reply after 14 days. Mark it and move on.",
    stage: "Applied",
  },
];

const counts = [
  { label: "Applied", value: 12 },
  { label: "Replies", value: 4 },
  { label: "Interviews", value: 2 },
];

const replyRates = [
  { source: "Referral", percent: 75 },
  { source: "Job board", percent: 40 },
  { source: "Company site", percent: 20 },
];

export function AppPreview() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-tight">A look inside</h2>
        <p className="text-sm text-muted-foreground">
          This is sample data. Sign in to track your own applications.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today</CardTitle>
          <CardDescription>3 things to do</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col divide-y">
            {dueToday.map(({ company, role, note, stage }) => (
              <li key={company} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate font-medium">{company}</span>
                  <span className="truncate text-muted-foreground">{role}</span>
                  <span className="text-xs text-muted-foreground">{note}</span>
                </div>
                <Badge variant={stage === "Applied" ? "outline" : "default"}>{stage}</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <dl className="grid grid-cols-3 gap-4">
        {counts.map(({ label, value }) => (
          <Card key={label} size="sm">
            <CardContent className="flex flex-col-reverse gap-1">
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="text-2xl font-semibold tabular-nums">{value}</dd>
            </CardContent>
          </Card>
        ))}
      </dl>

      <Card>
        <CardHeader>
          <CardTitle>Reply rate by source</CardTitle>
          <CardDescription>See which job sites reply to you</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-3">
            {replyRates.map(({ source, percent }) => (
              <li key={source} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs">
                  <span>{source}</span>
                  <span className="text-muted-foreground tabular-nums">{percent}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted" aria-hidden="true">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
