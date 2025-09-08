import { useState } from 'react';
import { toast } from 'sonner';
import { Tag } from '@/lib/constants';

export function useTagForm(
  tags: Tag[],
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>
) {
  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    color: '#3B82F6',
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
    setFormData({ id: '', name: '', color: '#3B82F6' });
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
    if (!formData.color.trim())
      newErrors.color = 'El color es requerido';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing
        ? `/api/tags/${formData.id}`
        : '/api/tags';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok)
        throw new Error(isEditing ? 'Error al actualizar' : 'Error al crear');
      const newTag = await res.json();
      toast.success(
        isEditing
          ? 'Etiqueta actualizada correctamente'
          : 'Etiqueta creada correctamente'
      );
      
      setTags(prev =>
        isEditing
          ? prev.map(c => (c.id === newTag.id ? newTag : c))
          : [newTag, ...prev]
      );

      resetForm();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      toast.error(msg);
    }
  };

  const handleEdit = (tag: Tag) => {
    setFormData({
      id: tag.id,
      name: tag.name,
      color: tag.color || '',
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
