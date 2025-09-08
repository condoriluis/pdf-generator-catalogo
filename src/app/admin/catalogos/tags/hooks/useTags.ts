import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Tag } from '@/lib/constants';

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tags');
      if (!res.ok) throw new Error('Error al cargar etiquetas');
      const data = await res.json();
      const sorted = data.sort(
        (a: Tag, b: Tag) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
      setTags(sorted);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return { tags, setTags, loading, fetchTags };
}
