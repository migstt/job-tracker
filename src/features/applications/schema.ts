import { z } from "zod";

import { stages } from "@/lib/stages";

// Form fields arrive as text. An empty field is saved as null.
const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : value));

const optionalDate = optionalText.pipe(z.iso.date("Use a real date.").nullable());

const optionalUrl = optionalText.pipe(
  z.url({ protocol: /^https?$/, error: "Use a link that starts with http or https." }).nullable(),
);

const optionalPay = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : Number(value)))
  .pipe(
    z
      .number("Use a whole number.")
      .int("Use a whole number.")
      .min(0, "Pay cannot be below 0.")
      // The column is a Postgres integer.
      .max(2_000_000_000, "That number is too big.")
      .nullable(),
  );

export const applicationSchema = z
  .object({
    company: z.string().trim().min(1, "Company is required."),
    role: z.string().trim().min(1, "Role is required."),
    source: optionalText,
    job_url: optionalUrl,
    remote: optionalText,
    pay_text: optionalText,
    pay_min_php: optionalPay,
    pay_max_php: optionalPay,
    stage: z.enum(stages, "Pick a stage."),
    applied_on: optionalDate,
    my_ask: optionalText,
    resume_used: optionalText,
    contact_name: optionalText,
    message_sent: optionalText,
    next_step: optionalText,
    next_step_on: optionalDate,
    job_post: optionalText,
    notes: optionalText,
  })
  .refine(({ stage, applied_on }) => stage === "draft" || applied_on !== null, {
    path: ["applied_on"],
    error: "Add the date you applied, or set the stage to Draft.",
  })
  .refine(
    ({ pay_min_php, pay_max_php }) =>
      pay_min_php === null || pay_max_php === null || pay_min_php <= pay_max_php,
    { path: ["pay_max_php"], error: "Max pay cannot be below min pay." },
  );

// What gets saved: the checked and cleaned form.
export type ApplicationInput = z.output<typeof applicationSchema>;

export type ApplicationField = keyof ApplicationInput;

// What the form holds: every field as text.
export type ApplicationFormValues = Record<ApplicationField, string>;

export type ApplicationFieldErrors = Partial<Record<ApplicationField, string[]>>;

export const emptyApplicationValues: ApplicationFormValues = {
  company: "",
  role: "",
  source: "",
  job_url: "",
  remote: "",
  pay_text: "",
  pay_min_php: "",
  pay_max_php: "",
  stage: "draft",
  applied_on: "",
  my_ask: "",
  resume_used: "",
  contact_name: "",
  message_sent: "",
  next_step: "",
  next_step_on: "",
  job_post: "",
  notes: "",
};

const fields = Object.keys(emptyApplicationValues) as ApplicationField[];

// Reads only the known fields from a saved row or a submitted form, as text.
export function toFormValues(
  read: (field: ApplicationField) => string | number | null | undefined,
): ApplicationFormValues {
  const values = { ...emptyApplicationValues };
  for (const field of fields) {
    const value = read(field);
    if (value !== null && value !== undefined) values[field] = String(value);
  }
  return values;
}
