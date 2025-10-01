import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { ServerCatalogDocumentGrid } from './pdf-grid-generator';
import { ServerCatalogDocumentList } from './pdf-list-generator';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/dashboard`, {
      cache: 'no-store'
    });
    const data = await res.json();

    if (!data || !data.settings?.length) {
      return NextResponse.json(
        { error: 'No se encontraron configuraciones' },
        { status: 404 }
      );
    }

    const productsParsed = (data.products || []).map((p: any) => ({
      ...p,
      id_tag_product: p.id_tag_product
        ? JSON.parse(p.id_tag_product)
        : []
    }));

    const config = data.settings[0];
    const watermarkConfig =
      typeof config.watermark_setting === 'string'
        ? JSON.parse(config.watermark_setting)
        : config.watermark_setting;

    const catalog = {
      products: productsParsed,
      categories: data.categories || [],
      tags: data.tags || []
    };

    const orientationConfig = config.orientation_setting || 'portrait';
    const templateConfig = config.template_setting || 'grid';

    const templateMap = {
      grid: ServerCatalogDocumentGrid,
      list: ServerCatalogDocumentList,
    };

    const TemplateComponent =
      templateMap[templateConfig as keyof typeof templateMap] ||
      ServerCatalogDocumentGrid;

    // Generamos PDF
    const buffer = await renderToBuffer(
      <TemplateComponent
        catalog={catalog}
        title={config.title_setting || 'Catálogo de Productos'}
        subtitle={`Generado el ${new Date().toLocaleDateString()}`}
        description={
          config.description_setting ||
          'Catálogo completo de productos disponibles en nuestra tienda.'
        }
        logo_url={config.logo_url_setting}
        category_bg={config.category_bg_setting || '#0ea5e9'}
        orientation={orientationConfig}
        template={templateConfig}
        watermark={watermarkConfig}
      />
    );

    const response = new NextResponse(buffer);
    response.headers.set('Content-Type', 'application/pdf');

    const preview = searchParams.get('preview') === 'true';
    response.headers.set(
      'Content-Disposition',
      preview
        ? `inline; filename="catalogo-productos.pdf"`
        : `attachment; filename="catalogo-productos.pdf"`
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al generar el PDF',
        message:
          'Ha ocurrido un problema al generar el documento PDF. Por favor, inténtelo de nuevo más tarde.',
        details: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
