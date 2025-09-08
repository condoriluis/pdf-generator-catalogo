import { NextRequest, NextResponse } from 'next/server';
import { getCategoryById, updateCategory, deleteCategory } from '@/lib/utils/dataJson';

// GET /api/categories/[id] - Obtener una categoría por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await getCategoryById(params.id);
    
    if (!category) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }
    
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener categoría' }, { status: 500 });
  }
}

// PUT /api/categories/[id] - Actualizar una categoría
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedCategory = await updateCategory(params.id, body);
    
    if (!updatedCategory) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }
    
    return NextResponse.json(updatedCategory);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar categoría' }, { status: 500 });
  }
}

// DELETE /api/categories/[id] - Eliminar una categoría
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await deleteCategory(params.id);

    if (!result.success && result.linkedProducts) {
      return NextResponse.json(
        { error: `No se puede eliminar la categoría. Productos vinculados: ${result.linkedProducts.join(', ')}` },
        { status: 400 }
      );
    }

    if (!result.success) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar categoría' }, { status: 500 });
  }
}
