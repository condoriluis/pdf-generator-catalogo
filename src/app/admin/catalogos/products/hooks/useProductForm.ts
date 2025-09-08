import { useState } from 'react';
import { Product } from '@/lib/constants';
import { toast } from 'sonner';

export function useProductForm(
  products: Product[],
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
) {
  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    isAvailable: false,
    image: '',
    categoryId: '',
    status: 0,
    tags: [] as string[],
    offerPrice: 0,
    hasOffer: false,
  });

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      price: 0,
      stock: 0,
      isAvailable: false,
      image: '',
      categoryId: '',
      status: 0,
      tags: [],
      offerPrice: 0,
      hasOffer: false,
    });
    setIsEditing(false);
    setFormOpen(false);
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['price', 'stock', 'offerPrice'].includes(name) ? parseFloat(value) || 0 : value,
    }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleTagChange = (tagId: string) => {
    setFormData((prev) => {
      const currentTags = [...prev.tags];
      if (currentTags.includes(tagId)) {
        if (currentTags.length === 1) {
          toast.error("Debe haber al menos una etiqueta seleccionada");
          return prev;
        }
        return { ...prev, tags: currentTags.filter((id) => id !== tagId) };
      } else {
        return { ...prev, tags: [...currentTags, tagId] };
      }
    });
  };

  const handleNew = () => {
    resetForm();
    setFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      isAvailable: product.isAvailable,
      image: product.image || '',
      categoryId: product.categoryId,
      status: product.status,
      tags: product.tags || [],
      offerPrice: product.offerPrice,
      hasOffer: product.offerPrice > 0,

    });
    setIsEditing(true);
    setErrors({});
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (!formData.price) newErrors.price = 'El precio es requerido';
    if (!formData.isAvailable && !formData.stock) newErrors.stock = 'El stock es requerido';
    if (!formData.image.trim()) newErrors.image = 'La URL de la imagen es requerida';
    if (!formData.categoryId.trim()) newErrors.categoryId = 'La categoría es requerida';
    if (!formData.tags.length) newErrors.tags = 'Al menos una etiqueta es requerida';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/api/products/${formData.id}` : '/api/products';

      const payload = {
        ...formData,
        stock: formData.isAvailable ? 0 : formData.stock,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(isEditing ? 'Error al actualizar' : 'Error al crear');

      const newProduct = await res.json();

      toast.success(
        isEditing 
        ? 'Producto actualizado correctamente'
        : 'Producto creado correctamente'
      );
      
      setProducts(prev =>
        isEditing
          ? prev.map(p => (p.id === newProduct.id ? newProduct : p))
          : [newProduct, ...prev]
      );
      resetForm();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      toast.error(msg);
    }
  };

  return {
    formOpen,
    setFormOpen,
    isEditing,
    formData,
    errors,
    resetForm,
    handleChange,
    handleSelectChange,
    handleTagChange,
    handleNew,
    handleEdit,
    handleSubmit,
    setFormData,
  };
}
