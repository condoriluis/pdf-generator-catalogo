'use client';

import React, { useState } from 'react';
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ColumnDef } from '@tanstack/react-table';
import { PlusCircle, Edit, Trash2, ImageIcon, Info } from 'lucide-react';
import { Product } from '@/lib/constants';
import { SITE_URL } from '@/lib/constants/site';
import FilesPage from '../../general/archivos/page';
import {
  DataTable,
  Badge,
  Button,
  Label,
  Input,
  Textarea,
  Dialog,
  Checkbox,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/components/ui';
import { useProducts } from './hooks/useProducts';
import { useCategories } from '../categories/hooks/useCategories';
import { useTags } from '../tags/hooks/useTags';
import { useProductForm } from './hooks/useProductForm';
import { useProductDelete } from './hooks/useProductDelete';
import { toast } from 'sonner';

export default function ProductsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col items-start">
          <h1 className="text-4xl font-bold tracking-tight">Productos</h1>
          <p className="text-muted-foreground text-lg">
            Productos de la aplicación para generar catálogos en PDF
          </p>
        </div>
      </div>

      <div className="rounded-lg shadow-md border-1 dark:bg-neutral-900">
        <div className="p-4 space-y-4">
          <ProductsManager />
        </div>
      </div>
    </div>
  );
}

function ProductsManager() {
  const [filesDialogOpen, setFilesDialogOpen] = useState(false);

  const { products, setProducts, loading } = useProducts();
  const { categories } = useCategories();
  const { tags } = useTags();
  const productForm = useProductForm(products, setProducts);
  const productDelete = useProductDelete(products, setProducts);

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id_category === categoryId);
    return category ? category.name_category : 'Sin categoría';
  };

  const getTagNames = (tagIdsJson: string) => {
    if (!tagIdsJson) return [];
  
    let tagIds: number[] = [];
    try {
      tagIds = JSON.parse(tagIdsJson);
    } catch (e) {
      return [];
    }
  
    return tagIds
    .map(id => tags.find(t => t.id_tag === Number(id))?.name_tag)
    .filter(Boolean) as string[];

  };
  
  const columns: ColumnDef<Product>[] = [
    { accessorKey: 'id_product', header: '#', cell: ({ row }) => row.index + 1 },
    {
      accessorKey: 'image_product',
      header: 'Imagen',
      cell: ({ row }) => {
        const image = row.getValue('image_product') as string;
        const src = image && image.startsWith('assets/images/')
          ? `${SITE_URL}/${image}`
          : image || `${SITE_URL}/assets/images/image-default.jpg`;
        return <img src={src} alt={row.getValue('name_product') as string} className="w-12 h-12 rounded" />;
      },
    },
    { accessorKey: 'name_product', header: 'Nombre del producto', cell: ({ row }) => row.getValue('name_product') },
    {
      accessorKey: 'id_category_product',
      header: 'Categoría',
      cell: ({ row }) => <Badge variant="default" className="text-sm font-medium">{getCategoryName(row.getValue('id_category_product'))}</Badge>,
    },
    {
      accessorKey: 'price_product',
      header: 'Precio',
      cell: ({ row }) => {
        const price = row.getValue('price_product') as number;
        const offerPrice = (row.original as Product).offerPrice_product;
        if (offerPrice > 0) {
          return (
            <div className="flex items-center gap-2">
              <span className="line-through text-gray-500">
                {new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(price)}
              </span>
              <span className="text-green-600 font-medium text-sm">
                {new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(offerPrice)}
              </span>
            </div>
          );
        }
        return <span>{new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(price)}</span>;
      },
    },
    {
      accessorKey: 'stock_product',
      header: 'Stock',
      cell: ({ row }) => {
        const product = row.original as Product;
        return product.isAvailable_product
          ? <span className="text-green-600 font-medium">Disponible</span>
          : row.getValue('stock_product');
      }
    },
    {
      accessorKey: 'id_tag_product',
      header: 'Etiquetas',
      cell: ({ row }) => {
        const tagNames = getTagNames(row.getValue('id_tag_product') as string);
        return (
          <div className="flex flex-wrap gap-1">
            {tagNames.length > 0 ? (
              tagNames.map((name, idx) => {
                const tag = tags.find(t => t.name_tag === name);
                return (
                  <Badge
                    key={`${name}-${idx}`}
                    className="text-xs font-medium text-white"
                    style={{ backgroundColor: tag?.color_tag ?? '#888' }}
                  >
                    {name}
                  </Badge>
                );
              })
            ) : (
              <span className="text-muted-foreground text-xs">Sin tags</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status_product",
      header: "Estado",
      cell: ({ row }) => {
        const product = row.original as Product;
        const checked = product.status_product === 1;
        const handleToggle = async (newValue: boolean) => {
          try {
            const res = await fetch(`/api/products/${product.id_product}/status`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status_product: newValue ? 1 : 0 }),
            });
            if (!res.ok) throw new Error("Error al actualizar el estado");

            toast.success(`Producto ${newValue ? "activado" : "desactivado"} correctamente`)

            setProducts(prev =>
              prev.map(p => (p.id_product === product.id_product ? { ...p, status_product: newValue ? 1 : 0 } : p))
            );
            
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Error desconocido";
            toast.error(msg);
          }
        };
        return (
          <div className="flex items-center gap-2">
            <Switch checked={checked} onCheckedChange={handleToggle} />
            <span className={`text-sm font-medium ${checked ? "text-green-600" : "text-red-500"}`}>
              {checked ? "Activo" : "No activo"}
            </span>
          </div>
        );
      },
    },
    { accessorKey: 'date_created_product', header: 'Fecha de Creación', cell: ({ row }) => new Date(row.getValue('date_created_product')).toLocaleDateString() },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex">
          <Button variant="ghost" size="sm" onClick={() => productForm.handleEdit(row.original)}>
            <Edit className="h-4 w-4 text-blue-700" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => productDelete.confirmDelete(row.original.id_product.toString())}>
            <Trash2 className="h-4 w-4 text-red-700" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-medium">Datos de Productos</h3>
        <Button onClick={productForm.handleNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Producto
        </Button>
      </div>

      <DataTable columns={columns} data={products} loading={loading} />

      {/* Modal Form */}
      <Dialog open={productForm.formOpen} onOpenChange={productForm.setFormOpen}>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>{productForm.isEditing ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
            <DialogDescription>
              {productForm.isEditing ? 'Modifica los datos del producto' : 'Rellena los datos para crear un nuevo producto'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={productForm.handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name_product"
                value={productForm.formData.name_product}
                onChange={productForm.handleChange}
                className={`w-full p-2 border rounded-lg ${productForm.errors.name_product ? 'border-red-500' : ''}`}
              />
              {productForm.errors.name_product && <p className="text-red-500 text-sm mt-1">{productForm.errors.name_product}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description_product"
                value={productForm.formData.description_product}
                onChange={productForm.handleChange}
                className={productForm.errors.description_product ? 'border-red-500' : ''}
              />
              {productForm.errors.description_product && <p className="text-red-500 text-sm">{productForm.errors.description_product}</p>}
            </div>
            <div
              className={`grid gap-4 ${
                productForm.formData.hasOffer_product ? 'grid-cols-3' : 'grid-cols-2'
              }`}
            >
              {/* Precio Normal + Switch */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="price">Precio Normal</Label>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={productForm.formData.hasOffer_product}
                      onCheckedChange={(checked) =>
                        productForm.setFormData((prev) => ({
                          ...prev,
                          hasOffer_product: checked,
                          offerPrice_product: checked ? prev.offerPrice_product : 0,
                        }))
                      }
                    />
                    <span className="text-sm">Oferta</span>
                  </div>
                </div>
                <Input
                  id="price"
                  name="price_product"
                  type="number"
                  step="0.01"
                  min="0"
                  value={productForm.formData.price_product}
                  onChange={productForm.handleChange}
                  className={productForm.errors.price ? 'border-red-500' : ''}
                />
                {productForm.errors.price && <p className="text-red-500 text-sm mt-1">{productForm.errors.price}</p>}
              </div>

              {/* Precio de Oferta */}
              {productForm.formData.hasOffer_product && (
                <div className="space-y-3">
                  <Label htmlFor="offerPrice">Precio de Oferta</Label>
                  <Input
                    id="offerPrice"
                    name="offerPrice_product"
                    type="number"
                    min="0"
                    step="0.01"
                    value={productForm.formData.offerPrice_product}
                    onChange={(e) =>
                      productForm.setFormData((prev) => ({
                        ...prev,
                        offerPrice_product: parseFloat(e.target.value),
                      }))
                    }
                  />
                  {productForm.formData.offerPrice_product > 0 && productForm.formData.price_product > 0 && (
                    <p className="text-green-600 text-sm font-medium mt-1">
                      ¡Descuento:{' '}
                      {new Intl.NumberFormat('es-BO', {
                        style: 'currency',
                        currency: 'BOB',
                      }).format(productForm.formData.price_product - productForm.formData.offerPrice_product)}!
                    </p>
                  )}
                </div>
              )}

              {/* Stock con checkbox Disponible */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="stock">Stock</Label>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="isAvailable"
                      checked={productForm.formData.isAvailable_product}
                      onCheckedChange={(checked) =>
                        productForm.setFormData((prev) => ({
                          ...prev,
                          isAvailable_product: checked as boolean,
                          stock_product: checked ? 0 : prev.stock_product,
                        }))
                      }
                    />
                    <span className="text-sm">Disponible</span>
                  </div>
                </div>

                {!productForm.formData.isAvailable_product ? (
                  <>
                    <Input
                      id="stock"
                      name="stock_product"
                      type="number"
                      min="0"
                      value={productForm.formData.stock_product}
                      onChange={productForm.handleChange}
                      className={productForm.errors.stock_product ? 'border-red-500' : ''}
                    />
                    {productForm.errors.stock_product && (
                      <p className="text-red-500 text-sm">{productForm.errors.stock_product}</p>
                    )}
                  </>
                ) : (
                  <p className="text-green-600 text-sm font-medium">✔ Producto disponible</p>
                )}
              </div>

            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="categoryId">Categoría</Label>
                <Select 
                  onValueChange={(value) => productForm.handleSelectChange('id_category_product', value)}
                  value={productForm.formData.id_category_product.toString()}
                >
                  <SelectTrigger 
                    className={`w-full ${productForm.errors.id_category_product ? 'border-red-500' : ''}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Selecciona una categoría</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id_category} value={category.id_category.toString()}>
                        {category.name_category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {productForm.errors.id_category_product && <p className="text-red-500 text-sm">{productForm.errors.id_category_product}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="image">Imagen (URL)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="flex items-center text-xs text-blue-500 mt-1 cursor-help">
                          <Info className="w-4 h-4 mr-1" />
                          Recomendación
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Imagen en formato <b>JPG, JPEG, PNG</b></p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="flex items-center gap-1">
                  <Input
                    id="image"
                    name="image_product"
                    value={productForm.formData.image_product}
                    onChange={productForm.handleChange}
                    placeholder="https://example.com/image.png"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setFilesDialogOpen(true)}
                    className="cursor-pointer"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </Button>
                </div>
                {productForm.errors.image_product && <p className="text-red-500 text-sm">{productForm.errors.image_product}</p>}

                <Dialog open={filesDialogOpen} onOpenChange={setFilesDialogOpen}>
                  <DialogContent className="max-w-4xl h-[80vh] sm:max-w-[70%] overflow-y-auto p-0 pt-10">
                    <VisuallyHidden>
                      <DialogTitle>Seleccionar archivo</DialogTitle>
                    </VisuallyHidden>
                    <FilesPage
                      onSelect={(url) => {
                        productForm.setFormData((prev) => ({ ...prev, image_product: url }))
                        setFilesDialogOpen(false)
                      }}
                    />
                  </DialogContent>
                </Dialog>

              </div>

            </div>
            <div className="space-y-2">
              <Label className="block mb-1">Etiquetas</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <div key={tag.id_tag} className="flex items-center space-x-2">
                    <Checkbox
                      className="w-5 h-5"
                      checked={productForm.formData.id_tag_product.includes(tag.id_tag.toString())}
                      onCheckedChange={() => productForm.handleTagChange(tag.id_tag.toString())}
                      id={`tag-${tag.id_tag}`}
                    />
                    <Label htmlFor={`tag-${tag.id_tag}`}>{tag.name_tag}</Label>
                  </div>
                ))}
              </div>
              {productForm.errors.id_tag_product && <p className="text-red-500 text-sm">{productForm.errors.id_tag_product}</p>}
            </div>

            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={productForm.resetForm}>Cancelar</Button>
              <Button type="submit">{productForm.isEditing ? 'Actualizar' : 'Crear'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Confirm Delete */}
      <Dialog open={productDelete.deleteDialogOpen} onOpenChange={productDelete.setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Eliminar Producto</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={productDelete.handleDeleteConfirmed}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
