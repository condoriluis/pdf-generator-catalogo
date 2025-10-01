import { NextResponse } from "next/server";
import { query } from '@/lib/utils/db';

export async function GET() {
  try {
    const [products, categories, tags, settings] = await Promise.all([
      query("SELECT * FROM products"),
      query("SELECT * FROM categories"),
      query("SELECT * FROM tags"),
      query("SELECT * FROM settings")
    ]);

    return NextResponse.json({ products, categories, tags, settings });
  } catch (error) {
    console.error("Error en dashboard API:", error);
    return NextResponse.json({ error: "Error al obtener datos" }, { status: 500 });
  }
}
