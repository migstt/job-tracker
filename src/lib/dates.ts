const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });

// Turns a database date like "2026-10-12" into "Oct 12, 2026".
// A date column has no time zone, so it is read as UTC to keep the same day everywhere.
export function formatDate(isoDate: string): string {
  return dateFormat.format(new Date(`${isoDate}T00:00:00Z`));
}
