import { Badge } from "@/components/ui/badge";
import { type Stage, type StageLook, stageInfo } from "@/lib/stages";

const lookProps: Record<StageLook, React.ComponentProps<typeof Badge>> = {
  draft: { variant: "outline", className: "border-dashed" },
  active: { variant: "secondary" },
  won: { variant: "default" },
  closed: { variant: "outline", className: "text-muted-foreground" },
};

export function StageBadge({ stage }: { stage: Stage }) {
  const { label, look } = stageInfo[stage];
  return <Badge {...lookProps[look]}>{label}</Badge>;
}
