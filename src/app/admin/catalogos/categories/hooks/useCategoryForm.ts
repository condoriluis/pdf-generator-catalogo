import { useState } from 'react';
import { toast } from 'sonner';
import { Category } from '@/lib/constants';
import { validateInput } from '@/lib/utils/inputValidation';

export function useCategoryForm(
  categories: Category[],
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
) {
  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    id_category: 0,
    name_category: '',
    description_category: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    const { value: cleanValue, isValid } = validateInput(value);

    setFormData(prev => ({ ...prev, [name]: cleanValue }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: !isValid ? 'Este carácter no está permitido' : '',
      }));
    }
  };

  const resetForm = () => {
    setFormData({ id_category: 0, name_category: '', description_category: '' });
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
    
    const nameValid = validateInput(formData.name_category);
    const descValid = validateInput(formData.description_category);
    const newErrors: Record<string, string> = {};

    if (!nameValid.isValid || !nameValid.value.trim())
      newErrors.name_category = 'Nombre inválido';
    if (!descValid.isValid || !descValid.value.trim())
      newErrors.description_category = 'Descripción inválida';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const cleanData = {
      ...formData,
      name_category: nameValid.value,
      description_category: descValid.value,
    };

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing
        ? `/api/categories/${formData.id_category}`
        : '/api/categories';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData),
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
          ? prev.map(c => (c.id_category === newCat.id_category ? newCat : c))
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
      id_category: category.id_category,
      name_category: category.name_category,
      description_category: category.description_category,
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
