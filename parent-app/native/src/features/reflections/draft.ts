export const MAX_REFLECTION_LENGTH = 1500;
export function reflectionCount(text: string) {
  return Math.min(text.length, MAX_REFLECTION_LENGTH) + ' / ' + MAX_REFLECTION_LENGTH;
}
// No storage, analytics, cloud sync or teen-account context belongs in this feature.
