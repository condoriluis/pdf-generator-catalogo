import { useEffect, useState } from 'react';
import { Product } from '@/lib/constants';
import { toast } from 'sonner';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Error al cargar productos');
      const data = await res.json();

      const mappedData: Product[] = data.map((p: any) => ({
        ...p,
        isAvailable_product: Boolean(p.isAvailable_product),
        hasOffer_product: Boolean(p.hasOffer_product),
      }));

      const sortedData = mappedData.sort(
        (a: Product, b: Product) =>
          new Date(b.date_created_product).getTime() - new Date(a.date_created_product).getTime()
      );
      setProducts(sortedData);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, setProducts, loading, error, fetchProducts };
}
