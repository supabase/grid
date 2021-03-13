export function deepClone(obj: unknown) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (e) {
    throw e;
  }
}
