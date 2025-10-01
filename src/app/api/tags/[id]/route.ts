import { NextRequest, NextResponse } from 'next/server';
import { TagService } from '../TagService';

// GET /api/tags/[id] - Obtener un tag por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const tag = await TagService.getTagById(params.id);
    
    if (!tag) {
      return NextResponse.json({ error: 'Tag no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(tag);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener tag' }, { status: 500 });
  }
}

// PUT /api/tags/[id] - Actualizar un tag
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }
) {
  
  try {

    const { id } = await context.params;

    const body = await request.json();
    const updatedTag = await TagService.updateTag(Number(id), body.name_tag, body.color_tag);
    
    if (updatedTag) {
      const getUpdatedTag = await TagService.getTagById(Number(id));
      return NextResponse.json(getUpdatedTag, { status: 200 });
    }
    
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar tag' }, { status: 500 });
  }
}

// DELETE /api/tags/[id] - Eliminar un tag
export const DELETE = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: 'ID de tag es necesario' }, { status: 400 });
    }
    
    await TagService.deleteTag(parseInt(id));
    return NextResponse.json({ message: 'Tag eliminado correctamente' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar tag' }, { status: 500 });
  }
}