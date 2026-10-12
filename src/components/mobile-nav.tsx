"use client";

import { MenuIcon } from "lucide-react";
import { useState } from "react";

import { NavLinks } from "@/components/nav-links";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteName } from "@/lib/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className="md:hidden" />}
        aria-label="Open menu"
      >
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>{siteName}</SheetTitle>
          <SheetDescription className="sr-only">Main menu</SheetDescription>
        </SheetHeader>
        <NavLinks
          className="flex flex-col gap-1 px-4"
          linkClassName="py-2 text-base"
          onNavigate={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
