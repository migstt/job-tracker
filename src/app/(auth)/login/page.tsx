import { BriefcaseBusinessIcon, CircleAlertIcon, LockIcon } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageContainer } from "@/components/page-container";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppPreview } from "@/features/auth/components/app-preview";
import { GoogleSignInButton } from "@/features/auth/components/google-sign-in-button";
import { signInErrorMessage } from "@/features/auth/errors";
import { getCurrentUser } from "@/features/auth/queries";
import { siteName } from "@/lib/site";

export const metadata: Metadata = { title: "Sign in" };

// The page reads the session and the error code from the URL, so it waits for the request.
export const instant = false;

const panel = "flex items-center justify-center py-10";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const user = await getCurrentUser();
  if (user) redirect("/");

  const { error } = await searchParams;
  const errorMessage = signInErrorMessage(typeof error === "string" ? error : undefined);

  // On a phone the sign in part comes first and the preview is below it.
  // From the lg width up they sit side by side, with the preview on the left.
  return (
    <main className="grid flex-1 lg:grid-cols-2">
      <section aria-label="Sign in" className="flex lg:order-last">
        <PageContainer className={panel}>
          <div className="flex w-full max-w-sm flex-col gap-10">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BriefcaseBusinessIcon className="size-5" aria-hidden="true" />
              </span>
              <span className="text-lg font-semibold tracking-tight">{siteName}</span>
            </div>

            <div className="flex flex-col gap-3">
              <h1 className="text-3xl leading-tight font-semibold tracking-tight text-balance">
                Know what to follow up on today
              </h1>
              <p className="text-pretty text-muted-foreground">
                A simple tracker for your job applications. It does what a sheet cannot.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Sign in</CardTitle>
                <CardDescription>Use your Google account. There is no password to set.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <GoogleSignInButton />
                {errorMessage ? (
                  <Alert>
                    <CircleAlertIcon />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                ) : null}
              </CardContent>
              <CardFooter className="gap-2 text-xs text-muted-foreground">
                <LockIcon className="size-3.5 shrink-0" aria-hidden="true" />
                Your data is private to you.
              </CardFooter>
            </Card>
          </div>
        </PageContainer>
      </section>

      <section aria-label="Preview" className="flex border-t bg-muted lg:border-t-0 lg:border-r">
        <PageContainer className={panel}>
          <AppPreview />
        </PageContainer>
      </section>
    </main>
  );
}
