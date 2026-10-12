import { ArrowRightIcon } from "lucide-react";

import { StageBadge } from "@/components/stage-badge";
import { formatDate } from "@/lib/dates";

import type { StageEvent } from "../queries";

export function StageHistory({ events }: { events: StageEvent[] }) {
  if (events.length === 0) {
    return <p className="text-muted-foreground">No stage changes yet.</p>;
  }

  return (
    <ol className="flex flex-col gap-4">
      {events.map(({ id, from_stage, to_stage, happened_on, note }) => (
        <li key={id} className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {from_stage ? (
              <>
                <StageBadge stage={from_stage} />
                <ArrowRightIcon className="size-3.5 text-muted-foreground" aria-label="changed to" />
              </>
            ) : (
              <span className="text-muted-foreground">Added as</span>
            )}
            <StageBadge stage={to_stage} />
          </div>
          <time dateTime={happened_on} className="text-xs text-muted-foreground">
            {formatDate(happened_on)}
          </time>
          {note ? <p>{note}</p> : null}
        </li>
      ))}
    </ol>
  );
}
