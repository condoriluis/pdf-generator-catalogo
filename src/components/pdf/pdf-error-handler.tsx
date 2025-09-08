'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export const PDFErrorHandler = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const errorMessage = searchParams.get('message');

  useEffect(() => {
    if (error) {
      toast.error('Error al generar el PDF', {
        description: errorMessage || 'Ha ocurrido un problema al generar el documento.',
        duration: 5000,
      });
    }
  }, [error, errorMessage]);

  return null;
};