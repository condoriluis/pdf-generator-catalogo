import { NextRequest, NextResponse } from 'next/server';
import { CategoryService } from '../CategoryService';
import { ProductService } from '../../products/ProductService';

// GET /api/categories/[id] - Obtener una categoría por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const category = await CategoryService.getCategoryById(params.id);
    
    if (!category) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }
    
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener categoría' }, { status: 500 });
  }
}

// PUT /api/categories/[id] - Actualizar una categoría
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }
) {

  try {
    const { id } = await context.params;

    const body = await request.json();

    const updatedCategory = await CategoryService.updateCategory(
      Number(id),
      body.name_category,
      body.description_category
    );

    if (updatedCategory) {
      const getUpdatedCategory = await CategoryService.getCategoryById(Number(id));
      return NextResponse.json(getUpdatedCategory, { status: 200 });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar categoría' }, { status: 500 });
  }
}

// DELETE /api/categories/[id] - Eliminar una categoría
export const DELETE = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {

  try {

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: 'ID de categoría es necesario' }, { status: 400 });
    }

    const result = await ProductService.getProductsByCategory(Number(id));

    if (result.length > 0) {
      return NextResponse.json(
        { error: `No se puede eliminar la categoría. Productos vinculados: ${result.map((product: any) => product.name_product).join(', ')}` },
        { status: 400 }
      );
    }

    await CategoryService.deleteCategory(parseInt(id));
    return NextResponse.json({ message: 'Categoría eliminada correctamente' });

  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar categoría' }, { status: 500 });
  }
}
