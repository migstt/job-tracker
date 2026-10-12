import type { Metadata } from "next";
import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleSignInButton } from "@/features/auth/components/google-sign-in-button";
import { signInErrorMessage } from "@/features/auth/errors";
import { getCurrentUser } from "@/features/auth/queries";
import { siteDescription, siteName } from "@/lib/site";

export const metadata: Metadata = { title: "Sign in" };

// The page reads the session and the error code from the URL, so it waits for the request.
export const instant = false;

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const user = await getCurrentUser();
  if (user) redirect("/");

  const { error } = await searchParams;
  const errorMessage = signInErrorMessage(typeof error === "string" ? error : undefined);

  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            <h1>{siteName}</h1>
          </CardTitle>
          <CardDescription>{siteDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <GoogleSignInButton />
          {errorMessage ? (
            <p role="alert" className="text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}
