'use client';

import React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui';
import { FileDown } from 'lucide-react';

type GeneratePDFButtonProps = {
  preview?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export const GeneratePDFButton = ({
  preview = false,
  className = '',
  children,
}: GeneratePDFButtonProps) => {
  const handleClick = () => {
    const action = preview ? 'previsualizar' : 'descargar';
    toast.info(`Preparando PDF para ${action}...`, {
      description: 'El proceso puede tardar unos segundos.',
    });
    
    setTimeout(() => {
      toast.success(`PDF listo para ${action}`, {
        description: preview
          ? 'Se ha abierto en una nueva pestaña.'
          : 'La descarga comenzará automáticamente.',
      });
    }, 2000);
  };

  const defaultClassName = preview
    ? 'bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded transition duration-200'
    : 'bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-200';

  return (
    <Button asChild className={className || defaultClassName}>
      <Link
        href={`/generate${preview ? '?preview=true' : ''}`}
        target="_blank"
        onClick={handleClick}
      >
        <FileDown className="h-4 w-4" />
        {children || 'Abrir PDF'}
      </Link>
    </Button>
  );
};