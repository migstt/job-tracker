"use client";

import { useState } from "react";

import { StageBadge } from "@/components/stage-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

import {
  previewApplications,
  previewCounts,
  previewFilters,
  previewReplyRates,
  previewTasks,
} from "./preview-data";

const rowList = "flex flex-col divide-y";
const row = "flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0";

function TodayPreview() {
  const [doneIds, setDoneIds] = useState<number[]>([]);
  const left = previewTasks.length - doneIds.length;

  function toggleDone(id: number) {
    setDoneIds((ids) => (ids.includes(id) ? ids.filter((other) => other !== id) : [...ids, id]));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today</CardTitle>
        <CardDescription aria-live="polite">
          {left === 0 ? "All done for today" : `${left} to do`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className={rowList}>
          {previewTasks.map(({ id, company, note, stage }) => {
            const done = doneIds.includes(id);
            return (
              <li key={id} className={row}>
                <div className={cn("flex min-w-0 flex-col gap-1", done && "text-muted-foreground line-through")}>
                  <span className="flex items-center gap-2 font-medium">
                    <span className="truncate">{company}</span>
                    <StageBadge stage={stage} />
                  </span>
                  <span className="text-xs text-muted-foreground">{note}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => toggleDone(id)}>
                  {done ? "Undo" : "Done"}
                </Button>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

function ApplicationsPreview() {
  const [filterValue, setFilterValue] = useState("all");
  const shownStages = previewFilters.find(({ value }) => value === filterValue)?.stages ?? null;
  const shown = previewApplications.filter(
    ({ stage }) => !shownStages || shownStages.some((shownStage) => shownStage === stage),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Applications</CardTitle>
        <CardDescription aria-live="polite">{shown.length} shown</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ToggleGroup
          aria-label="Filter by stage"
          variant="outline"
          size="sm"
          value={[filterValue]}
          // Base UI gives an empty list when the active item is pressed again. Keep one selected.
          onValueChange={([next]) => next && setFilterValue(next)}
        >
          {previewFilters.map(({ value, label }) => (
            <ToggleGroupItem key={value} value={value}>
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        {shown.length > 0 ? (
          <ul className={rowList}>
            {shown.map(({ id, company, role, stage }) => (
              <li key={id} className={row}>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate font-medium">{company}</span>
                  <span className="truncate text-xs text-muted-foreground">{role}</span>
                </div>
                <StageBadge stage={stage} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Nothing in this group.</p>
        )}
      </CardContent>
    </Card>
  );
}

function StatsPreview() {
  return (
    <div className="flex flex-col gap-4">
      <dl className="grid grid-cols-3 gap-4">
        {previewCounts.map(({ label, value }) => (
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
            {previewReplyRates.map(({ source, percent }) => (
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

// A small working copy of the app with made-up data, so people can try it before they sign in.
export function AppPreview() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-tight">Try it</h2>
        <p className="text-sm text-muted-foreground">
          This is sample data. Click around, then sign in to track your own applications.
        </p>
      </div>

      {/* A fixed height stops the page from jumping when the tab changes. */}
      <Tabs defaultValue="today" className="min-h-[26rem]">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>
        <TabsContent value="today">
          <TodayPreview />
        </TabsContent>
        <TabsContent value="applications">
          <ApplicationsPreview />
        </TabsContent>
        <TabsContent value="stats">
          <StatsPreview />
        </TabsContent>
      </Tabs>
    </div>
  );
}
