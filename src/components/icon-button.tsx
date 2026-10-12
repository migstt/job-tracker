import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type IconButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "aria-label" | "variant" | "size"
> & {
  // Used for both the tooltip and the screen reader name.
  label: string;
};

// A button that shows only an icon, with a tooltip that says what it does.
// Other props are passed to the button, so it also works as a trigger:
// <SheetTrigger render={<IconButton label="Open menu" />}>
export function IconButton({ label, children, ...props }: IconButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="ghost" size="icon" aria-label={label} {...props} />}>
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
