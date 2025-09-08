import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { catalog } from '@/lib/constants';
import { ServerCatalogDocumentGrid } from './pdf-grid-generator';
import { ServerCatalogDocumentList } from './pdf-list-generator';
import { getSettings } from '@/lib/utils/dataJson';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const settings = await getSettings();
    const config = settings?.[0];

    if (!config) {
      return NextResponse.json({ error: 'No se encontraron configuraciones' }, { status: 404 });
    }

    const watermarkConfig = config.watermark;
    const orientationConfig = config.orientation || 'portrait';
    const templateConfig = config.template || 'grid';

    const templateMap = {
      grid: ServerCatalogDocumentGrid,
      list: ServerCatalogDocumentList,
    };

    const TemplateComponent = templateMap[templateConfig] || ServerCatalogDocumentGrid;

    const buffer = await renderToBuffer(
      <TemplateComponent
        catalog={catalog}
        title={config.title || 'Catálogo de Productos'}
        subtitle={`Generado el ${new Date().toLocaleDateString()}`}
        description={config.description || 'Catálogo completo de productos disponibles en nuestra tienda.'}
        logo_url={config.logo_url}
        category_bg={config.category_bg || '#0ea5e9'}
        orientation={orientationConfig}
        template={templateConfig}
        watermark={watermarkConfig}/>
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
        message: 'Ha ocurrido un problema al generar el documento PDF. Por favor, inténtelo de nuevo más tarde.',
        details: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
