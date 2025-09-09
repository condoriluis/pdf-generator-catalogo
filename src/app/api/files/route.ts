import { NextRequest, NextResponse } from 'next/server';
import { getFiles, createFile } from '@/lib/utils/dataJson';

// GET /api/files - Obtener todos los files
export async function GET(request: NextRequest) {
  try {
    const files = await getFiles();
    return NextResponse.json(files);
  } catch (error) {
    console.error('Error al obtener files:', error);
    return NextResponse.json({ error: 'Error al obtener files' }, { status: 500 });
  }
}

// POST /api/files - Crear un nuevo file
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar datos requeridos
    if (!body.name) {
      return NextResponse.json(
        { error: 'Falta el campo requerido: name' },
        { status: 400 }
      );
    }
    
    const newTag = await createFile({
      name_folder: body.name_folder,
      name: body.name,
      extension: body.extension,
      type: body.type,
      size: body.size,
      url: body.url,
      id_mailchimp: body.id_mailchimp,
    });
    
    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    console.error('Error al crear file:', error);
    return NextResponse.json({ error: 'Error al crear file' }, { status: 500 });
  }
}