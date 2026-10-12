import { BriefcaseBusinessIcon, CheckIcon } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { GoogleSignInButton } from "@/features/auth/components/google-sign-in-button";
import { signInErrorMessage } from "@/features/auth/errors";
import { getCurrentUser } from "@/features/auth/queries";
import { siteName } from "@/lib/site";

export const metadata: Metadata = { title: "Sign in" };

// The page reads the session and the error code from the URL, so it waits for the request.
export const instant = false;

const highlights = [
  "See which follow-ups are due today",
  "Keep the job post, your message, and notes in one place",
  "Learn which job sites reply to you",
];

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const user = await getCurrentUser();
  if (user) redirect("/");

  const { error } = await searchParams;
  const errorMessage = signInErrorMessage(typeof error === "string" ? error : undefined);

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-sm flex-col gap-8">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BriefcaseBusinessIcon className="size-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold">{siteName}</span>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-balance">
            Know what to follow up on today
          </h1>
          <p className="text-muted-foreground">
            A simple tracker for your job applications. It does what a sheet cannot.
          </p>
        </div>

        <ul className="flex flex-col gap-2.5 text-sm">
          {highlights.map((text) => (
            <li key={text} className="flex items-start gap-2.5">
              <CheckIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3 border-t pt-8">
          <GoogleSignInButton />
          {errorMessage ? (
            <p role="alert" className="text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground">
            Your Google account is only used to sign you in. Your data is private to you.
          </p>
        </div>
      </div>
    </main>
  );
}
