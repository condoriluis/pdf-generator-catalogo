import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { styles } from './styles/pdfStyles';
import { Watermark } from './watermark';
import type { Product, Category, OrientationType, Watermark as WatermarkType } from '@/lib/constants';
import { getImageUrl } from './utils/getImageUrl';
import { registerPdfFonts } from './utils/fonts';

registerPdfFonts();

type ServerCatalogDocumentListCompactProps = {
  catalog: {
    categories: Category[];
    products: Product[];
    tags: { id: string; name: string; color?: string }[];
  };
  title: string;
  subtitle?: string;
  description: string;
  logo_url?: string;
  category_bg: string;
  orientation: OrientationType;
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
  isPdf
}) => {
  const activeProducts = catalog.products
    .filter(p => p.status === 1)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const productsByCategory = catalog.categories
    .map(category => ({
      category,
      products: activeProducts.filter(p => p.categoryId === category.id),
    }))
    .filter(c => c.products.length > 0);

  return (
    <Document
      author='Luis CZ'
      title={`${title}, ${new Date().getFullYear()}`}
    >
      <Page size="A4" orientation={orientation} style={styles.page}>

        <Watermark watermark={watermark} />

        {/* Encabezado */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          {logo_url && (
            <Image
              src={getImageUrl(logo_url, isPdf)}
              style={{ width: 80, height: 50, objectFit: 'contain', marginRight: 0 }}
            />
          )}
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', flexWrap: 'wrap' }}>{title}</Text>
            <Text style={{ fontSize: 10, color: '#475569', textAlign: 'center', marginTop: 2 }}>{description}</Text>
          </View>
        </View>

        {productsByCategory.map(({ category, products }) => (
          <View key={category.id} style={styles.section}>

            <Text style={{ ...styles.sectionTitle, backgroundColor: category_bg }}>
              {category.name}
            </Text>

            {products.map((product, index) => {
              const formattedPrice = new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(Number(product.price));
              const formattedOffer = product.offerPrice && Number(product.offerPrice) > 0
                ? new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(Number(product.offerPrice))
                : null;

              const rowBg = '#ffffff';

              return (
                <View key={product.id} style={{
                  flexDirection: 'row',
                  padding: 4,
                  marginBottom: 4,
                  borderRadius: 6,
                  backgroundColor: rowBg,
                  borderWidth: 0.3,
                  borderColor: '#e2e8f0',
                  alignItems: 'center',
                }}>

                  {product.image && (
                    <Image
                      src={getImageUrl(product.image, isPdf)}
                      style={{ width: 55, height: 55, objectFit: 'cover', borderRadius: 4, marginRight: 6 }}
                    />
                  )}

                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, fontWeight: 'bold' }}>{product.name}</Text>
                    <Text style={{ fontSize: 9, color: '#475569', marginBottom: 3 }}>
                      {product.description.length > 100 ? product.description.slice(0, 100) + '...' : product.description}
                    </Text>

                    {product.tags && product.tags.length > 0 && (
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {product.tags.map(tagId => {
                          const tag = catalog.tags.find(t => t.id === tagId);
                          return tag ? (
                            <Text key={tagId} style={{
                              fontSize: 8,
                              paddingVertical: 2,
                              paddingHorizontal: 4,
                              marginRight: 3,
                              marginBottom: 3,
                              borderRadius: 6,
                              color: '#fff',
                              backgroundColor: tag.color || '#0ea5e9'
                            }}>{tag.name}</Text>
                          ) : null;
                        })}
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

                    {product.isAvailable ? (
                        <Text style={{ fontSize: 9, color: '#475569' }}>Stock: Disponible</Text>
                    ) : (
                        <Text style={{ fontSize: 9, color: '#475569' }}>Stock: {product.stock} unidades</Text>
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
