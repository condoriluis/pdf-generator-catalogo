'use client';

import { DocsSidebar, NavItem, Breadcrumbs, Footer } from '@/components/layout';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui';
import { adminNav } from '@/lib/admin-nav';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DocsSidebar items={adminNav as NavItem[]} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Breadcrumbs />
          </div>
        </header>
        <main className="container pb-4">{children}</main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
