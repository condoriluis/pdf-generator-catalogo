import { NextRequest, NextResponse } from 'next/server';
import { getTagById, updateTag, deleteTag } from '@/lib/utils/dataJson';

// GET /api/tags/[id] - Obtener un tag por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tag = await getTagById(params.id);
    
    if (!tag) {
      return NextResponse.json({ error: 'Tag no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(tag);
  } catch (error) {
    console.error(`Error al obtener tag ${params.id}:`, error);
    return NextResponse.json({ error: 'Error al obtener tag' }, { status: 500 });
  }
}

// PUT /api/tags/[id] - Actualizar un tag
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedTag = await updateTag(params.id, body);
    
    if (!updatedTag) {
      return NextResponse.json({ error: 'Tag no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(updatedTag);
  } catch (error) {
    console.error(`Error al actualizar tag ${params.id}:`, error);
    return NextResponse.json({ error: 'Error al actualizar tag' }, { status: 500 });
  }
}

// DELETE /api/tags/[id] - Eliminar un tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteTag(params.id);
    
    if (!success) {
      return NextResponse.json({ error: 'Tag no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Tag eliminado correctamente' });
  } catch (error) {
    console.error(`Error al eliminar tag ${params.id}:`, error);
    return NextResponse.json({ error: 'Error al eliminar tag' }, { status: 500 });
  }
}