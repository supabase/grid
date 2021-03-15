export function getStorageKey(
  prefix: string,
  ref: string,
  tableId: string | number
) {
  return `${prefix}_${ref}_${tableId}`;
}

export function deepClone(obj: unknown) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (e) {
    throw e;
  }
}
