import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Category } from '@/lib/constants';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Error al cargar categorías');
      const data = await res.json();
      const sorted = data.sort(
        (a: Category, b: Category) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
      setCategories(sorted);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, setCategories, loading, fetchCategories };
}
