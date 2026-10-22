export const conversationKits = {
  'Check-in': [
    'I’m glad to see you. Want company, help, or a little space?',
    'I can listen without trying to fix everything. Want to talk?',
  ],
  'Hard day': [
    'That sounds like a lot. Would listening help right now?',
    'You don’t have to explain it all at once. I’m here.',
  ],
  'Boundaries': [
    'We can disagree and still speak to each other with respect.',
    'Help me understand which part feels unfair to you.',
  ],
  'Repair': [
    'I wish I’d handled that differently. Can we try again?',
    'I care more about understanding you than winning an argument.',
  ],
} as const;
export type ConversationTopic = keyof typeof conversationKits;
export function selectCoachPrompt(topic: ConversationTopic, index: number) {
  const options = conversationKits[topic];
  return options[((index % options.length) + options.length) % options.length];
}
