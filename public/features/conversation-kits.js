// Parent conversation feature: pure prompt state + a screen-independent DOM adapter.
// Public guidance only. No profile reads, account data, storage, or network calls.
export const CONVERSATION_PROMPTS = Object.freeze({
  'check-in': Object.freeze([
    '“I’m glad to see you. Want company, help, or a little space?”',
    '“What was one okay thing about today—even if it was small?”',
    '“I can listen without trying to fix everything. Want to talk?”'
  ]),
  'hard-day': Object.freeze([
    '“That sounds like a lot. Would listening help right now?”',
    '“You don’t have to explain it all at once. I’m here.”',
    '“Would something simple help, like a snack or a quiet moment?”'
  ]),
  'boundaries': Object.freeze([
    '“We can disagree and still speak to each other with respect.”',
    '“Help me understand which part of this feels unfair to you.”',
    '“Here’s my concern. What solution feels workable to you?”'
  ]),
  'repair': Object.freeze([
    '“I wish I’d handled that differently. Can we try again?”',
    '“I care more about understanding you than winning an argument.”',
    '“Can I hear how that moment felt from your side?”'
  ])
});

export function createConversationKitsState() {
  let topic = 'check-in';
  let index = 0;
  return Object.freeze({
    get topic() { return topic; },
    get prompt() { return CONVERSATION_PROMPTS[topic][index]; },
    selectTopic(nextTopic) {
      if (!Object.hasOwn(CONVERSATION_PROMPTS, nextTopic)) return false;
      topic = nextTopic;
      index = 0;
      return true;
    },
    nextPrompt() {
      index = (index + 1) % CONVERSATION_PROMPTS[topic].length;
      return CONVERSATION_PROMPTS[topic][index];
    },
    copyText() { return CONVERSATION_PROMPTS[topic][index].replace(/[“”]/g, ''); }
  });
}

export function mountConversationKits(root = document, clipboard = navigator.clipboard) {
  const model = createConversationKitsState();
  const buttons = [...root.querySelectorAll('[data-topic]')];
  const text = root.getElementById('prompt-text');
  const status = root.getElementById('copy-status');
  const next = root.getElementById('next-prompt');
  const copy = root.getElementById('copy-prompt');
  if (!text || !status || !next || !copy || buttons.length === 0) {
    throw new Error('Conversation Kits screen bindings are missing');
  }
  const bindings = [];
  const on = (el, event, fn) => {
    el.addEventListener(event, fn);
    bindings.push(() => el.removeEventListener(event, fn));
  };
  const refresh = () => { text.textContent = model.prompt; status.textContent = ''; };
  for (const button of buttons) {
    on(button, 'click', () => {
      if (!model.selectTopic(button.dataset.topic)) return;
      for (const item of buttons) {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      }
      refresh();
    });
  }
  on(next, 'click', () => { model.nextPrompt(); refresh(); });
  on(copy, 'click', async () => {
    try {
      if (!clipboard?.writeText) throw new Error('Clipboard unavailable');
      await clipboard.writeText(model.copyText());
      status.textContent = 'Phrase copied by your choice.';
    } catch {
      status.textContent = 'Copy unavailable in this browser; you can select the phrase instead.';
    }
  });
  return () => bindings.forEach(unbind => unbind());
}
