// ============================================================
// SUPABASE STORAGE SERVICE (Storage ONLY — no Supabase DB/Auth)
// ============================================================
// Used for place/experience/mitra images. Uploads happen through
// the server route (/api/storage/upload) using the service-role
// key; public reads use the public bucket URL directly.
// When Supabase env vars are absent, the service reports
// unconfigured and the UI falls back to bundled dataset images.
// ============================================================

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let adminClient: SupabaseClient | null = null;

function getAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url.includes('placeholder')) return null;
  if (!adminClient) {
    adminClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}

export const STORAGE_BUCKETS = ['places', 'experiences', 'mitras'] as const;
export type StorageBucket = (typeof STORAGE_BUCKETS)[number];

export function isStorageConfigured(): boolean {
  return getAdminClient() !== null;
}

export async function uploadImage(
  bucket: StorageBucket,
  path: string,
  file: File | Buffer,
  contentType: string
): Promise<{ ok: boolean; publicUrl?: string; error?: string }> {
  const client = getAdminClient();
  if (!client) {
    return { ok: false, error: 'Supabase Storage not configured' };
  }
  try {
    const { error } = await client.storage.from(bucket).upload(path, file as Blob, {
      contentType,
      upsert: true,
    });
    if (error) return { ok: false, error: error.message };
    const { data } = client.storage.from(bucket).getPublicUrl(path);
    return { ok: true, publicUrl: data.publicUrl };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'upload failed' };
  }
}

export async function ensureBucketsExist(): Promise<{ ok: boolean; created: string[]; error?: string }> {
  const client = getAdminClient();
  if (!client) return { ok: false, created: [], error: 'Supabase Storage not configured' };
  const created: string[] = [];
  try {
    const { data: buckets } = await client.storage.listBuckets();
    const existing = new Set((buckets ?? []).map((b) => b.name));
    for (const bucket of STORAGE_BUCKETS) {
      if (!existing.has(bucket)) {
        const { error } = await client.storage.createBucket(bucket, { public: true });
        if (!error) created.push(bucket);
      }
    }
    return { ok: true, created };
  } catch (e) {
    return { ok: false, created, error: e instanceof Error ? e.message : 'bucket setup failed' };
  }
}
