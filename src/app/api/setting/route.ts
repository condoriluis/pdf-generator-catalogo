import { NextRequest, NextResponse } from 'next/server';
import { getSettings, updateSetting } from '@/lib/utils/dataJson';

// GET /api/setting - obtener setting
export async function GET() {
  try {
    const settings = await getSettings();
    if (!settings || settings.length === 0) {
      return NextResponse.json(null);
    }
    return NextResponse.json(settings[0]);
  } catch (error) {
    console.error("Error al obtener setting:", error);
    return NextResponse.json({ error: "Error al obtener setting" }, { status: 500 });
  }
}

// PUT /api/setting - actualizar setting
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const settings = await getSettings();

    if (!settings || settings.length === 0) {
      return NextResponse.json({ error: "No hay setting para actualizar" }, { status: 404 });
    }

    const updatedSetting = await updateSetting(settings[0]!.id, body);
    return NextResponse.json(updatedSetting);
  } catch (error) {
    console.error("Error al actualizar setting:", error);
    return NextResponse.json({ error: "Error al actualizar setting" }, { status: 500 });
  }
}