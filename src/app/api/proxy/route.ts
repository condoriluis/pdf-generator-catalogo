import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const imageUrl = url.searchParams.get('url');
  if (!imageUrl) return NextResponse.json({ error: 'No URL' }, { status: 400 });

  const res = await fetch(imageUrl);
  const buffer = await res.arrayBuffer();

  return new NextResponse(Buffer.from(buffer), {
    headers: { 'Content-Type': res.headers.get('Content-Type') || 'image/png' },
  });
}
