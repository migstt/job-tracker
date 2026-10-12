import { Button } from "@/components/ui/button";

import { signInWithGoogle } from "../actions";

export function GoogleSignInButton() {
  return (
    <form action={signInWithGoogle}>
      <Button type="submit" size="lg" className="w-full">
        Continue with Google
      </Button>
    </form>
  );
}
