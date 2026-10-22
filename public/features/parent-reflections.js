// Parent-only reflection drafting. This feature is intentionally memory-only.
// No persistence, autosave, synchronization, messaging, or network access.
export const REFLECTION_LIMIT = 1500;
export const reflectionCharacterCount = value => value.length + ' / ' + REFLECTION_LIMIT;

export function mountParentReflections(root = document) {
  const reflection = root.getElementById('reflection-input');
  const counter = root.getElementById('reflection-count');
  const clear = root.getElementById('clear-reflection');
  if (!reflection || !counter || !clear) {
    throw new Error('Parent Reflections screen bindings are missing');
  }
  const updateCount = () => { counter.textContent = reflectionCharacterCount(reflection.value); };
  const clearDraft = () => {
    reflection.value = '';
    updateCount();
    reflection.focus();
  };
  reflection.addEventListener('input', updateCount);
  clear.addEventListener('click', clearDraft);
  return () => {
    reflection.removeEventListener('input', updateCount);
    clear.removeEventListener('click', clearDraft);
    reflection.value = '';
  };
}
