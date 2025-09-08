import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    padding: 24,
    backgroundColor: '#f5f5f7', // Fondo muy suave
    fontFamily: 'Ubuntu',
  },
  header: {
    marginBottom: 0,
    paddingBottom: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b', // Azul oscuro elegante
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: '#475569',
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 10,
  },
  section: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    padding: 4,
    backgroundColor: '#0ea5e9',
    color: '#ffffff',
    borderRadius: 8,
    marginBottom: 6,
  },
  productsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    padding: 10,
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    border: '1px solid #e0e7ff', // Borde suave azul pastel
  },
  productHeader: {
    flexDirection: 'row',
    marginBottom: 2,
    alignItems: 'center',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 6,
    objectFit: 'cover',
    marginRight: 12,
    border: '1px solid #dbeafe',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#0f172a',
  },
  productPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#16a34a', // Verde llamativo para precio
  },
  productStock: {
    fontSize: 10,
    color: '#475569',
    marginTop: 2,
  },
  productDescription: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 6,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    gap: 4,
  },
  tag: {
    fontSize: 9,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    color: '#ffffff',
  },
  pageNumber: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 12,
    bottom: 24,
    left: 24,
    right: 35,
    color: '#94a3b8',
  },
});
