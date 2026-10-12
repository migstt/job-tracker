export type NavItem = {
  href: string;
  label: string;
};

// The main nav, defined once. The header and the mobile menu both read this.
export const navItems: NavItem[] = [
  { href: "/", label: "Today" },
  { href: "/applications", label: "Applications" },
  { href: "/skipped", label: "Skipped" },
  { href: "/stats", label: "Stats" },
];

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
