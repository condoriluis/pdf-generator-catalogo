import { useState } from 'react';
import { toast } from 'sonner';
import { Product } from '@/lib/constants';
import { validateInput } from '@/lib/utils/inputValidation';

export function useProductForm(
  products: Product[],
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
) {
  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    id_product: 0,
    name_product: '',
    description_product: '',
    price_product: 0,
    stock_product: 0,
    isAvailable_product: false,
    image_product: '',
    id_category_product: 0,
    status_product: 0,
    id_tag_product: [] as string[],
    offerPrice_product: 0,
    hasOffer_product: false,
  });

  const resetForm = () => {
    setFormData({
      id_product: 0,
      name_product: '',
      description_product: '',
      price_product: 0,
      stock_product: 0,
      isAvailable_product: false,
      image_product: '',
      id_category_product: 0,
      status_product: 0,
      id_tag_product: [],
      offerPrice_product: 0,
      hasOffer_product: false,
    });
    setIsEditing(false);
    setFormOpen(false);
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    const { value: cleanValue, isValid } = validateInput(value);

    setFormData(prev => ({
      ...prev,
      [name]: ['price_product', 'stock_product', 'offerPrice_product'].includes(name)
        ? parseFloat(cleanValue) || 0
        : cleanValue,
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        if (!isValid) {
          newErrors[name] = 'Este carácter no está permitido';
        } else {
          delete newErrors[name];
        }
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
      const currentTags = [...prev.id_tag_product];
      if (currentTags.includes(tagId)) {
        if (currentTags.length === 1) {
          toast.error("Debe haber al menos una etiqueta seleccionada");
          return prev;
        }
        return { ...prev, id_tag_product: currentTags.filter((id) => id !== tagId) };
      } else {
        return { ...prev, id_tag_product: [...currentTags, tagId] };
      }
    });
  };

  const handleNew = () => {
    resetForm();
    setFormOpen(true);
  };

  const handleEdit = (product: Product) => {

    let tagIds: string[] = [];
    try {
      tagIds = JSON.parse(product.id_tag_product.toString());
    } catch (e) {
      console.error("Error parseando tags:", e);
    }
  
    setFormData({
      id_product: product.id_product,
      name_product: product.name_product,
      description_product: product.description_product,
      price_product: product.price_product,
      stock_product: product.stock_product,
      isAvailable_product: product.isAvailable_product || false,
      image_product: product.image_product || '',
      id_category_product: product.id_category_product,
      status_product: product.status_product,
      id_tag_product: tagIds,
      offerPrice_product: product.offerPrice_product,
      hasOffer_product: product.offerPrice_product > 0,

    });
    setIsEditing(true);
    setErrors({});
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameValid = validateInput(formData.name_product);
    const descValid = validateInput(formData.description_product);
    const newErrors: Record<string, string> = {};

    if (!nameValid.isValid || !nameValid.value.trim()) newErrors.name_product = 'El nombre es inválido';
    if (!descValid.isValid || !descValid.value.trim()) newErrors.description_product = 'La descripción es inválida';
    if (!formData.price_product) newErrors.price_product = 'El precio es requerido';
    if (!formData.isAvailable_product && !formData.stock_product) newErrors.stock_product = 'El stock es requerido';
    if (!formData.image_product.trim()) newErrors.image_product = 'La URL de la imagen es requerida';
    if (!formData.id_category_product) newErrors.id_category_product = 'La categoría es requerida';
    if (!formData.id_tag_product.length) newErrors.id_tag_product = 'Al menos una etiqueta es requerida';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/api/products/${formData.id_product}` : '/api/products';

      const payload = {
        ...formData,
        stock_product: formData.isAvailable_product ? 0 : formData.stock_product,
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
          ? prev.map(p => (p.id_product === newProduct.id_product ? newProduct : p))
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
