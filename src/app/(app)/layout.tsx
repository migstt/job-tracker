import { redirect } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { getCurrentUser } from "@/features/auth/queries";

// These pages are private and built per user, so there is nothing to prerender.
// This lets the layout wait for the session check before it renders.
export const instant = false;

// Every page in the (app) group needs a signed-in user.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <>
      <SiteHeader user={user} />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-6">
        {children}
      </main>
    </>
  );
}
