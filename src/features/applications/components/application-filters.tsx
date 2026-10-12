import { SearchIcon } from "lucide-react";
import Form from "next/form";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Stage, stageInfo, stages } from "@/lib/stages";

const allStages = "all";

const stageItems = [
  { value: allStages, label: "All stages" },
  ...stages.map((stage) => ({ value: stage, label: stageInfo[stage].label })),
];

type ApplicationFiltersProps = {
  search: string;
  stage: Stage | undefined;
};

// A plain GET form: sending it puts ?q= and ?stage= in the URL,
// so a search can be reloaded or shared, and it works without extra state.
export function ApplicationFilters({ search, stage }: ApplicationFiltersProps) {
  const filtered = search !== "" || stage !== undefined;

  return (
    // The key resets the fields when the URL changes, for example after "Clear".
    <Form
      key={`${search}|${stage ?? allStages}`}
      action="/applications"
      className="flex flex-wrap items-center gap-2"
    >
      <Label htmlFor="q" className="sr-only">
        Search by company or role
      </Label>
      <Input
        id="q"
        name="q"
        type="search"
        defaultValue={search}
        placeholder="Search company or role"
        className="w-full sm:w-64"
      />
      <Label htmlFor="stage-filter" className="sr-only">
        Stage
      </Label>
      <Select name="stage" items={stageItems} defaultValue={stage ?? allStages}>
        <SelectTrigger id="stage-filter" className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {stageItems.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button type="submit" variant="outline">
        <SearchIcon data-icon="inline-start" />
        Search
      </Button>
      {filtered ? (
        <Button variant="ghost" nativeButton={false} render={<Link href="/applications" />}>
          Clear
        </Button>
      ) : null}
    </Form>
  );
}
