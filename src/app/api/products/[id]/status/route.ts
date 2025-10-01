import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '../../ProductService';

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { status_product } = await req.json();
    const { id } = await context.params;

    await ProductService.updateStatusProduct(parseInt(id), Number(status_product));

    return NextResponse.json({ message: "Estado actualizado correctamente" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al actualizar el estado" }, { status: 500 });
  }
}
