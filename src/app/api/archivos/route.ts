import { NextRequest, NextResponse } from 'next/server';
import { getFiles, createFile, updateFileName, deleteFile } from '@/lib/utils/dataJson';

// GET /api/archivos - Obtener todos los archivos
export async function GET(request: NextRequest) {
  try {
    const files = await getFiles();
    return NextResponse.json(files);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener archivos' }, { status: 500 });
  }
}

// POST /api/archivos - Crear un nuevo archivo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.name_folder || !body.extension || !body.type || !body.size || !body.url) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: name, name_folder, extension, type, size, url' },
        { status: 400 }
      );
    }

    const id_mailchimp = body.name_folder === 'Mailchimp' ? body.id_mailchimp : '';
    
    const newFile = await createFile({
      name: body.name,
      name_folder: body.name_folder,
      extension: body.extension,
      type: body.type,
      size: body.size,
      url: body.url,
      id_mailchimp: id_mailchimp,
    });
    
    return NextResponse.json(newFile, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear archivo' }, { status: 500 });
  }
}


// PATCH /api/archivos - Actualizar un nombre
export async function PATCH(req: NextRequest) {
  const { id, name } = await req.json();

  if (!id || !name) return NextResponse.json({ error: 'Faltan campos requeridos: id, name' }, { status: 400 });

  const updated = await updateFileName(id, name);

  if (!updated) return NextResponse.json({ error: 'Error al actualizar nombre' }, { status: 404 });

  return NextResponse.json(updated);
}

// DELETE /api/archivos - Eliminar un archivo
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) return NextResponse.json({ error: 'No se proporcionó id' }, { status: 400 })

    const result = await deleteFile(id);

    if (!result) {
      return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Archivo eliminado correctamente' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar archivo' }, { status: 500 });
  }
}