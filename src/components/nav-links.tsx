"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isActivePath, navItems } from "@/lib/nav";
import { cn } from "@/lib/utils";

type NavLinksProps = {
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
};

// The nav links, used by the header on wide screens and by the mobile menu.
export function NavLinks({ className, linkClassName, onNavigate }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className={className}>
      {navItems.map(({ href, label }) => {
        const active = isActivePath(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
              active && "bg-muted text-foreground",
              linkClassName,
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
