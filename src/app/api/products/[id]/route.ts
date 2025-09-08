import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/lib/utils/dataJson';

// GET /api/products/[id] - Obtener un producto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getProductById(params.id);
    
    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error(`Error al obtener producto ${params.id}:`, error);
    return NextResponse.json({ error: 'Error al obtener producto' }, { status: 500 });
  }
}

// PUT /api/products/[id] - Actualizar un producto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedProduct = await updateProduct(params.id, body);
    
    if (!updatedProduct) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(`Error al actualizar producto ${params.id}:`, error);
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 });
  }
}

// DELETE /api/products/[id] - Eliminar un producto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteProduct(params.id);
    
    if (!success) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error(`Error al eliminar producto ${params.id}:`, error);
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 });
  }
}