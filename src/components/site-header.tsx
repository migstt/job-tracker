import Link from "next/link";

import { MobileNav } from "@/components/mobile-nav";
import { NavLinks } from "@/components/nav-links";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import type { CurrentUser } from "@/features/auth/queries";
import { siteName } from "@/lib/site";

type SiteHeaderProps = {
  user: Pick<CurrentUser, "name" | "email">;
};

export function SiteHeader({ user }: SiteHeaderProps) {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-2 px-4">
        <MobileNav />
        <Link href="/" className="mr-4 font-semibold">
          {siteName}
        </Link>
        <NavLinks className="hidden items-center gap-1 md:flex" />
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <UserMenu name={user.name} email={user.email} />
        </div>
      </div>
    </header>
  );
}
