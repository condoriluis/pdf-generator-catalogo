import { NextRequest, NextResponse } from 'next/server';
import { CategoryService } from './CategoryService';

// GET /api/categories - Obtener todas las categorías
export async function GET(request: NextRequest) {
  try {
    const categories = await CategoryService.getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener categorías' }, { status: 500 });
  }
}

// POST /api/categories - Crear una nueva categoría
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name_category, description_category } = body;
    
    if (!name_category || !description_category) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: nombre, descripción' },
        { status: 400 }
      );
    }
    
    const newCategoryId = await CategoryService.createCategory(name_category, description_category);
    const newCategory = await CategoryService.getCategoryById(newCategoryId);

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear categoría' }, { status: 500 });
  }
}