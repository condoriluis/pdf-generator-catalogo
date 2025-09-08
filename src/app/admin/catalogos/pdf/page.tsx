'use client';

import { useState, useEffect } from 'react';
import { PDFViewer } from '@/components/pdf';
import { catalog, Setting, OrientationType } from '@/lib/constants';
import { Button } from '@/components/ui';
import { SITE_URL } from '@/lib/constants/site';
import { getSettings } from '@/lib/utils/dataJson';
import { GeneratePDFButton } from '@/components/pdf/generate-pdf-button';
import { ServerCatalogDocumentGrid } from '@/app/generate/pdf-grid-generator';
import { ServerCatalogDocumentList } from '@/app/generate/pdf-list-generator';

export default function CatalogPage() {

  const [settings, setSettings] = useState<Setting | null>(null);

  const [showPDF, setShowPDF] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      const data = await getSettings();
      setSettings(data?.[0] as Setting);
    }
    fetchSettings();
  }, []);

  const activeProducts = catalog.products
  .filter(product => product.status === 1)
  .sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  const productsToShow = showAll ? activeProducts : activeProducts;
  const orientation: OrientationType = settings?.orientation || 'portrait';
  const template: 'grid' | 'list' = settings?.template || 'grid';

  if (!settings) return <div>Cargando configuración...</div>;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex flex-col items-start">
          <h1 className="text-4xl font-bold tracking-tight">PDF Generator</h1>
          <p className="text-muted-foreground text-lg">
            Generador de PDFs para catálogos de productos
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setShowPDF(!showPDF)}
            className="hover:bg-gray-100 transition"
          >
            {!showPDF ? 'Ocultar PDF' : 'Ver PDF'}
          </Button>

          <GeneratePDFButton preview={true} className="bg-teal-600 hover:bg-teal-700 text-white">
            Abrir PDF
          </GeneratePDFButton>

        </div>
      </div>

      {/* PDF Viewer */}
      {!showPDF ? (
        <div className="w-full h-[80vh] md:h-[800px] border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <PDFViewer width="100%" height="800px">
            {template === 'grid' ? (
              <ServerCatalogDocumentGrid 
                catalog={catalog}
                title={settings.title || 'Catálogo de Productos'}
                subtitle={`Generado el ${new Date().toLocaleDateString()}`}
                description={settings.description || 'Catálogo completo de productos.'}
                logo_url={settings.logo_url || ''}
                category_bg={settings.category_bg || '#0ea5e9'}
                orientation={orientation}
                template={template}
                watermark={settings.watermark}
                isPdf={true}
              />
            ) : (
              <ServerCatalogDocumentList 
                catalog={catalog}
                title={settings.title || 'Catálogo de Productos'}
                subtitle={`Generado el ${new Date().toLocaleDateString()}`}
                description={settings.description || 'Catálogo completo de productos.'}
                logo_url={settings.logo_url || ''}
                category_bg={settings.category_bg || '#0ea5e9'}
                orientation={orientation}
                template={template}
                watermark={settings.watermark}
                isPdf={true}
              />
            )}
          </PDFViewer>
        </div>
      ) : (
        <>
          {template === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsToShow.map((product) => {
                  const category = catalog.categories.find(c => c.id === product.categoryId);
                  const tags = product.tags
                    ? product.tags.map(tagId => catalog.tags.find(t => t.id === tagId)).filter(Boolean)
                    : [];

                  return (
                    <div
                      key={product.id}
                      className="border-1 dark:bg-neutral-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
                    >
                      {/* Imagen */}
                      <div className="h-56 overflow-hidden rounded-t-xl">
                        <img
                          src={
                            product.image
                              ? product.image.startsWith('assets/images/')
                                ? `${SITE_URL}/${product.image}`
                                : product.image
                              : `${SITE_URL}/assets/images/image-default.jpg`
                          }
                          alt={product.name}
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Contenido */}
                      <div className="p-5 flex flex-col flex-1">

                        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2 dark:text-white hover:text-teal-600 transition-colors duration-300">
                          {product.name}
                        </h2>

                        <div className="flex items-baseline gap-2 mb-3">
                          {product.offerPrice && Number(product.offerPrice) > 0 ? (
                            <>
                              <span className="text-gray-500 line-through text-sm">
                                Antes: {new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(Number(product.price))}
                              </span>
                              <span className="text-green-600 font-bold text-lg">
                                Ahora: {new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(Number(product.offerPrice))}
                              </span>
                            </>
                          ) : (
                            <span className="text-green-600 font-bold text-lg">
                              {new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(Number(product.price))}
                            </span>
                          )}
                        </div>

                        {category && (
                          <div
                            className="inline-block px-3 py-1 mb-3 text-sm font-medium text-white rounded-full"
                            style={{ backgroundColor: '#0ea5e9' }}
                          >
                            Categoría: {category.name}
                          </div>
                        )}

                        <p className="text-gray-700 mb-4 flex-1 text-sm md:text-base dark:text-gray-400">
                          {product.description.length > 100
                            ? product.description.slice(0, 100) + '...'
                            : product.description}
                        </p>

                        <div className="flex justify-between items-center mt-auto flex-wrap gap-2">

                          {product.isAvailable ? (
                            <div className="text-sm text-gray-500">Stock: <span className="text-green-600">Disponible</span></div>
                          ) : (
                            <div className="text-sm ext-gray-500">Stock: {product.stock} unidades</div>
                          )}
                          
                          <div className="flex flex-wrap gap-2">
                            {tags.map(tag => tag && (
                              <span
                                key={tag.id}
                                className="px-3 py-1 text-xs font-medium rounded-full"
                                style={{
                                  backgroundColor: tag.color || '#e0f2f1',
                                  color: tag.color ? '#fff' : '#000'
                                }}
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {productsToShow.map(product => (
                <div
                  key={product.id}
                  className="flex flex-col md:flex-row border rounded-xl shadow-lg hover:shadow-xl transition overflow-hidden"
                >
                  {/* Imagen con tamaño uniforme */}
                  <div className="md:w-1/3 h-48 md:h-56 flex-shrink-0 overflow-hidden">
                    <img
                      src={product.image
                        ? product.image.startsWith('assets/images/')
                          ? `${SITE_URL}/${product.image}`
                          : product.image
                        : `${SITE_URL}/assets/images/image-default.jpg`}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Contenido */}
                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {product.name}
                    </h2>

                    <div className="mb-2">
                      {product.offerPrice && Number(product.offerPrice) > 0 ? (
                        <>
                          <p className="text-gray-500 line-through text-sm">
                            Antes:{' '}
                            {new Intl.NumberFormat('es-BO', {
                              style: 'currency',
                              currency: 'BOB',
                            }).format(Number(product.price))}
                          </p>
                          <p className="text-green-600 font-bold text-lg">
                            Ahora:{' '}
                            {new Intl.NumberFormat('es-BO', {
                              style: 'currency',
                              currency: 'BOB',
                            }).format(Number(product.offerPrice))}
                          </p>
                        </>
                      ) : (
                        <p className="text-green-600 font-bold text-lg">
                          {new Intl.NumberFormat('es-BO', {
                            style: 'currency',
                            currency: 'BOB',
                          }).format(Number(product.price))}
                        </p>
                      )}
                    </div>

                    {product.description && (
                      <p className="text-gray-700 text-sm md:text-base dark:text-gray-400 mb-3">
                        {product.description.length > 120
                          ? product.description.slice(0, 120) + '…'
                          : product.description}
                      </p>
                    )}

                    <div className="flex flex-wrap justify-between items-center gap-2 mt-auto">

                      {product.isAvailable ? (
                        <span className="text-sm text-gray-500">
                          Stock: <span className="text-green-600">Disponible</span>
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">
                          Stock: {product.stock} unidades
                        </span>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {product.tags?.map(tagId => {
                          const tag = catalog.tags.find(t => t.id === tagId);
                          return tag ? (
                            <span
                              key={tag.id}
                              className="px-3 py-1 text-xs font-medium rounded-full"
                              style={{
                                backgroundColor: tag.color || '#e0f2f1',
                                color: tag.color ? '#fff' : '#000',
                              }}
                            >
                              {tag.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          )}
        </>
      )}

    </div>
  );
}
