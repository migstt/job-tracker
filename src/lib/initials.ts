// "Ana Cruz" gives "AC". With no name, the first letter of the email is used.
export function initials(name: string | null, email: string | null): string {
  const words = name?.trim().split(/\s+/).filter(Boolean) ?? [];

  if (words.length > 1) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }

  const single = words[0] ?? email?.trim() ?? "";
  return single ? single[0].toUpperCase() : "?";
}
