"use client";

import { CircleAlertIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { toast } from "sonner";

import { SubmitButton } from "@/components/submit-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { stageInfo, stages } from "@/lib/stages";

import type { SaveResult } from "../actions";
import type { ApplicationField, ApplicationFieldErrors, ApplicationFormValues } from "../schema";

const stageItems = stages.map((stage) => ({ value: stage, label: stageInfo[stage].label }));

type FormState = {
  values: ApplicationFormValues;
  fieldErrors: ApplicationFieldErrors;
  message: string | null;
};

type TextFieldProps = {
  name: ApplicationField;
  label: string;
  state: FormState;
  description?: string;
  multiline?: boolean;
} & Pick<React.ComponentProps<"input">, "type" | "required" | "placeholder" | "inputMode" | "min">;

// One labeled field with its error. Used for every text, date, and number field.
function TextField({ name, label, state, description, multiline, ...inputProps }: TextFieldProps) {
  const errors = state.fieldErrors[name];
  const errorId = `${name}-error`;
  const controlProps = {
    id: name,
    name,
    defaultValue: state.values[name],
    "aria-invalid": errors ? true : undefined,
    "aria-describedby": errors ? errorId : undefined,
  };

  return (
    <Field data-invalid={errors ? true : undefined}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      {multiline ? (
        <Textarea {...controlProps} placeholder={inputProps.placeholder} />
      ) : (
        <Input {...controlProps} {...inputProps} />
      )}
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <FieldError id={errorId} errors={errors?.map((message) => ({ message }))} />
    </Field>
  );
}

const twoColumns = "grid gap-5 md:grid-cols-2";

type ApplicationFormProps = {
  initialValues: ApplicationFormValues;
  save: (formData: FormData) => Promise<SaveResult>;
  savedMessage: string;
  submitLabel: string;
};

export function ApplicationForm({ initialValues, save, savedMessage, submitLabel }: ApplicationFormProps) {
  const router = useRouter();
  // The stage is kept in state because React clears a form after it is sent,
  // and a Select does not go back to its first value by itself.
  const [stage, setStage] = useState(initialValues.stage);

  const [state, formAction] = useActionState<FormState, FormData>(
    async (previous, formData) => {
      const result = await save(formData);
      if (result.ok) {
        toast.success(savedMessage);
        router.push("/applications");
        return previous;
      }
      return result;
    },
    { values: initialValues, fieldErrors: {}, message: null },
  );

  const stageErrors = state.fieldErrors.stage;

  return (
    <form action={formAction} noValidate className="flex max-w-3xl flex-col gap-8">
      {state.message ? (
        <Alert>
          <CircleAlertIcon />
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}

      <FieldSet>
        <FieldLegend>The job</FieldLegend>
        <FieldGroup>
          <div className={twoColumns}>
            <TextField name="company" label="Company" state={state} required />
            <TextField name="role" label="Role" state={state} required />
          </div>
          <div className={twoColumns}>
            <TextField name="source" label="Source" state={state} placeholder="Job board, referral, ..." />
            <TextField name="job_url" label="Job link" state={state} type="url" placeholder="https://" />
          </div>
          <div className={twoColumns}>
            <TextField name="remote" label="Remote" state={state} placeholder="Yes, US hours" />
            <TextField name="pay_text" label="Pay in the post" state={state} />
          </div>
          <div className={twoColumns}>
            <TextField
              name="pay_min_php"
              label="Min pay per month (PHP)"
              state={state}
              type="number"
              inputMode="numeric"
              min={0}
            />
            <TextField
              name="pay_max_php"
              label="Max pay per month (PHP)"
              state={state}
              type="number"
              inputMode="numeric"
              min={0}
              description="Converted to pesos per month, so jobs can be compared."
            />
          </div>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>My application</FieldLegend>
        <FieldGroup>
          <div className={twoColumns}>
            <Field data-invalid={stageErrors ? true : undefined}>
              <FieldLabel htmlFor="stage">Stage</FieldLabel>
              <Select
                name="stage"
                items={stageItems}
                value={stage}
                onValueChange={(value) => value && setStage(value)}
              >
                <SelectTrigger id="stage" className="w-full" aria-invalid={stageErrors ? true : undefined}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {stageItems.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldError errors={stageErrors?.map((message) => ({ message }))} />
            </Field>
            <TextField name="applied_on" label="Date applied" state={state} type="date" />
          </div>
          <div className={twoColumns}>
            <TextField name="my_ask" label="Pay I asked for" state={state} />
            <TextField name="resume_used" label="Resume used" state={state} />
          </div>
          <TextField name="contact_name" label="Contact name" state={state} />
          <TextField name="message_sent" label="Message I sent" state={state} multiline />
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Next step</FieldLegend>
        <FieldGroup>
          <div className={twoColumns}>
            <TextField name="next_step" label="Next step" state={state} placeholder="Follow up" />
            <TextField name="next_step_on" label="Next step date" state={state} type="date" />
          </div>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Notes</FieldLegend>
        <FieldGroup>
          <TextField
            name="job_post"
            label="Job post"
            state={state}
            multiline
            description="Paste the post here. Job posts are often taken down."
          />
          <TextField name="notes" label="Notes" state={state} multiline />
        </FieldGroup>
      </FieldSet>

      <div className="flex items-center gap-2">
        <SubmitButton pendingLabel="Saving…">{submitLabel}</SubmitButton>
        <Button variant="ghost" nativeButton={false} render={<Link href="/applications" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
