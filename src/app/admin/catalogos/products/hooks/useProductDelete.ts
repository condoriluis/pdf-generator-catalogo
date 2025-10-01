import { useState } from 'react';
import { toast } from 'sonner';
import { Product } from '@/lib/constants';

export function useProductDelete(
  products: Product[],
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
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
      const res = await fetch(`/api/products/${deleteId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error desconocido');
      toast.success(data.message || 'Producto eliminado correctamente');

      setProducts(prev => prev.filter(p => p.id_product.toString() !== deleteId));
      
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      toast.error(msg);
    } finally {
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  return { deleteDialogOpen, setDeleteDialogOpen, confirmDelete, handleDeleteConfirmed };
}
