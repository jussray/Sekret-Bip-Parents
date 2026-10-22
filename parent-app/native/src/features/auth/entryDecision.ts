import type { GuardianDecision } from './guardianEvidence';

export type EntryScreen = 'welcome' | 'login' | 'signup' | 'checking' | 'review' | 'app';
export function resolveEntryScreen(
  outcome: GuardianDecision | null,
  requested: 'welcome' | 'login' | 'signup',
): EntryScreen {
  if (outcome === null) return 'checking';
  if (outcome.kind === 'guardian') return 'app';
  if (outcome.kind === 'review') return 'review';
  return requested;
}
