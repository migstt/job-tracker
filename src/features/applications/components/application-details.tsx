import { ExternalLinkIcon } from "lucide-react";

import { formatDate } from "@/lib/dates";

import type { Application } from "../queries";

const empty = "–";

type ApplicationDetailsProps = {
  application: Pick<
    Application,
    | "source"
    | "job_url"
    | "remote"
    | "pay_text"
    | "pay_min_php"
    | "pay_max_php"
    | "my_ask"
    | "applied_on"
    | "resume_used"
    | "contact_name"
  >;
};

const pesos = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });

function payRange(min: number | null, max: number | null): string {
  if (min !== null && max !== null) return `${pesos.format(min)} to ${pesos.format(max)}`;
  if (min !== null) return `From ${pesos.format(min)}`;
  if (max !== null) return `Up to ${pesos.format(max)}`;
  return empty;
}

function JobLink({ url }: { url: string | null }) {
  // Only web links are made clickable. Other text is shown as it is.
  if (!url) return empty;
  if (!/^https?:\/\//i.test(url)) return url;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 break-all underline underline-offset-4"
    >
      Open the job post
      <ExternalLinkIcon className="size-3.5 shrink-0" aria-hidden="true" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

export function ApplicationDetails({ application }: ApplicationDetailsProps) {
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Source", value: application.source ?? empty },
    { label: "Job link", value: <JobLink url={application.job_url} /> },
    { label: "Remote", value: application.remote ?? empty },
    { label: "Pay in the post", value: application.pay_text ?? empty },
    { label: "Pay per month", value: payRange(application.pay_min_php, application.pay_max_php) },
    { label: "Pay I asked for", value: application.my_ask ?? empty },
    { label: "Date applied", value: application.applied_on ? formatDate(application.applied_on) : empty },
    { label: "Resume used", value: application.resume_used ?? empty },
    { label: "Contact", value: application.contact_name ?? empty },
  ];

  return (
    <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
      {rows.map(({ label, value }) => (
        <div key={label} className="flex flex-col gap-0.5">
          <dt className="text-xs text-muted-foreground">{label}</dt>
          <dd className="break-words">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
