import { PlusIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function AddApplicationButton() {
  return (
    <Button nativeButton={false} render={<Link href="/applications/new" />}>
      <PlusIcon data-icon="inline-start" />
      Add application
    </Button>
  );
}
