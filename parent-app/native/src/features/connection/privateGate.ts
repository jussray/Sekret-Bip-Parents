export type PrivateParentFeature = 'bridge' | 'circle' | 'approvals' | 'teen-link';
export type PrivateFeatureState = { kind: 'locked'; reason: string };
// No external auth-provider contract is configured for this standalone runtime.
// Fail closed even when called with user-controlled query strings or fake role flags.
export function resolvePrivateParentFeature(
  _feature: PrivateParentFeature,
  _untrustedInput?: unknown,
): PrivateFeatureState {
  return {
    kind: 'locked',
    reason: 'Verified guardian identity, a current teen-parent link, and item-specific, server-enforced consent are required.',
  };
}
