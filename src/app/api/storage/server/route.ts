import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { SITE_URL } from '@/lib/constants';

export const config = {
  api: {
    bodyParser: false,
  },
};

function sanitizeFileName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9.\-_]/g, '');
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Solo se permiten archivos de imagen' },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), 'public', 'assets', 'images');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const safeFileName = sanitizeFileName(file.name);
    const filePath = path.join(uploadDir, safeFileName);
    fs.writeFileSync(filePath, buffer);

    const url = `${SITE_URL}/assets/images/${safeFileName}`;
    return NextResponse.json({ url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }
}

// ================= DELETE =================
export async function DELETE(req: NextRequest) {
  try {
    const { fileUrl } = await req.json();

    if (!fileUrl) {
      return NextResponse.json({ error: 'No se proporcionó fileUrl' }, { status: 400 });
    }

    const fileName = path.basename(fileUrl);
    const filePath = path.join(process.cwd(), 'public', 'assets', 'images', fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Error eliminando archivo' }, { status: 500 });
  }
}
