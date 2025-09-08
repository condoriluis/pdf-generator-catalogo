import { NextRequest, NextResponse } from 'next/server';
import { getTags, createTag } from '@/lib/utils/dataJson';

// GET /api/tags - Obtener todos los tags
export async function GET(request: NextRequest) {
  try {
    const tags = await getTags();
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
    if (!body.name) {
      return NextResponse.json(
        { error: 'Falta el campo requerido: name' },
        { status: 400 }
      );
    }
    
    const newTag = await createTag({
      name: body.name,
      color: body.color || '#000000',
    });
    
    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    console.error('Error al crear tag:', error);
    return NextResponse.json({ error: 'Error al crear tag' }, { status: 500 });
  }
}