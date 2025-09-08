import { NavItem } from "@/components/layout";
import { Home, Settings, Layers, LogOut } from "lucide-react";

export const adminNav: NavItem[] = [
  {
    name: "Admin",
    url: "/admin",
    icon: Home,
  },
  {
    name: "General",
    url: "/admin/general",
    icon: Settings,
    children: [
      { name: "Archivos", url: "/admin/general/archivos" },
      { name: "Ajustes", url: "/admin/general/settings" },
    ],
  },
  {
    name: "Catálogos",
    url: "/admin/catalogos",
    icon: Layers,
    children: [
      { name: "Categorías", url: "/admin/catalogos/categories" },
      { name: "Etiquetas", url: "/admin/catalogos/tags" },
      { name: "Productos", url: "/admin/catalogos/products" },
      { name: "Generar PDF", url: "/admin/catalogos/pdf" },
    ],
  },
  {
    name: "Salir",
    url: "/",
    icon: LogOut,
  },
];
