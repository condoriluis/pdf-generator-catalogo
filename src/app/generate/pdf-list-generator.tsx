import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { styles } from './styles/pdfStyles';
import { Watermark } from './watermark';
import type { Product, Category, Tag, Watermark as WatermarkType } from '@/lib/constants';
import { getImageUrl } from './utils/getImageUrl';
import { registerPdfFonts } from './utils/fonts';

registerPdfFonts();

type ServerCatalogDocumentListCompactProps = {
  catalog: {
    categories: Category[];
    products: Product[];
    tags: Tag[];
  };
  title: string;
  subtitle?: string;
  description: string;
  logo_url?: string;
  category_bg: string;
  orientation: string;
  template: string;
  watermark?: WatermarkType;
  isPdf?: boolean;
};

export const ServerCatalogDocumentList: React.FC<ServerCatalogDocumentListCompactProps> = ({
  catalog,
  title,
  subtitle,
  description,
  logo_url,
  category_bg,
  orientation,
  template,
  watermark,
  isPdf = false
}) => {

  const activeProducts = catalog.products
    .filter(p => p.status_product === 1)
    .sort((a, b) => new Date(b.date_created_product).getTime() - new Date(a.date_created_product).getTime());

  const productsByCategory = catalog.categories
    .map(category => ({
      category,
      products: activeProducts.filter(p => p.id_category_product === category.id_category),
    }))
    .filter(c => c.products.length > 0);

  return (
    <Document
      author='Luis CZ'
      title={`${title}, ${new Date().getFullYear()}`}
    >
      <Page size="A4" orientation={orientation as 'portrait' | 'landscape'} style={styles.page}>

        <Watermark watermark={watermark} />

        {/* Encabezado */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 0 }}>
          {logo_url && (
            <Image
              src={getImageUrl(logo_url, isPdf)}
              style={{ maxWidth: 140, maxHeight: 70, objectFit: 'contain', marginRight: 0 }}
            />
          )}
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', flexWrap: 'wrap' }}>{title}</Text>
            <Text style={{ fontSize: 10, color: '#475569', textAlign: 'center', marginTop: 2 }}>{description}</Text>
          </View>
        </View>

        {productsByCategory.map(({ category, products }) => (
          <View key={category.id_category} style={styles.section}>

            <Text style={{ ...styles.sectionTitle, backgroundColor: category_bg }}>
              {category.name_category}
            </Text>

            {products.map((product, index) => {
              const formattedPrice = new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(Number(product.price_product));
              const formattedOffer = product.offerPrice_product && Number(product.offerPrice_product) > 0
                ? new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(Number(product.offerPrice_product))
                : null;

              const rowBg = '#ffffff';

              return (
                <View key={product.id_product} style={{
                  flexDirection: 'row',
                  padding: 4,
                  marginBottom: 4,
                  borderRadius: 6,
                  backgroundColor: rowBg,
                  borderWidth: 0.3,
                  borderColor: '#e2e8f0',
                  alignItems: 'center',
                }}>

                  {product.image_product && (
                    <Image
                      src={getImageUrl(product.image_product, isPdf)}
                      style={{ width: 55, height: 55, objectFit: 'cover', borderRadius: 4, marginRight: 6 }}
                    />
                  )}

                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, fontWeight: 'bold' }}>{product.name_product}</Text>
                    <Text style={{ fontSize: 9, color: '#475569', marginBottom: 3 }}>
                      {product.description_product.length > 100 ? product.description_product.slice(0, 100) + '...' : product.description_product}
                    </Text>

                    {product.id_tag_product && (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      {(() => {
                        let tagIds: string[] = [];

                        if (typeof product.id_tag_product === 'string') {
                          try {
                            tagIds = JSON.parse(product.id_tag_product);
                          } catch (e) {
                            tagIds = [];
                          }
                        } else if (Array.isArray(product.id_tag_product)) {
                          tagIds = product.id_tag_product;
                        }

                        return tagIds
                          .map(tagId => catalog.tags.find(t => t.id_tag.toString() === tagId))
                          .filter(Boolean)
                          .map(tag => (
                            <Text
                              key={tag!.id_tag}
                              style={{
                                fontSize: 8,
                                paddingVertical: 2,
                                paddingHorizontal: 4,
                                marginRight: 3,
                                marginBottom: 3,
                                borderRadius: 6,
                                color: '#fff',
                                backgroundColor: tag!.color_tag || '#0ea5e9',
                              }}
                            >
                              {tag!.name_tag}
                            </Text>
                          ));
                      })()}
                    </View>
                  )}

                  </View>

                  <View style={{ width: 80, alignItems: 'flex-end' }}>
                    {formattedOffer ? (
                        <>
                        <Text style={{ fontSize: 8, color: '#64748b', textDecoration: 'line-through', marginBottom: 1 }}>
                            Antes: {formattedPrice}
                        </Text>
                        <Text style={{ fontSize: 10, color: '#16a34a', fontWeight: 'bold', marginBottom: 2 }}>
                            Ahora: {formattedOffer}
                        </Text>
                        </>
                    ) : (
                        <Text style={{ fontSize: 10, color: '#16a34a', fontWeight: 'bold', marginBottom: 2 }}>
                        {formattedPrice}
                        </Text>
                    )}

                    {product.isAvailable_product ? (
                      <Text style={{ fontSize: 9, color: '#475569' }}>
                        Stock:{' '}
                        <Text style={{ fontSize: 9, color: '#16a34a' }}>
                          Disponible
                        </Text>
                      </Text>
                    ) : (
                        <Text style={{ fontSize: 9, color: '#475569' }}>Stock: {product.stock_product} unidades</Text>
                    )}

                   </View>

                </View>
              );
            })}
          </View>
        ))}

        {/* Pie de página */}
        <View fixed style={styles.pageNumber}>
          <Text style={{ fontSize: 9, color: '#64748b' }}>{new Date().toLocaleDateString()}</Text>
          <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
};
