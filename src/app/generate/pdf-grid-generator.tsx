import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { styles } from './styles/pdfStyles';
import { Watermark } from './watermark';
import type { Product, Category, OrientationType, Watermark as WatermarkType } from '@/lib/constants';
import { getImageUrl } from './utils/getImageUrl';
import { registerPdfFonts } from './utils/fonts';

registerPdfFonts();

type ProductItemProps = {
  product: Product;
  tags: { id: string; name: string; color?: string }[];
  isPdf: boolean;
};

const ProductItem: React.FC<ProductItemProps> = ({ product, tags, isPdf }) => {

  if (product.status !== 1) return null;

  const formattedPrice = new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(Number(product.price));
  const formattedOffer = product.offerPrice && Number(product.offerPrice) > 0
    ? new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(Number(product.offerPrice))
    : null;

  return (
    <View key={product.id} wrap={false} style={styles.productCard} >
      <View style={styles.productHeader}>
        {product.image && (
          <Image
            src={getImageUrl(product.image, isPdf)}
            style={styles.productImage}
          />
        )}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          {formattedOffer ? (
            <Text style={styles.productPrice}>
              <Text style={{ fontSize: 8, fontStyle: 'italic', textDecoration: 'line-through', color: '#64748b' }}>
                Antes: {formattedPrice}
              </Text>{' '}
              <Text style={{ fontSize: 12, color: '#16a34a', fontWeight: 'bold' }}>
                {formattedOffer}
              </Text>
            </Text>
          ) : (
            <Text style={styles.productPrice}>{formattedPrice}</Text>
          )}

          {product.isAvailable ? (
            <Text style={styles.productStock}>Stock: Disponible</Text>
          ) : (
            <Text style={styles.productStock}>Stock: {product.stock} unidades</Text>
          )}

        </View>
      </View>
      <Text style={styles.productDescription}>
        {product.description.length > 100
          ? product.description.slice(0, 100) + '...'
          : product.description}
      </Text> 
      
      {/* Mostrar tags si existen */}
      {product.tags && product.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {product.tags.map(tagId => {
            const tag = tags.find(t => t.id === tagId);
            return tag ? (
              <Text key={tagId} style={[styles.tag, { backgroundColor: tag.color }]}>{tag.name}</Text>
            ) : null;
          })}
        </View>
      )}
    </View>
  );
};

type ServerCatalogDocumentGridProps = {
  catalog: {
    categories: Category[];
    products: Product[];
    tags: { id: string; name: string }[];
  };
  title: string;
  subtitle: string;
  description: string;
  logo_url: string;
  category_bg: string;
  orientation: OrientationType;
  template: string;
  watermark?: WatermarkType;
  isPdf?: boolean;
};

export const ServerCatalogDocumentGrid: React.FC<ServerCatalogDocumentGridProps> = ({
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
  .filter(product => product.status === 1)
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const productsByCategory = catalog.categories
    .map((category) => ({
      category,
      products: activeProducts.filter((product) => product.categoryId === category.id),
    }))
    .filter(({ products }) => products.length > 0);

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
            <Text
              style={{
                fontSize: 22,
                fontWeight: 'bold',
                color: '#1e293b',
                textAlign: 'center',
                flexWrap: 'wrap',
              }}
            >
              {title}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: '#475569',
                marginTop: 2,
                textAlign: 'center',
                flexWrap: 'wrap',
              }}
            >
              {description}
            </Text>
          </View>
        </View>

        {/* Secciones por categoría */}
        {productsByCategory.map(({ category, products }) => (
          <View key={category.id} wrap={false} style={styles.section}>
            <Text style={{ ...styles.sectionTitle, backgroundColor: category_bg }}>
              {category.name}
            </Text>
            <View style={styles.productsContainer}>
              {products.map((product) => (
                <ProductItem key={product.id} product={product} tags={catalog.tags} isPdf={isPdf} />
              ))}
            </View>
          </View>
        ))}
        
        {/* Pie de página */}
        <View
          fixed
          style={styles.pageNumber}
          >
          {/* Fecha a la izquierda */}
          <Text style={{ fontSize: 10, color: '#64748b' }}>
            {new Date().toLocaleDateString()}
          </Text>
          <Text
            
            render={({ pageNumber, totalPages }) =>
              `Página ${pageNumber} de ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
};