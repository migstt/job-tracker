"use client";

import { useFormStatus } from "react-dom";

import { GoogleIcon } from "@/components/icons/google-icon";
import { Button } from "@/components/ui/button";

import { signInWithGoogle } from "../actions";

// useFormStatus only works in a component rendered inside the <form>.
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="outline"
      size="lg"
      disabled={pending}
      className="h-11 w-full gap-3 text-base"
    >
      <GoogleIcon className="size-5" />
      {pending ? "Opening Google…" : "Continue with Google"}
    </Button>
  );
}

export function GoogleSignInButton() {
  return (
    <form action={signInWithGoogle}>
      <SubmitButton />
    </form>
  );
}
