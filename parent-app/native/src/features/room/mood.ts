export const parentMoods = [
  { key: 'heavy', icon: '☁️', label: 'Heavy', reply: 'You can set some of that weight down for a moment.' },
  { key: 'hopeful', icon: '✨', label: 'Hopeful', reply: 'Small steps count. Keep that spark.' },
  { key: 'worried', icon: '🌧️', label: 'Worried', reply: 'One kind conversation can be your next step.' },
  { key: 'okay', icon: '🌿', label: 'Okay', reply: 'Okay is enough for today.' },
] as const;
export type ParentMood = typeof parentMoods[number]['key'];
export function getParentMoodReply(key: string): string | null {
  return parentMoods.find(mood => mood.key === key)?.reply ?? null;
}
