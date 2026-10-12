"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { IconButton } from "@/components/icon-button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  // Both icons are always rendered and CSS shows one. This way the server
  // and the browser render the same HTML, whatever the theme is.
  return (
    <IconButton
      label="Switch theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <SunIcon className="dark:hidden" />
      <MoonIcon className="hidden dark:block" />
    </IconButton>
  );
}
