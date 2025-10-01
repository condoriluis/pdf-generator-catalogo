import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from './ProductService';

// GET /api/products - Obtener todos los productos
export async function GET(request: NextRequest) {
  try {
    const products = await ProductService.getProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 });
  }
}

// POST /api/products - Crear un nuevo producto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name_product || !body.description_product || !body.price_product || !body.id_category_product) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: nombre, descripción, precio, categoría' },
        { status: 400 }
      );
    }

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
    
    const newProductId = await ProductService.createProduct(
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
      payload.hasOffer_product,
    );
    
    const newProduct = await ProductService.getProductById(newProductId.id_product);
    return NextResponse.json(newProduct, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 });
  }
}