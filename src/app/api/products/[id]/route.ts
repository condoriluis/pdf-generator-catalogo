import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '../ProductService';

// GET /api/products/[id] - Obtener un producto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const product = await ProductService.getProductById(params.id);
    
    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener producto' }, { status: 500 });
  }
}

// PUT /api/products/[id] - Actualizar un producto
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const body = await request.json();

    const isAvailable: boolean = body.isAvailable_product;
    const hasOffer: boolean = body.hasOffer_product;
    const status: boolean = body.status_product;

    const payload = {
      name_product: body.name_product,
      description_product: body.description_product,
      price_product: parseFloat(body.price_product),
      stock_product: body.stock_product,
      isAvailable_product: isAvailable ? 1 : 0,
      image_product: body.image_product,
      id_category_product: Number(body.id_category_product),
      status_product: status ? 1 : 0,
      id_tag_product: body.id_tag_product,
      offerPrice_product: parseFloat(body.offerPrice_product),
      hasOffer_product: hasOffer ? 1 : 0,
    };

    const updatedProduct = await ProductService.updateProduct(
      Number(id),
      payload.name_product,
      payload.description_product,
      payload.price_product,
      payload.stock_product,
      payload.isAvailable_product,
      payload.image_product,
      payload.id_category_product,
      payload.status_product,
      payload.id_tag_product,
      payload.offerPrice_product,
      payload.hasOffer_product
    );
    
    if (updatedProduct) {
      const getUpdatedProduct = await ProductService.getProductById(Number(id));
      return NextResponse.json(getUpdatedProduct, { status: 200 });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 });
  }
}

// DELETE /api/products/[id] - Eliminar un producto
export const DELETE = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: 'ID de producto es necesario' }, { status: 400 });
    }
    
    await ProductService.deleteProduct(parseInt(id));
    return NextResponse.json({ message: 'Producto eliminado correctamente' });

  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 });
  }
}