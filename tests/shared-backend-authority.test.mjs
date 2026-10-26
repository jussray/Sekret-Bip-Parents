import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = relative => fs.readFileSync(path.join(repoRoot, relative), 'utf8');
const exists = relative => fs.existsSync(path.join(repoRoot, relative));

test('Main Bip remains the only active shared Supabase migration authority', () => {
  assert.equal(exists('supabase/migrations'), false, 'parent repo must not grow root supabase/migrations');
  assert.equal(exists('parent-app/native/supabase/migrations'), false, 'native parent app must not own migrations');

  const authority = read('docs/SHARED_BACKEND_AUTHORITY.md');
  assert.match(authority, /jussray\/Sekret-Bip/);
  assert.match(authority, /Do not create an active `supabase\/migrations\/` lane/);
});

test('exported Parent Circle SQL remains provenance-only and non-applicable here', () => {
  const manifest = JSON.parse(read('parent-app/exports/parent-circle-v2-20261025/EXPORT_MANIFEST.json'));
  assert.equal(manifest.boundaries.production_migration_apply_authorized, false);
  assert.equal(manifest.boundaries.production_deploy_authorized, false);

  const exportedSql = manifest.files
    .filter(file => file.source_path.startsWith('supabase/migrations/'))
    .map(file => file.export_path)
    .sort();

  assert.deepEqual(exportedSql, [
    'parent-app/exports/parent-circle-v2-20261025/source/supabase/migrations/20261025025400_parent_community_reaction_kind_values.sql',
    'parent-app/exports/parent-circle-v2-20261025/source/supabase/migrations/20261025025500_parent_community_v2_rpc_cutover.sql',
  ]);
});

test('parent runtime consumes the shared RPC contract without raw Circle-table fallback', () => {
  const repository = read('parent-app/native/src/features/circle/repository.ts');
  for (const rpc of [
    'get_parent_community_feed',
    'create_parent_community_post',
    'react_to_parent_community_post',
    'reply_to_parent_community_post',
    'report_parent_community_post',
  ]) assert.match(repository, new RegExp("rpc\\('" + rpc + "'"));

  assert.doesNotMatch(repository, /\.from\(['"](?:circles|posts|post_comments|post_reactions)['"]\)/);
  assert.match(repository, /ParentCommunityUnavailableError/);
});

test('parent documentation explicitly separates product ownership from backend ownership', () => {
  const root = read('README.md');
  const native = read('parent-app/native/README.md');
  const exported = read('parent-app/exports/parent-circle-v2-20261025/README.md');

  assert.match(root, /canonical shared backend/i);
  assert.match(native, /canonical Main Bip backend/i);
  assert.match(exported, /source\/provenance evidence only/i);
});
