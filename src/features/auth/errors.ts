// Sign in error codes passed in the URL as /login?error=<code>.
// Only these codes are shown, so text from the URL is never rendered.
const signInErrors = {
  cancelled: "Sign in was cancelled. Please try again.",
  failed: "We could not sign you in. Please try again.",
} as const;

export type SignInErrorCode = keyof typeof signInErrors;

export function signInErrorMessage(code: string | undefined): string | null {
  if (!code) return null;
  return code in signInErrors
    ? signInErrors[code as SignInErrorCode]
    : signInErrors.failed;
}

export function loginPathWithError(code: SignInErrorCode): string {
  return `/login?error=${code}`;
}
