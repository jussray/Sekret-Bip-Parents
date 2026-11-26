import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('parent registration reads the canonical Supabase gate and fails closed', () => {
  const gate = read('parent-app/native/src/features/auth/parentRegistrationGate.ts');
  assert.match(gate, /from\('parent_form_feature_gates'\)/);
  assert.match(gate, /eq\('name', 'parent_registration'\)/);
  assert.match(gate, /data\?\.enabled === true/);
  assert.match(gate, /catch\s*\{/);
  assert.doesNotMatch(gate, /service_role|SUPABASE_SECRET_KEY|ADMIN_KEY/);
});

test('signup refuses a missing or disabled flag without blocking sign-in', () => {
  const entry = read('parent-app/native/src/features/auth/ParentEntry.tsx');
  assert.match(entry, /import \{ isParentRegistrationOpen \} from '\.\/parentRegistrationGate'/);
  assert.match(entry, /if \(screen === 'signup'\) \{[\s\S]*await isParentRegistrationOpen\(client\)/);
  const preflight = entry.indexOf('await isParentRegistrationOpen(client)');
  const signUp = entry.indexOf('client.auth.signUp(');
  assert.ok(preflight >= 0 && signUp > preflight, 'registration preflight must run before signup');
  assert.match(entry, /client\.auth\.signInWithPassword/);
});
