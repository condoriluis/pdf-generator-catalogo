'use client';

import { Copy, Trash, Search, Plus, Play } from 'lucide-react';
import { Button, Input, Badge, Checkbox, RadioGroup, RadioGroupItem, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui';
import { useFilesPage } from './hooks/useFilesPage';
import { toast } from 'sonner';

type FilesPageProps = {
  onSelect: (url: string) => void;
};

export default function FilesPage({ onSelect }: FilesPageProps) {
  
  const {
    search, setSearch,
    visibleCount, setVisibleCount,
    selectedFiles, uploading, folder, setFolder,
    filterBy, setFilterBy,
    sortBy, setSortBy,
    isDragging, setIsDragging,
    folderList, folderFilters, setFolderFilters,
    combinedFiles, displayedFiles,
    handleCopy, handleAddFiles, handleFileChange, handleUpload, handleDelete,
    setSelectedFiles, setFiles,
  } = useFilesPage();

  return (
    <>
      {!onSelect && (
      <div className="flex flex-col items-start">
        <h1 className="text-4xl font-bold tracking-tight">Archivos</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Archivos de la aplicación para generar catálogos en PDF
        </p>
      </div>
      )}

      <div className="rounded-lg shadow-md border-1 dark:bg-neutral-900">
        <div className="p-4 space-y-4">
  
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full md:w-1/2">
              <Input
                placeholder="Search Files"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" className="px-3 py-2">
                <Search className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                className="bg-green-600 hover:bg-green-700 dark:bg-green-50 dark:hover:bg-green-600 dark:hover:text-white"
                onClick={handleAddFiles}
              >
                <Plus className="w-4 h-4" /> Add Files
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-50 dark:hover:bg-blue-600 dark:hover:text-white"
                onClick={handleUpload}
                disabled={uploading || selectedFiles.length === 0}
              >
                <Play className="w-4 h-4" /> {uploading ? 'Subiendo...' : 'Start Up'}
              </Button>
            </div>
          </div>

          <input
            type="file"
            multiple
            accept="image/*"
            id="file-input"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center gap-4 flex-wrap">
              {selectedFiles.length > 0 ? (
                <RadioGroup
                value={folder}
                onValueChange={(value: 'Server' | 'AWS S3' | 'Cloudinary' | 'Mailchimp') =>
                  setFolder(value)
                }
                className="flex flex-wrap gap-2 sm:gap-4"
              >
                {folderList.map(f => (
                  <label
                    key={f}
                    className="flex items-center gap-1 w-1/2 sm:w-auto"
                  >
                    <RadioGroupItem value={f} className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">{f}</span>
                  </label>
                ))}
              </RadioGroup>
              
              ) : (
                folderList.map(f => (
                  <label key={f} className="flex items-center gap-1">
                    <Checkbox
                      checked={folderFilters[f]}
                      onCheckedChange={(checked) =>
                        setFolderFilters(prev => ({ ...prev, [f]: checked as boolean }))
                      }
                      className="w-5 h-5"
                    />
                    <span className="text-sm">{f}</span>
                  </label>
                ))
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                className="border rounded px-2 py-1 text-sm dark:bg-neutral-800 dark:border-gray-600"
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
              >
                <option value="all">All</option>
                <option value="image/png">PNG</option>
                <option value="image/jpg">JPG</option>
                <option value="image/jpeg">JPEG</option>
                <option value="image/webp">WEBP</option>
              </select>

              <select
                className="border rounded px-2 py-1 text-sm dark:bg-neutral-800 dark:border-gray-600"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              > 
                <option value="newest">Sort By</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="largest">Largest First</option>
                <option value="smallest">Smallest First</option>
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
              </select>
            </div>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-10 text-center ${
              isDragging ? 'border-blue-500 bg-blue-500 hover:border-blue-400 hover:bg-blue-50 dark:hover:border-blue-400 dark:hover:bg-blue-900' : 'border-gray-300 bg-white dark:bg-neutral-900'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const files = Array.from(e.dataTransfer.files);
              const fakeEvent = { target: { files } } as unknown as React.ChangeEvent<HTMLInputElement>;
              handleFileChange(fakeEvent);
            }}
          >
            <span className={`text-gray-600 dark:text-gray-300 text-lg font-medium`}>
              {isDragging ? '¡Suelte los archivos para subir!' : 'Arrastre los archivos aquí'}
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border-1 bg-white dark:bg-neutral-900">
            <table className="min-w-full table-auto border-collapse">
              <thead className="border-b">
                <tr>
                  <th className="px-4 py-2 text-left">Preview</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Size</th>
                  <th className="px-4 py-2 text-left">Folder</th>
                  <th className="px-4 py-2 text-left">Link</th>
                  <th className="px-4 py-2 text-left">Modified</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedFiles.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500 italic">
                      No hay archivos disponibles en este momento.
                    </td>
                  </tr>
                ) : (
                  displayedFiles.map((file) => (
                  <tr key={file.id}>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-lg border border-gray-200 dark:border-neutral-700 shadow-sm"
                          />
                        </div>
                        
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-1 gap-1 min-w-0">
                        <Input
                          type="text"
                          value={file.name}
                          readOnly={file.selected && !file.link}
                          onChange={(e) => {
                            const newName = e.target.value;
                            setFiles((prev) =>
                              prev.map((f) => (f.id === file.id ? { ...f, name: newName } : f))
                            );
                          }}
                          onBlur={async (e) => {
                            const newName = e.target.value.trim();
                            if (file.link && newName && newName !== file.__originalName) {
                              try {
                                const res = await fetch('/api/archivos', {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ id: file.id, name: newName }),
                                });

                                if (!res.ok) throw new Error('Error actualizando nombre');

                                setFiles(prev =>
                                  prev.map(f => f.id === file.id ? { ...f, __originalName: newName } : f)
                                );

                                toast.success('Nombre actualizado correctamente');
                              } catch (err) {
                                console.error(err);
                                toast.error('No se pudo actualizar el nombre');
                              }
                            }
                          }}
                          className="flex-1 min-w-0 text-sm md:text-base truncate"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-shrink-0 px-2 py-1 text-gray-400 font-bold text-sm md:text-base"
                        >
                          {file.extension}
                        </Button>
                      </div>
                    </td>

                    <td className="px-4 py-2">{file.size}</td>
                    <td className="px-4 py-2"><Badge>{file.folder}</Badge></td>

                    <td className="px-4 py-2">
                      {file.selected && !file.link ? (
                        uploading ? (
                          <span className="text-blue-600 font-semibold animate-pulse flex items-center gap-1">
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3h-4z"
                              ></path>
                            </svg>
                            Subiendo archivo...
                          </span>
                        ) : (
                          <span className="text-gray-500 italic font-medium">Listo para subir</span>
                        )
                      ) : file.link ? (
                        <a
                          href={file.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline truncate max-w-[200px] block"
                          title={file.link}
                        >
                          {file.link.length > 30 ? file.link.slice(0, 30) + "..." : file.link}
                        </a>
                      ) : null}
                    </td>

                    <td className="px-4 py-2">
                      {new Date(file.modified).toLocaleString('sv-SE', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                      }).replace('T', ' ')}
                    </td>

                    <td className="px-2 py-4 flex">

                      {file.selected && !file.link ? (
                        <Button
                          variant="default"
                          onClick={() => {
                            setSelectedFiles(prev =>
                              prev.filter(f => f !== file.__originalFile)
                            );
                          }}
                        >
                          <span>X Clear</span>
                        </Button>
                      ) : onSelect ? (
                        <Button
                          variant="outline"
                          onClick={() => onSelect(file.link)}
                        >
                          Usar
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="icon"
                            onClick={() => handleCopy(file.link)}
                            className="mr-2 cursor-pointer"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="icon" variant="destructive">
                                <Trash className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>¿Eliminar archivo?</DialogTitle>
                                <DialogDescription>
                                  Esta acción eliminará el archivo de {file.folder} y no se podrá recuperar.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Cancelar</Button>
                                </DialogClose>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleDelete(file)}
                                >
                                  Eliminar
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                    </td>

                  </tr>
                ))
              )}
              </tbody>

            </table>
          </div>

          {visibleCount < combinedFiles.length && (
            <div className="flex justify-center mt-4">
              <Button
                onClick={() => setVisibleCount(visibleCount + 15)}
                className="bg-gray-200 hover:bg-gray-300 text-black dark:bg-gray-700 dark:text-white"
              >
                Mostrar más archivos
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}