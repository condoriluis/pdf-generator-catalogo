export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  stock: number;
  isAvailable: boolean;
  categoryId: string;
  status: number;
  tags: string[];
  offerPrice: number;
  hasOffer?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Tag = {
  id: string;
  name: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type File = {
  id: string;
  name_folder: string;
  name: string;
  extension: string;
  type: string;
  size: number;
  url: string;
  id_mailchimp?: number;
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: string;
  name?: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface Watermark {
  enabled: boolean;
  text: string;
  color: string;
  opacity: number;
  size: number;
  rotation: number;
}

export type OrientationType = 'portrait' | 'landscape';

export interface Setting {
  id: string;
  logo_url: string;
  title: string;
  description: string;
  category_bg: string;
  orientation: OrientationType;
  template: 'grid' | 'list';
  watermark: Watermark;
  createdAt: Date;
  updatedAt: Date;
};

// Importar datos desde archivos JSON
import productsData from '@/../../data/products.json';
import categoriesData from '@/../../data/categories.json';
import tagsData from '@/../../data/tags.json';
import filesData from '@/../../data/files.json';
import usersData from '@/../../data/users.json';
import settingsData from '@/../../data/settings.json';

// Convertir fechas de string a Date
const parseDate = (dateStr: string) => new Date(dateStr);

// Procesar datos para asegurar que las fechas son objetos Date
const processProducts = () => {
  return productsData.map(product => ({
    ...product,
    createdAt: parseDate(product.createdAt as unknown as string),
    updatedAt: parseDate(product.updatedAt as unknown as string)
  }));
};

const processCategories = () => {
  return categoriesData.map(category => ({
    ...category,
    createdAt: parseDate(category.createdAt as unknown as string),
    updatedAt: parseDate(category.updatedAt as unknown as string)
  }));
};

const processTags = () => {
  return tagsData.map(tag => ({
    ...tag,
    createdAt: parseDate(tag.createdAt as unknown as string),
    updatedAt: parseDate(tag.updatedAt as unknown as string)
  }));
};

const processFiles = () => {
  return filesData.map(file => ({
    ...file,
    createdAt: parseDate(file.createdAt as unknown as string),
    updatedAt: parseDate(file.updatedAt as unknown as string)
  }));
};

const processUsers = () => {
  return usersData.map(user => ({
    ...user,
    createdAt: parseDate(user.createdAt as unknown as string),
    updatedAt: parseDate(user.updatedAt as unknown as string)
  }));
};

const processSettings = () => {
  return settingsData.map(setting => ({
    ...setting,
    createdAt: parseDate(setting.createdAt as unknown as string),
    updatedAt: parseDate(setting.updatedAt as unknown as string)
  }));
};

// Datos del catálogo
export const catalog = {
  products: processProducts(),
  categories: processCategories(),
  tags: processTags(),
  files: processFiles(),
  users: processUsers(),
  settings: processSettings()
};

export type Catalog = typeof catalog;