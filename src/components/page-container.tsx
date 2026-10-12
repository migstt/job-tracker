import { cn } from "@/lib/utils";

// The page width and side gutter, defined once.
// The header and every page use this, so their edges always line up.
export function PageContainer({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 md:px-6", className)} {...props} />;
}
