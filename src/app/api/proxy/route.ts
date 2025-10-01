import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const imageUrl = url.searchParams.get('url');
  if (!imageUrl) {
    return NextResponse.json({ error: 'No URL' }, { status: 400 });
  }

  const res = await fetch(imageUrl);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  let output: Buffer = buffer;
  let contentType = res.headers.get('Content-Type') || 'image/png';

  if (contentType.includes('image/webp')) {
    output = await sharp(buffer).png().toBuffer();
    contentType = 'image/png';
  }

  return new NextResponse(output, {
    headers: {
      'Content-Type': contentType,
    },
  });
}
