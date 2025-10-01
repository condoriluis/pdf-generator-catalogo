import { NextRequest, NextResponse } from 'next/server';
import { SettingService } from './SettingService';

// GET /api/setting - obtener setting
export async function GET() {
  try {
    const settings = await SettingService.getSetting();
    if (!settings || settings.length === 0) {
      return NextResponse.json(null);
    }
    return NextResponse.json(settings[0]);
  } catch (error) {
    console.error("Error al obtener setting:", error);
    return NextResponse.json({ error: "Error al obtener ajustes" }, { status: 500 });
  }
}

// PUT /api/setting - actualizar setting
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const settings = await SettingService.getSetting();
  
    if (!settings || settings.length === 0) {
      return NextResponse.json({ error: "No hay ajustes para actualizar" }, { status: 404 });
    }

    const payload = {
      id_setting: body.id_setting,
      logo_url_setting: body.logo_url_setting,
      title_setting: body.title_setting,
      description_setting: body.description_setting,
      category_bg_setting: body.category_bg_setting,
      orientation_setting: body.orientation_setting,
      template_setting: body.template_setting,
      watermark_setting: JSON.stringify(body.watermark_setting),
    };

    const updatedSetting = await SettingService.updateSetting(
      payload.id_setting,
      payload.logo_url_setting,
      payload.title_setting,
      payload.description_setting,
      payload.category_bg_setting,
      payload.orientation_setting,
      payload.template_setting,
      payload.watermark_setting,
    );

    if (updatedSetting) {
      return NextResponse.json(updatedSetting);
    }

    return NextResponse.json({ error: "Error al actualizar ajustes" }, { status: 500 });

  } catch (error) {
    console.error("Error al actualizar setting:", error);
    return NextResponse.json({ error: "Error al actualizar setting" }, { status: 500 });
  }
}