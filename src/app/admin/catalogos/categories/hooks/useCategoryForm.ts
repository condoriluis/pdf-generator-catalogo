import { useState } from 'react';
import { toast } from 'sonner';
import { Category } from '@/lib/constants';

export function useCategoryForm(
  categories: Category[],
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
) {
  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const resetForm = () => {
    setFormData({ id: '', name: '', description: '' });
    setIsEditing(false);
    setFormOpen(false);
    setErrors({});
  };

  const handleNew = () => {
    resetForm();
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.description.trim())
      newErrors.description = 'La descripción es requerida';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing
        ? `/api/categories/${formData.id}`
        : '/api/categories';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok)
        throw new Error(isEditing ? 'Error al actualizar' : 'Error al crear');

      const newCat = await res.json();

      toast.success(
        isEditing
          ? 'Categoría actualizada correctamente'
          : 'Categoría creada correctamente'
      );
      setCategories(prev =>
        isEditing
          ? prev.map(c => (c.id === newCat.id ? newCat : c))
          : [newCat, ...prev]
      );
      
      resetForm();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      toast.error(msg);
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      id: category.id,
      name: category.name,
      description: category.description,
    });
    setIsEditing(true);
    setErrors({});
    setFormOpen(true);
  };

  return {
    formOpen,
    setFormOpen,
    formData,
    errors,
    isEditing,
    handleChange,
    handleNew,
    handleSubmit,
    resetForm,
    handleEdit,
  };
}
