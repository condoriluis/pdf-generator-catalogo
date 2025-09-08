import { NextRequest, NextResponse } from 'next/server';
import { getCategories, createCategory } from '@/lib/utils/dataJson';

// GET /api/categories - Obtener todas las categorías
export async function GET(request: NextRequest) {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener categorías' }, { status: 500 });
  }
}

// POST /api/categories - Crear una nueva categoría
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar datos requeridos
    if (!body.name || !body.description) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: name, description' },
        { status: 400 }
      );
    }
    
    const newCategory = await createCategory({
      name: body.name,
      description: body.description,
    });
    
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear categoría' }, { status: 500 });
  }
}