/**
 * Sekret-Bip-Parents Muse provider — SERVER-ONLY, UNWIRED. DRAFT.
 *
 * Mirrors Sekret-Bip's worker/provider-runtime.ts guards, Muse lane only:
 * - source allowlist {founder, repository, system}; any other source
 *   (notably 'user' or 'parent') is rejected as user_content_not_authorized
 *   before any network call; userContentForwarding stays false;
 * - sensitivity must be 'standard'; anything else (including 'crisis') is
 *   rejected as sensitive_context_not_authorized before any network call;
 * - prompt capped at 12,000 chars.
 *
 * FCR hardening applied over the Bip original: model must be explicitly set
 * via PARENTS_MUSE_MODEL and match /^muse-spark-1\.(?:1|2|3)$/ — there is
 * NO default model (FCR refuses to default); response capped at 64 KiB;
 * provider status must be 'completed'; error bodies never promoted.
 *
 * Canonical semantics: secret name MODEL_API_KEY (Worker env only);
 * endpoint https://api.meta.ai/v1/responses; POST {model, input,
 * store:false, max_output_tokens:2000}; 60s timeout; success returns
 * evidenceRef 'provider:meta:<id>' and authority 'none'; missing key or
 * safe model => not configured (never a fabricated answer).
 * State ceiling: INTEGRATED.
 *
 * PLACEMENT BOUNDARY: Sekret-Bip-Parents currently has NO backend. This
 * module must NOT be imported by any client/app code — a client bundle
 * cannot hold a server-only key. It stays unwired in-repo until a server
 * layer (Worker) exists to own it. See PLACEMENT.md.
 */

const MAX_RESPONSE_BYTES = 64 * 1024;
const TIMEOUT_MS = 60_000;
const MAX_PROMPT_CHARS = 12_000;
const MAX_RESPONSE_ID_LENGTH = 200;
const SAFE_MUSE_MODEL = /^muse-spark-1\.(?:1|2|3)$/;
const ALLOWED_SOURCES = ['founder', 'repository', 'system'] as const;

export interface ParentsMuseEnv {
  MODEL_API_KEY?: string;
  PARENTS_MUSE_MODEL?: string;
}

export interface ParentsMuseState {
  provider: 'muse';
  state: 'INTEGRATED' | 'ABSENT';
  model: string | null;
  authority: 'none';
  userContentForwarding: false;
}

function safeModel(env: ParentsMuseEnv): string | null {
  const normalized = String(env.PARENTS_MUSE_MODEL || '').trim();
  return SAFE_MUSE_MODEL.test(normalized) ? normalized : null;
}

export function parentsMuseState(env: ParentsMuseEnv): ParentsMuseState {
  const keyValue = String(env.MODEL_API_KEY || '').trim();
  const model = safeModel(env);
  return {
    provider: 'muse',
    state: keyValue && model ? 'INTEGRATED' : 'ABSENT',
    model,
    authority: 'none',
    userContentForwarding: false,
  };
}

function validId(value: unknown): string | null {
  const id = typeof value === 'string' ? value.trim() : '';
  return id && id.length <= MAX_RESPONSE_ID_LENGTH && /^[A-Za-z0-9._:-]+$/.test(id) ? id : null;
}

function extractText(body: Record<string, unknown>): string {
  if (typeof body.output_text === 'string' && body.output_text.trim()) return body.output_text.trim();
  const parts: string[] = [];
  for (const item of Array.isArray(body.output) ? body.output : []) {
    const record = item && typeof item === 'object' ? (item as Record<string, unknown>) : null;
    if (!record || record.type !== 'message') continue;
    for (const entry of Array.isArray(record.content) ? record.content : []) {
      const block = entry && typeof entry === 'object' ? (entry as Record<string, unknown>) : null;
      if (block?.type === 'output_text' && typeof block.text === 'string' && block.text.trim()) {
        parts.push(block.text.trim());
      }
    }
  }
  return parts.join('\n');
}

export async function invokeParentsMuse(
  env: ParentsMuseEnv,
  input: { prompt?: unknown; sensitivity?: unknown; source?: unknown },
  fetchImpl: typeof fetch = fetch,
) {
  const prompt = String(input.prompt || '').trim();
  if (!prompt || prompt.length > MAX_PROMPT_CHARS) throw new Error('invalid_prompt');
  if (String(input.sensitivity || 'standard').trim().toLowerCase() !== 'standard') {
    throw new Error('sensitive_context_not_authorized');
  }
  const source = String(input.source || 'founder').trim().toLowerCase();
  if (!(ALLOWED_SOURCES as readonly string[]).includes(source)) {
    throw new Error('user_content_not_authorized');
  }

  const keyValue = String(env.MODEL_API_KEY || '').trim();
  const model = safeModel(env);
  if (!keyValue || !model) throw new Error('muse_not_configured');

  let response: Response;
  try {
    response = await fetchImpl('https://api.meta.ai/v1/responses', {
      method: 'POST',
      headers: { authorization: `Bearer ${keyValue}`, 'content-type': 'application/json' },
      body: JSON.stringify({ model, input: prompt, store: false, max_output_tokens: 2_000 }),
      redirect: 'error',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    throw new Error('muse_request_failed');
  }
  if (!response.ok) {
    try { await response.body?.cancel(); } catch { /* provider error bodies are never promoted */ }
    throw new Error(`muse_http_${response.status}`);
  }
  const raw = await response.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_RESPONSE_BYTES) {
    throw new Error('muse_response_too_large');
  }
  let parsed: Record<string, unknown>;
  try { parsed = JSON.parse(raw) as Record<string, unknown>; } catch { throw new Error('muse_invalid_json'); }
  if (parsed.status !== 'completed') throw new Error('muse_non_completed');
  const responseId = validId(parsed.id);
  if (!responseId) throw new Error('muse_invalid_response_id');
  const text = extractText(parsed);
  if (!text) throw new Error('muse_empty_response');
  return {
    state: 'INTEGRATED' as const,
    provider: 'muse' as const,
    model,
    responseId,
    evidenceRef: `provider:meta:${responseId}`,
    authority: 'none' as const,
    source,
    userContentForwarding: false as const,
    text,
  };
}
