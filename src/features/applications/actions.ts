"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getCurrentUser } from "@/features/auth/queries";

import { deleteApplicationRow, insertApplication, updateApplicationRow } from "./queries";
import {
  type ApplicationFieldErrors,
  type ApplicationFormValues,
  type ApplicationInput,
  applicationSchema,
  toFormValues,
} from "./schema";

// On failure the typed values go back to the form, so nothing has to be typed again.
export type SaveResult =
  | { ok: true }
  | { ok: false; values: ApplicationFormValues; fieldErrors: ApplicationFieldErrors; message: string };

// Arguments of a Server Action come from the browser, so an id is checked like any input.
function isApplicationId(id: unknown): id is number {
  return Number.isSafeInteger(id) && (id as number) > 0;
}

async function saveApplication(
  formData: FormData,
  save: (input: ApplicationInput) => Promise<boolean>,
): Promise<SaveResult> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const values = toFormValues((field) => {
    const value = formData.get(field);
    return typeof value === "string" ? value : null;
  });

  const parsed = applicationSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      values,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      message: "Please fix the fields marked below.",
    };
  }

  const saved = await save(parsed.data);
  if (!saved) {
    return { ok: false, values, fieldErrors: {}, message: "Could not save. Please try again." };
  }

  // "layout" also covers the pages below /applications, like the detail page.
  revalidatePath("/applications", "layout");
  return { ok: true };
}

export async function createApplication(formData: FormData): Promise<SaveResult> {
  return saveApplication(formData, insertApplication);
}

export async function updateApplication(id: number, formData: FormData): Promise<SaveResult> {
  return saveApplication(formData, async (input) =>
    isApplicationId(id) ? updateApplicationRow(id, input) : false,
  );
}

export async function deleteApplication(id: number): Promise<{ ok: boolean }> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const deleted = isApplicationId(id) && (await deleteApplicationRow(id));
  if (deleted) revalidatePath("/applications", "layout");
  return { ok: deleted };
}
