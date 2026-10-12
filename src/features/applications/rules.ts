// Reads the [id] part of a URL. Returns null for anything that is not a whole number above 0,
// like "abc", "1.5", or "-2".
export function parseApplicationId(param: string): number | null {
  if (!/^\d{1,15}$/.test(param)) return null;
  const id = Number(param);
  return id > 0 ? id : null;
}
