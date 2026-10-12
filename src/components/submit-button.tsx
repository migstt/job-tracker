"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type SubmitButtonProps = Omit<React.ComponentProps<typeof Button>, "type" | "disabled"> & {
  pendingLabel: string;
  icon?: React.ReactNode;
};

// A submit button that shows a spinner while its form is being sent.
// useFormStatus reads the nearest <form>, so this must be rendered inside one.
export function SubmitButton({ pendingLabel, icon, children, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? <Spinner data-icon="inline-start" /> : icon}
      {pending ? pendingLabel : children}
    </Button>
  );
}
