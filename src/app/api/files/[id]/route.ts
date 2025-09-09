import { NextRequest, NextResponse } from 'next/server';
import { getFileById, updateFileName, deleteFile } from '@/lib/utils/dataJson';

// GET /api/files/[id] - Obtener un file por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const file = await getFileById(params.id);
    
    if (!file) {
      return NextResponse.json({ error: 'File no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({ file });
  } catch (error) {
    console.error(`Error al obtener file ${params.id}:`, error);
    return NextResponse.json({ error: 'Error al obtener file' }, { status: 500 });
  }
}

// PUT /api/files/[id] - Actualizar un file
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedFile = await updateFileName(params.id, body);
    
    if (!updatedFile) {
      return NextResponse.json({ error: 'File no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(updatedFile);
  } catch (error) {
    console.error(`Error al actualizar file ${params.id}:`, error);
    return NextResponse.json({ error: 'Error al actualizar file' }, { status: 500 });
  }
}

// DELETE /api/files/[id] - Eliminar un file
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteFile(params.id);
    
    if (!success) {
      return NextResponse.json({ error: 'File no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'File eliminado correctamente' });
  } catch (error) {
    console.error(`Error al eliminar file ${params.id}:`, error);
    return NextResponse.json({ error: 'Error al eliminar file' }, { status: 500 });
  }
}