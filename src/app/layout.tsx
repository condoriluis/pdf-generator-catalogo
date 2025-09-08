import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import '@/styles/globals.css';
import { RootProvider } from '@/providers';
import { fontVariables } from '@/lib/fonts';
import { SITE_URL } from '@/lib/constants';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  title: {
    template: '%s | Catálogo de Productos',
    default: 'Catálogo de Productos',
  },
  description: 'Catálogo de Productos',
  creator: 'luis-cz',
  authors: [{ name: 'luis-cz', url: SITE_URL }],
  openGraph: {
    url: SITE_URL,
    type: 'website',
    title: 'Catálogo de Productos',
    description: 'Catálogo de Productos',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn(fontVariables, 'antialiased')}>
        <RootProvider>
          {children}
          <Analytics />
          <SpeedInsights />
        </RootProvider>
      </body>
    </html>
  );
}
