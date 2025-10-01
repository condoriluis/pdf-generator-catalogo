import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { styles } from './styles/pdfStyles';
import { Watermark } from './watermark';
import type { Product, Category, Tag, Watermark as WatermarkType } from '@/lib/constants';
import { getImageUrl } from './utils/getImageUrl';
import { registerPdfFonts } from './utils/fonts';

registerPdfFonts();

type ProductItemProps = {
  product: Product;
  tags: Tag[];
  isPdf: boolean;
};

const ProductItem: React.FC<ProductItemProps> = ({ product, tags, isPdf }) => {

  if (product.status_product !== 1) return null;

  const formattedPrice = new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(Number(product.price_product));
  const formattedOffer = product.offerPrice_product && Number(product.offerPrice_product) > 0
    ? new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(Number(product.offerPrice_product))
    : null;

  return (
    <View key={product.id_product} wrap={false} style={styles.productCard} >
      <View style={styles.productHeader}>
        {product.image_product && (
          <Image
            src={getImageUrl(product.image_product, isPdf)}
            style={styles.productImage}
          />
        )}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name_product}</Text>
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

          {product.isAvailable_product ? (
            <Text style={styles.productStock}>
              Stock:{' '}
              <Text style={{ fontSize: 9, color: '#16a34a' }}>
                Disponible
              </Text>
            </Text>
          ) : (
            <Text style={styles.productStock}>Stock: {product.stock_product} unidades</Text>
          )}

        </View>
      </View>
      <Text style={styles.productDescription}>
        {product.description_product.length > 100
          ? product.description_product.slice(0, 100) + '...'
          : product.description_product}
      </Text> 
      
      {/* Mostrar tags si existen */}
      {product.id_tag_product && (
        <View style={styles.tagsContainer}>
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
              .map(tagId => tags.find(t => t.id_tag.toString() === tagId))
              .filter(Boolean)
              .map(tag => (
                <Text
                  key={tag!.id_tag}
                  style={[styles.tag, { backgroundColor: tag!.color_tag || '#e0f2f1' }]}
                >
                  {tag!.name_tag}
                </Text>
              ));
          })()}
        </View>
      )}

    </View>
  );
};

type ServerCatalogDocumentGridProps = {
  catalog: {
    categories: Category[];
    products: Product[];
    tags: Tag[];
  };
  title: string;
  subtitle: string;
  description: string;
  logo_url: string;
  category_bg: string;
  orientation: string;
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
  .filter(product => product.status_product === 1)
  .sort((a, b) => new Date(b.date_created_product).getTime() - new Date(a.date_created_product).getTime());

  const productsByCategory = catalog.categories
    .map((category) => ({
      category,
      products: activeProducts.filter((product) => product.id_category_product === category.id_category),
    }))
    .filter(({ products }) => products.length > 0);

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
            <Text
              style={{
                fontSize: 20,
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
                fontSize: 10,
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
          <View key={category.id_category} wrap={false} style={styles.section}>
            <Text style={{ ...styles.sectionTitle, backgroundColor: category_bg }}>
              {category.name_category}
            </Text>
            <View style={styles.productsContainer}>
              {products.map((product) => (
                <ProductItem key={product.id_product} product={product} tags={catalog.tags} isPdf={isPdf} />
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