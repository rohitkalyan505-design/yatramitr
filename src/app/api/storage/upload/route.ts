import { NextResponse } from 'next/server';
import { uploadImage, ensureBucketsExist, isStorageConfigured, STORAGE_BUCKETS } from '@/lib/storage-service';

export const dynamic = 'force-dynamic';

// POST /api/storage/upload — multipart form: bucket, path, file
export async function POST(req: Request) {
  try {
    if (!isStorageConfigured()) {
      return NextResponse.json(
        { error: 'Supabase Storage not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.' },
        { status: 503 }
      );
    }

    const form = await req.formData();
    const bucket = String(form.get('bucket') ?? '');
    const path = String(form.get('path') ?? '');
    const file = form.get('file');

    if (!STORAGE_BUCKETS.includes(bucket as (typeof STORAGE_BUCKETS)[number])) {
      return NextResponse.json({ error: `bucket must be one of: ${STORAGE_BUCKETS.join(', ')}` }, { status: 400 });
    }
    if (!path || !(file instanceof File)) {
      return NextResponse.json({ error: 'path and file are required' }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File exceeds 5MB limit' }, { status: 413 });
    }

    await ensureBucketsExist();
    const result = await uploadImage(
      bucket as (typeof STORAGE_BUCKETS)[number],
      path,
      Buffer.from(await file.arrayBuffer()),
      file.type || 'image/jpeg'
    );

    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
    return NextResponse.json({ publicUrl: result.publicUrl }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
