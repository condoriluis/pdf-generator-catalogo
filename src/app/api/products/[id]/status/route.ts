import { NextResponse } from 'next/server';
import { updateProductStatus } from '@/lib/utils/dataJson';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = await req.json()

    await updateProductStatus(params.id, { status })

    return NextResponse.json({ message: "Estado actualizado correctamente" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error al actualizar el estado" }, { status: 500 })
  }
}
