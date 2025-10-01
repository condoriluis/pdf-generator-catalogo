'use client';

import { useState, useEffect } from 'react';
import { PDFViewer } from '@/components/pdf';
import { Product, Category, Tag, Setting } from '@/lib/constants';
import { GeneratePDFButton } from '@/components/pdf/generate-pdf-button';
import { ServerCatalogDocumentGrid } from '@/app/generate/pdf-grid-generator';
import { ServerCatalogDocumentList } from '@/app/generate/pdf-list-generator';

export default function PdfPage() {

  const [settings, setSettings] = useState<Setting | null>(null);
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/dashboard')
      const data = await res.json()

      setProducts(data.products || [])
      setCategories(data.categories || [])
      setTags(data.tags || [])
      setSettings(data.settings?.[0] || null)
    }
    fetchData()
  }, [])

  const orientation = settings?.orientation_setting || 'portrait';
  const template = settings?.template_setting || 'grid';

  const config = settings;
  const watermarkConfig =
    typeof config?.watermark_setting === 'string'
      ? JSON.parse(config?.watermark_setting)
      : config?.watermark_setting;

  if (!settings) return <div>Cargando configuración...</div>;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex flex-col items-start">
          <h1 className="text-4xl font-bold tracking-tight">PDF Generator</h1>
          <p className="text-muted-foreground text-lg">
            Generador de PDF para catálogo de productos
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <GeneratePDFButton preview={true} className="bg-teal-600 hover:bg-teal-700 text-white">
            Abrir PDF generado
          </GeneratePDFButton>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="w-full h-[80vh] md:h-[800px] border border-gray-200 rounded-xl shadow-lg overflow-hidden">
        <PDFViewer width="100%" height="800px">
          {template === 'grid' ? (
            <ServerCatalogDocumentGrid 
              catalog={{ products, categories, tags}}
              title={settings.title_setting || 'Catálogo de Productos'}
              subtitle={`Generado el ${new Date().toLocaleDateString()}`}
              description={settings.description_setting || 'Catálogo completo de productos.'}
              logo_url={settings.logo_url_setting || ''}
              category_bg={settings.category_bg_setting || '#0ea5e9'}
              orientation={orientation}
              template={template}
              watermark={watermarkConfig}
              isPdf={true}
            />
          ) : (
            <ServerCatalogDocumentList 
              catalog={{ products, categories, tags }}
              title={settings.title_setting || 'Catálogo de Productos'}
              subtitle={`Generado el ${new Date().toLocaleDateString()}`}
              description={settings.description_setting || 'Catálogo completo de productos.'}
              logo_url={settings.logo_url_setting || ''}
              category_bg={settings.category_bg_setting || '#0ea5e9'}
              orientation={orientation}
              template={template}
              watermark={watermarkConfig}
              isPdf={true}
            />
          )}
        </PDFViewer>
      </div>
      
    </div>
  );
}
