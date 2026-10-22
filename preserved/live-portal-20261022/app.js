// No analytics, cookies, storage, network calls, or child data in this public app.
const prompts = Object.freeze({
  'check-in': [
    '“I’m glad to see you. Want company, help, or a little space?”',
    '“What was one okay thing about today—even if it was small?”',
    '“I can listen without trying to fix everything. Want to talk?”'
  ],
  'hard-day': [
    '“That sounds like a lot. Would listening help right now?”',
    '“You don’t have to explain it all at once. I’m here.”',
    '“Would something simple help, like a snack or a quiet moment?”'
  ],
  'boundaries': [
    '“We can disagree and still speak to each other with respect.”',
    '“Help me understand which part of this feels unfair to you.”',
    '“Here’s my concern. What solution feels workable to you?”'
  ],
  'repair': [
    '“I wish I’d handled that differently. Can we try again?”',
    '“I care more about understanding you than winning an argument.”',
    '“Can I hear how that moment felt from your side?”'
  ]
});
let topic = 'check-in';
let promptIndex = 0;
const text = document.getElementById('prompt-text');
const status = document.getElementById('copy-status');
function updatePrompt() {
  text.textContent = prompts[topic][promptIndex];
  status.textContent = '';
}
document.querySelectorAll('[data-topic]').forEach(button => button.addEventListener('click', () => {
  topic = button.dataset.topic;
  promptIndex = 0;
  document.querySelectorAll('[data-topic]').forEach(b => {
    const active = b === button;
    b.classList.toggle('active', active);
    b.setAttribute('aria-pressed', String(active));
  });
  updatePrompt();
}));
document.getElementById('next-prompt').addEventListener('click', () => {
  promptIndex = (promptIndex + 1) % prompts[topic].length;
  updatePrompt();
});
document.getElementById('copy-prompt').addEventListener('click', async () => {
  try {
    if (!navigator.clipboard?.writeText) throw Error('Clipboard is not available');
    await navigator.clipboard.writeText(prompts[topic][promptIndex].replace(/[“”]/g, ''));
    status.textContent = 'Phrase copied by your choice.';
  } catch {
    status.textContent = 'Copy unavailable in this browser; you can select the phrase instead.';
  }
});
const reflection = document.getElementById('reflection-input');
const counter = document.getElementById('reflection-count');
reflection.addEventListener('input', () => {
  counter.textContent = reflection.value.length + ' / 1500';
});
document.getElementById('clear-reflection').addEventListener('click', () => {
  reflection.value = '';
  counter.textContent = '0 / 1500';
  reflection.focus();
});
