"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNav } from "@/lib/admin-nav";
import { ChevronRight } from "lucide-react";
import { NavItem } from "@/components/layout/sidebar"

function findBreadcrumb(pathname: string) {
  const crumbs: { name: string; url: string }[] = [
    { name: "Admin", url: "/admin" },
  ];

  function traverse(items: NavItem[], path: string): boolean {
    for (const item of items) {
      if (path.startsWith(item.url)) {
        if (item.url !== "/admin") {
          crumbs.push({ name: item.name, url: item.url });
        }

        if (item.children && traverse(item.children, path)) {
          return true;
        }

        if (item.url === path) {
          return true;
        }
      }
    }
    return false;
  }

  traverse(adminNav, pathname);
  return crumbs;
}

export const Breadcrumbs: React.FC = () => {
  const pathname = usePathname();
  const crumbs = findBreadcrumb(pathname);

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground">
      {crumbs.map((crumb, idx) => (
        <span key={crumb.url} className="flex items-center gap-1">
          <Link
            href={crumb.url}
            className={`
              hover:text-foreground transition-colors
              ${idx === crumbs.length - 1 ? "font-semibold text-foreground" : ""}
            `}
          >
            {crumb.name}
          </Link>
          {idx < crumbs.length - 1 && (
            <ChevronRight className="h-4 w-4 opacity-50" />
          )}
        </span>
      ))}
    </nav>
  );
}
