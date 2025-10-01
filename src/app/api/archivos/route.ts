import { NextRequest, NextResponse } from 'next/server';
import { FileService } from './FileService';

// GET /api/archivos - Obtener todos los archivos
export async function GET(request: NextRequest) {
  try {
    const files = await FileService.getFiles();
    return NextResponse.json(files);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener archivos' }, { status: 500 });
  }
}

// POST /api/archivos - Crear un nuevo archivo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name_file || !body.name_folder_file || !body.extension_file || !body.type_file || !body.size_file || !body.url_file) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: nombre, nombre_carpeta, extension, tipo, tamaño, url' },
        { status: 400 }
      );
    }

    const id_mailchimp = body.name_folder_file === 'Mailchimp' ? body.id_mailchimp : null;

    const payload = {
      name_file: body.name_file,
      name_folder_file: body.name_folder_file,
      extension_file: body.extension_file,
      type_file: body.type_file,
      size_file: body.size_file,
      url_file: body.url_file,
      id_mailchimp: id_mailchimp,
    };

    const newFiletId = await FileService.createFile(
      payload.name_file,
      payload.name_folder_file,
      payload.extension_file,
      payload.type_file,
      payload.size_file,
      payload.url_file,
      payload.id_mailchimp,
    );

    const newFile = await FileService.getFileById(newFiletId.id_file);
    return NextResponse.json(newFile, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: 'Error al crear archivo' }, { status: 500 });
  }
}


// PATCH /api/archivos - Actualizar un nombre
export async function PATCH(req: NextRequest) {
  const { id_file, name_file } = await req.json();

  if (!id_file || !name_file) return NextResponse.json({ error: 'Faltan campos requeridos: id_file, name_file' }, { status: 400 });

  const updated = await FileService.updateFileName(Number(id_file), name_file);

  if (!updated) return NextResponse.json({ error: 'Error al actualizar nombre' }, { status: 404 });

  return NextResponse.json(updated);
}

// DELETE /api/archivos - Eliminar un archivo
export async function DELETE(req: NextRequest) {
  try {
    const { id_file } = await req.json();

    if (!id_file) return NextResponse.json({ error: 'No se proporcionó id' }, { status: 400 })

    const result = await FileService.deleteFile(Number(id_file));

    if (!result) {
      return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Archivo eliminado correctamente' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar archivo' }, { status: 500 });
  }
}