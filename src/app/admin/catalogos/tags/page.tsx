'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Tag } from '@/lib/constants';
import {
  DataTable,
  Badge,
  Button,
  Label,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui';
import { useTags } from './hooks/useTags';
import { useTagForm } from './hooks/useTagForm';
import { useTagDelete } from './hooks/useTagDelete';

export default function TagsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col items-start">
          <h1 className="text-4xl font-bold tracking-tight">Etiquetas</h1>
          <p className="text-muted-foreground text-lg">
            Etiquetas de la aplicación para generar catálogos en PDF
          </p>
        </div>
      </div>

      <div className="rounded-lg shadow-md border-1 dark:bg-neutral-900">
        <div className="p-4 space-y-4">
          <TagsManager />
        </div>
      </div>
    </div>
  );
}

function TagsManager() {
  const { tags, setTags, loading } = useTags();
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
  } = useTagForm(tags, setTags);

  const {
    deleteDialogOpen,
    setDeleteDialogOpen,
    confirmDelete,
    handleDeleteConfirmed,
  } = useTagDelete(tags, setTags);

  // Definición de columnas
  const columns: ColumnDef<Tag>[] = [
    { accessorKey: 'id_tag', header: '#', cell: ({ row }) => row.index + 1 },
    { 
      accessorKey: 'name_tag', 
      header: 'Nombre de la etiqueta',
      cell: ({ row }) => (
        <Badge className="text-sm font-medium dark:text-gray-200" style={{ backgroundColor: row.getValue('color_tag') }}>{row.getValue('name_tag')}</Badge>
      ),
    },
    { 
      accessorKey: 'color_tag', 
      header: 'Color',
      cell: ({ row }) => (
        <div className="flex items-center">
          <div 
            className="h-4 w-4 rounded-full mr-2" 
            style={{ backgroundColor: row.getValue('color_tag') }}
          />
          <span className="text-sm text-gray-500">{row.getValue('color_tag')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'date_created_tag',
      header: 'Fecha de Creación',
      cell: ({ row }) =>
        new Date(row.getValue('date_created_tag')).toLocaleDateString(),
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
            onClick={() => confirmDelete(row.original.id_tag)}
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
        <h3 className="text-lg font-medium">Datos de Etiquetas</h3>
        <Button onClick={handleNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Etiqueta
        </Button>
      </div>

      <DataTable columns={columns} data={tags} loading={loading} />

      {/* Modal Form */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Editar Etiqueta' : 'Nueva Etiqueta'}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Modifica los datos de la etiqueta'
                : 'Rellena los datos para crear una nueva etiqueta'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                type="text"
                name="name_tag"
                value={formData.name_tag}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${
                  errors.name_tag ? 'border-red-500' : ''
                }`}
              />
              {errors.name_tag && (
                <p className="text-red-500 text-sm mt-1">{errors.name_tag}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="color"
                  name="color_tag"
                  type="color"
                  value={formData.color_tag}
                  onChange={handleChange}
                  className={`w-16 h-10 p-1 ${errors.color_tag ? 'border-red-500' : ''}`}
                />
                <Input
                  name="color_tag"
                  value={formData.color_tag}
                  onChange={handleChange}
                  className={`flex-1 ${errors.color_tag ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.color_tag && <p className="text-red-500 text-sm mt-1">{errors.color_tag}</p>}
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
            <DialogTitle>Eliminar Etiqueta</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar esta etiqueta? Esta acción
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
