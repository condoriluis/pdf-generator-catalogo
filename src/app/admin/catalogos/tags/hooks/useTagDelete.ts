import { useState } from 'react';
import { toast } from 'sonner';
import { Tag } from '@/lib/constants';

export function useTagDelete(
  tags: Tag[],
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>
) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/tags/${deleteId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error desconocido');
      toast.success(data.message || 'Etiqueta eliminada correctamente');
      
      setTags(prev => prev.filter(c => c.id !== deleteId));
      
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
