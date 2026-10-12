import { GoogleIcon } from "@/components/icons/google-icon";
import { SubmitButton } from "@/components/submit-button";

import { signInWithGoogle } from "../actions";

export function GoogleSignInButton() {
  return (
    <form action={signInWithGoogle}>
      <SubmitButton
        variant="outline"
        size="lg"
        className="h-11 w-full gap-3 text-base"
        icon={<GoogleIcon className="size-5" />}
        pendingLabel="Opening Google…"
      >
        Continue with Google
      </SubmitButton>
    </form>
  );
}
