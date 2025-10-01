import { NextRequest, NextResponse } from 'next/server';
import { TagService } from './TagService';

// GET /api/tags - Obtener todos los tags
export async function GET(request: NextRequest) {
  try {
    const tags = await TagService.getTags();
    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error al obtener tags:', error);
    return NextResponse.json({ error: 'Error al obtener tags' }, { status: 500 });
  }
}

// POST /api/tags - Crear un nuevo tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar datos requeridos
    if (!body.name_tag) {
      return NextResponse.json(
        { error: 'Falta el campo requerido: nombre' },
        { status: 400 }
      );
    }
    
    const newTagId = await TagService.createTag(body.name_tag, body.color_tag || '#000000');
    const newTag = await TagService.getTagById(newTagId);
    
    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    console.error('Error al crear tag:', error);
    return NextResponse.json({ error: 'Error al crear tag' }, { status: 500 });
  }
}