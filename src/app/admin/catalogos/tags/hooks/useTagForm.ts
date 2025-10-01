import { useState } from 'react';
import { toast } from 'sonner';
import { Tag } from '@/lib/constants';
import { validateInput } from '@/lib/utils/inputValidation';

export function useTagForm(
  tags: Tag[],
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>
) {
  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    id_tag: 0,
    name_tag: '',
    color_tag: '',
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
    setFormData({ id_tag: 0, name_tag: '', color_tag: '' });
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

    const nameValid = validateInput(formData.name_tag);
    const colorValid = validateInput(formData.color_tag);
    const newErrors: Record<string, string> = {};

    if (!nameValid.isValid || !nameValid.value.trim())
      newErrors.name_tag = 'Nombre inválido';
    if (!colorValid.isValid || !colorValid.value.trim())
      newErrors.color_tag = 'Color inválido';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const cleanData = {
      ...formData,
      name_tag: nameValid.value,
      color_tag: colorValid.value,
    };

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing
        ? `/api/tags/${formData.id_tag}`
        : '/api/tags';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData),
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
          ? prev.map(c => (c.id_tag === newTag.id_tag ? newTag : c))
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
      id_tag: tag.id_tag,
      name_tag: tag.name_tag,
      color_tag: tag.color_tag || '',
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
