import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '@/lib/utils/dataJson';
import { Product } from '@/lib/constants';

// GET /api/products - Obtener todos los productos
export async function GET(request: NextRequest) {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 });
  }
}

// POST /api/products - Crear un nuevo producto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos requeridos
    if (!body.name || !body.description || body.price === undefined || body.stock === undefined || !body.categoryId) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: nombre, descripción, precio, stock, categoría' },
        { status: 400 }
      );
    }
    
    const newProduct = await createProduct({
      name: body.name,
      description: body.description,
      price: body.price,
      image: body.image,
      stock: body.stock,
      categoryId: body.categoryId,
      status: body.status,
      tags: body.tags || [],
      offerPrice: body.offerPrice,
    });
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 });
  }
}