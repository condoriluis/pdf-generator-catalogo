import { useState } from 'react';
import { toast } from 'sonner';
import { Category } from '@/lib/constants';

export function useCategoryDelete(
  categories: Category[],
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const confirmDelete = (id_category: number) => {
    setDeleteId(id_category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/categories/${deleteId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error desconocido');
      toast.success(data.message || 'Categoría eliminada correctamente');

      setCategories(prev => prev.filter(c => c.id_category !== deleteId));

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      toast.error(msg);
    } finally {
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  return {
    deleteDialogOpen,
    setDeleteDialogOpen,
    confirmDelete,
    handleDeleteConfirmed,
  };
}
