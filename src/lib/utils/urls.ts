export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '';
  if (process.env.NEXT_PUBLIC_SITE_URL) return `https://${process.env.NEXT_PUBLIC_SITE_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};
