'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Category } from '@/lib/constants';
import {
  DataTable,
  Badge,
  Button,
  Label,
  Input,
  Textarea,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui';
import { useCategories } from './hooks/useCategories';
import { useCategoryForm } from './hooks/useCategoryForm';
import { useCategoryDelete } from './hooks/useCategoryDelete';

export default function CategoriesPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col items-start">
          <h1 className="text-4xl font-bold tracking-tight">Categorías</h1>
          <p className="text-muted-foreground text-lg">
            Categorías de la aplicación para generar catálogos en PDF
          </p>
        </div>
      </div>

      <div className="rounded-lg shadow-md border-1 dark:bg-neutral-900">
        <div className="p-4 space-y-4">
          <CategoriesManager />
        </div>
      </div>
    </div>
  );
}

function CategoriesManager() {
  const { categories, setCategories, loading } = useCategories();
  const {
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
  } = useCategoryForm(categories, setCategories);

  const {
    deleteDialogOpen,
    setDeleteDialogOpen,
    confirmDelete,
    handleDeleteConfirmed,
  } = useCategoryDelete(categories, setCategories);

  // Definición de columnas
  const columns: ColumnDef<Category>[] = [
    { accessorKey: 'id', header: '#', cell: ({ row }) => row.index + 1 },
    {
      accessorKey: 'name',
      header: 'Nombre de categoría',
      cell: ({ row }) => (
        <Badge variant="default" className="text-sm font-medium">
          {row.getValue('name')}
        </Badge>
      ),
    },
    { accessorKey: 'description', header: 'Descripción' },
    {
      accessorKey: 'createdAt',
      header: 'Fecha de Creación',
      cell: ({ row }) =>
        new Date(row.getValue('createdAt')).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row.original)}
          >
            <Edit className="h-4 w-4 text-blue-700" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => confirmDelete(row.original.id)}
          >
            <Trash2 className="h-4 w-4 text-red-700" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-medium">Datos de Categorías</h3>
        <Button onClick={handleNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Categoría
        </Button>
      </div>

      <DataTable columns={columns} data={categories} loading={loading} />

      {/* Modal Form */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Modifica los datos de la categoría'
                : 'Rellena los datos para crear una nueva categoría'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${
                  errors.name ? 'border-red-500' : ''
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${
                  errors.description ? 'border-red-500' : ''
                }`}
                rows={2}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Confirm Delete */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Eliminar Categoría</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar esta categoría? Esta acción
              no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteConfirmed}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
