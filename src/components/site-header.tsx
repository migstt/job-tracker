import Link from "next/link";

import { MobileNav } from "@/components/mobile-nav";
import { NavLinks } from "@/components/nav-links";
import { PageContainer } from "@/components/page-container";
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
      <PageContainer className="flex h-14 items-center gap-2">
        <MobileNav />
        <Link href="/" className="mr-4 font-semibold">
          {siteName}
        </Link>
        <NavLinks className="hidden items-center gap-1 md:flex" />
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <UserMenu name={user.name} email={user.email} />
        </div>
      </PageContainer>
    </header>
  );
}
