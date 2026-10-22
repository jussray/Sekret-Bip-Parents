import test from 'node:test';
import assert from 'node:assert/strict';
import { CONVERSATION_PROMPTS, createConversationKitsState, mountConversationKits } from '../public/features/conversation-kits.js';
import { REFLECTION_LIMIT, reflectionCharacterCount, mountParentReflections } from '../public/features/parent-reflections.js';

class Element {
  constructor(dataset = {}) {
    this.dataset = dataset;
    this.listeners = new Map();
    this.attrs = {};
    this.value = '';
    this.textContent = '';
    this.active = false;
    this.focused = false;
    this.classList = { toggle: (name, value) => { if (name === 'active') this.active = value; } };
  }
  addEventListener(name, handler) {
    const list = this.listeners.get(name) || [];
    list.push(handler);
    this.listeners.set(name, list);
  }
  removeEventListener(name, handler) {
    this.listeners.set(name, (this.listeners.get(name) || []).filter(fn => fn !== handler));
  }
  setAttribute(name, value) { this.attrs[name] = value; }
  focus() { this.focused = true; }
  async emit(name) { for (const listener of this.listeners.get(name) || []) await listener(); }
}

test('conversation state preserves every category and cycles without persistence', () => {
  const state = createConversationKitsState();
  assert.deepEqual(Object.keys(CONVERSATION_PROMPTS), ['check-in', 'hard-day', 'boundaries', 'repair']);
  assert.equal(state.prompt, CONVERSATION_PROMPTS['check-in'][0]);
  assert.equal(state.selectTopic('non-existent'), false);
  assert.equal(state.prompt, CONVERSATION_PROMPTS['check-in'][0]);
  for (const [topic, prompts] of Object.entries(CONVERSATION_PROMPTS)) {
    assert.equal(state.selectTopic(topic), true);
    assert.equal(state.prompt, prompts[0]);
    for (let i = 1; i < prompts.length; i++) assert.equal(state.nextPrompt(), prompts[i]);
    assert.equal(state.nextPrompt(), prompts[0]);
    assert.equal(state.copyText(), prompts[0].replace(/[“”]/g, ''));
  }
  assert.ok(Object.isFrozen(CONVERSATION_PROMPTS));
  assert.ok(Object.values(CONVERSATION_PROMPTS).every(Object.isFrozen));
});

test('conversation controls update visible screen and clipboard only on user action', async () => {
  const nodes = Object.fromEntries(['prompt-text', 'copy-status', 'next-prompt', 'copy-prompt'].map(n => [n, new Element()]));
  const buttons = Object.keys(CONVERSATION_PROMPTS).map(topic => new Element({topic}));
  const root = { getElementById: id => nodes[id], querySelectorAll: sel => sel === '[data-topic]' ? buttons : [] };
  let copied = '';
  const dispose = mountConversationKits(root, {writeText: async value => { copied = value; }});
  assert.equal(copied, '');
  await buttons[3].emit('click');
  assert.equal(nodes['prompt-text'].textContent, CONVERSATION_PROMPTS.repair[0]);
  assert.equal(buttons[3].attrs['aria-pressed'], 'true');
  assert.equal(buttons[0].attrs['aria-pressed'], 'false');
  await nodes['next-prompt'].emit('click');
  assert.equal(nodes['prompt-text'].textContent, CONVERSATION_PROMPTS.repair[1]);
  assert.equal(copied, '');
  await nodes['copy-prompt'].emit('click');
  assert.equal(copied, CONVERSATION_PROMPTS.repair[1].replace(/[“”]/g, ''));
  assert.match(nodes['copy-status'].textContent, /copied/);
  dispose();
  await nodes['next-prompt'].emit('click');
  assert.equal(nodes['prompt-text'].textContent, CONVERSATION_PROMPTS.repair[1]);
});

test('reflection is ephemeral, updates counter, clears and focuses on command', async () => {
  const nodes = Object.fromEntries(['reflection-input', 'reflection-count', 'clear-reflection'].map(n => [n, new Element()]));
  const root = { getElementById: id => nodes[id] };
  const dispose = mountParentReflections(root);
  const input = nodes['reflection-input'];
  input.value = 'Listening first.';
  await input.emit('input');
  assert.equal(nodes['reflection-count'].textContent, '16 / 1500');
  assert.equal(REFLECTION_LIMIT, 1500);
  assert.equal(reflectionCharacterCount('abc'), '3 / 1500');
  await nodes['clear-reflection'].emit('click');
  assert.equal(input.value, '');
  assert.equal(nodes['reflection-count'].textContent, '0 / 1500');
  assert.equal(input.focused, true);
  input.value = 'unsent';
  dispose();
  assert.equal(input.value, '');
});

test('missing controls fail closed instead of silently granting access', () => {
  assert.throws(() => mountConversationKits({ querySelectorAll: () => [], getElementById: () => null }, null), /bindings are missing/);
  assert.throws(() => mountParentReflections({getElementById:()=>null}), /bindings are missing/);
});
