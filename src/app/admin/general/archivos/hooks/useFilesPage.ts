'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export type FileItem = {
  __originalName: string;
  id: number | string;
  name: string;
  extension: string;
  size: string;
  folder: string;
  id_mailchimp?: number;
  link: string;
  modified: string;
  preview: string;
  selected?: boolean;
  __originalFile?: File;
};

export function useFilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(15);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [folder, setFolder] = useState<'Server' | 'AWS S3' | 'Cloudinary' | 'Mailchimp'>('Server');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [, setChoosingFolder] = useState(false);
  const [, setUploadingProgress] = useState<Record<string, number>>({});
  const [isDragging, setIsDragging] = useState(false);

  const folderList = ['Server', 'AWS S3', 'Cloudinary', 'Mailchimp'];
  const [folderFilters, setFolderFilters] = useState<Record<string, boolean>>(
    Object.fromEntries(folderList.map(f => [f, true]))
  );

  useEffect(() => {
    const fetchFiles = async () => {
      try {

        const res = await fetch('/api/archivos');
        if (!res.ok) throw new Error('Error al obtener archivos');

        const data: FileItem[] = await res.json();

        const adapted = data.map((f: any) => ({
          id: f.id,
          name: f.name,
          __originalName: f.name,
          extension: '.' + f.extension,
          size: formatBytes(f.size),
          folder: f.name_folder,
          id_mailchimp: f.id_mailchimp,
          link: f.url,
          preview: f.url,
          modified: f.updatedAt,
        }));

        setFiles(adapted);

      } catch (err) {
        toast.error('No se pudieron cargar los archivos');
      }
    };

    fetchFiles();
  }, []);

  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(2) + ' MB';
  };  

  const combinedFiles: FileItem[] = [
    ...selectedFiles.map((file, i) => ({
      id: `selected-${i}`,
      name: file.name.replace(/\.[^/.]+$/, ''),
      extension: '.' + file.name.split('.').pop(),
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      folder: folder,
      link: '',
      preview: URL.createObjectURL(file),
      modified: new Date().toISOString(),
      selected: true,
      __originalName: file.name.replace(/\.[^/.]+$/, ''),
      __originalFile: file,
    })),
    ...files,
  ];

  const displayedFiles = combinedFiles
    .filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(search.toLowerCase());

      const safeFilter = filterBy ?? 'all';
      const extension = safeFilter.split('/')[1];
      const matchesFilter = safeFilter === 'all' ? true : (extension ? file.link.endsWith(extension) : true);
      
      const matchesFolder = selectedFiles.length === 0 ? folderFilters[file.folder] : true;
      
      return matchesSearch && matchesFilter && matchesFolder;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.modified).getTime() - new Date(a.modified).getTime();
        case 'oldest':
          return new Date(a.modified).getTime() - new Date(b.modified).getTime();
        case 'largest':
          return parseFloat(b.size.replace(' MB','')) - parseFloat(a.size.replace(' MB',''));
        case 'smallest':
          return parseFloat(a.size.replace(' MB','')) - parseFloat(b.size.replace(' MB',''));
        case 'a-z':
          return a.name.localeCompare(b.name);
        case 'z-a':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    })
    .slice(0, visibleCount);

  const handleCopy = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success('Link copiado al portapapeles');
  };

  const handleAddFiles = () => {
    document.getElementById('file-input')?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
  
    const filesArray = Array.from(e.target.files);
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
  
    const validFiles = filesArray.filter(file => allowedTypes.includes(file.type));
    const invalidFiles = filesArray.filter(file => !allowedTypes.includes(file.type));
  
    if (validFiles.length > 0) {
      setSelectedFiles(prev => {
        const combined = [...prev, ...validFiles];
        const uniqueFiles = combined.filter(
          (file, index, self) =>
            index === self.findIndex(f => f.name === file.name && f.size === file.size)
        );
        return uniqueFiles;
      });
  
      setChoosingFolder(true);
  
      const newProgress: Record<string, number> = {};
      validFiles.forEach(file => {
        newProgress[file.name] = 0;
      });
      setUploadingProgress(prev => ({ ...prev, ...newProgress }));
    } 
  
    if (invalidFiles.length > 0) {
      toast.error(`Formato no permitido: ${invalidFiles.map(f => f.name).join(', ')}`);
    }
  
    e.target.value = '';
  };  

  const handleUpload = async () => {
    if (!selectedFiles.length) return toast.error('Selecciona archivos primero');
    setUploading(true);

    const urls: string[] = [];

    try {
      for (const file of selectedFiles) {
        setUploadingProgress(prev => ({ ...prev, [file.name]: 0 }));

        const formData = new FormData();
        formData.append('file', file);

        const uploadFile = (endpoint: string): Promise<{ url: string; mailchimpId?: string }> => {
          return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', endpoint);

            xhr.upload.onprogress = (event) => {
              if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                setUploadingProgress(prev => ({ ...prev, [file.name]: percent }));
              }
            };

            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                const response = JSON.parse(xhr.responseText);

                if (folder === 'Mailchimp') {
                  const url = response.data?.full_size_url;
                  const mailchimpId = response.data?.id;
                  if (!url || !mailchimpId) reject('No se obtuvo URL o ID de Mailchimp');
                  resolve({ url, mailchimpId });
                } else {
                  resolve({ url: response.url });
                }
                
              } else {
                reject(Response.error || 'Upload failed');
              }
            };

            xhr.onerror = () => reject('Error de red');
            xhr.send(formData);
          });
        };

        const folderApiMap: Record<string, string> = {
          Server: 'server',
          'AWS S3': 's3',
          Cloudinary: 'cloudinary',
          Mailchimp: 'mailchimp',
        };
        
        const apiEndpoint = `/api/storage/${folderApiMap[folder]}`;
        
        const result = await uploadFile(
          folder === 'Mailchimp' ? '/api/storage/mailchimp' : apiEndpoint
        );
        
        urls.push(result.url);
        
        await fetch('/api/archivos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: file.name.replace(/\.[^/.]+$/, ''),
            extension: file.name.split('.').pop(),
            type: file.type,
            size: file.size,
            name_folder: folder,
            url: result.url,
            id_mailchimp: result.mailchimpId || '',
            updatedAt: new Date().toISOString(),
          }),
        });        

        setUploadingProgress(prev => ({ ...prev, [file.name]: 100 }));

      }

      toast.success('Archivos subidos correctamente');

      const newFiles: FileItem[] = selectedFiles.map((file, i) => ({
        id: files.length + i + 1,
        name: file.name.replace(/\.[^/.]+$/, ''),
        __originalName: file.name.replace(/\.[^/.]+$/, ''),
        extension: '.' + file.name.split('.').pop(),
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        folder,
        link: urls[i] || '',
        preview: urls[i] || '',
        modified: new Date().toISOString(),
      }));

      setFiles(prev => [...newFiles, ...prev]);
      setSelectedFiles([]);
      setChoosingFolder(false);
      setUploadingProgress({});
    } catch (err) {
      console.error(err);
      toast.error('Error al subir los archivos');
    }

    setUploading(false);
  };

  const handleDelete = async (file: FileItem) => {
    try {
      let endpoint = '';
      switch (file.folder) {
        case 'Server': endpoint = '/api/storage/server'; break;
        case 'AWS S3': endpoint = '/api/storage/s3'; break;
        case 'Cloudinary': endpoint = '/api/storage/cloudinary'; break;
        case 'Mailchimp': endpoint = '/api/storage/mailchimp'; break;
      }
  
      await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl: file.link, idMailchimp: file.id_mailchimp }),
      });

      await fetch(`/api/archivos`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: file.id }),
      });
  
      setFiles(prev => prev.filter(f => f.id !== file.id));
      toast.success('Archivo eliminado correctamente');

    } catch (err) {
      console.error(err);
      toast.error('Error eliminando archivo');
    }
  };
  
  return {
    // state
    files, search, visibleCount, selectedFiles, uploading, folder,
    filterBy, sortBy, isDragging, folderList, folderFilters,
    combinedFiles, displayedFiles,

    // setters
    setFiles, setSearch, setVisibleCount, setSelectedFiles, setFolder,
    setFilterBy, setSortBy, setIsDragging, setFolderFilters,

    // handlers
    handleCopy, handleAddFiles, handleFileChange, handleUpload, handleDelete,
  };
}
