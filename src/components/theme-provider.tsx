"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// next-themes adds a small script that sets the theme before the page paints.
// It only needs to run in the server HTML. In the browser, React warns about
// script tags inside components, so there the tag is marked as plain data.
const scriptProps =
  typeof window === "undefined" ? undefined : ({ type: "application/json" } as const);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      scriptProps={scriptProps}
    >
      {children}
    </NextThemesProvider>
  );
}
