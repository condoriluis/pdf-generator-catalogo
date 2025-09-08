'use server';
import fs from 'fs';
import path from 'path';
import { Product, Category, Tag, File, User, Setting } from '@/lib/constants/catalog';

const dataDir = path.join(process.cwd(), 'data');

// Funciones genéricas para manejar datos
export async function readData<T>(filename: string): Promise<T[]> {
  const filePath = path.join(dataDir, filename);
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data) as T[];
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

export async function writeData<T>(filename: string, data: T[]): Promise<boolean> {
  const filePath = path.join(dataDir, filename);
  try {
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}

// Funciones específicas para productos
export async function getProducts(): Promise<Product[]> {
  return readData<Product>('products.json');
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find(product => product.id === id) || null;
}

export async function createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  const products = await getProducts();
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  await writeData('products.json', [...products, newProduct]);
  return newProduct;
}

export async function updateProduct(id: string, productData: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Product | null> {
  const products = await getProducts();
  const index = products.findIndex(product => product.id === id);
  
  if (index === -1) return null;
  
  const updatedProduct: Product = {
    ...products[index]!,
    ...productData,
    updatedAt: new Date()
  };
  
  products[index] = updatedProduct;
  await writeData('products.json', products);
  return updatedProduct;
}

export async function updateProductStatus(id: string, productData: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Product | null> {
  const products = await getProducts();
  const index = products.findIndex(product => product.id === id);
  
  if (index === -1) return null;
  
  const updatedProduct: Product = {
    ...products[index]!,
    ...productData,
    updatedAt: new Date()
  };
  
  products[index] = updatedProduct;
  await writeData('products.json', products);
  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await getProducts();
  const filteredProducts = products.filter(product => product.id !== id);
  
  if (filteredProducts.length === products.length) return false;
  
  return writeData('products.json', filteredProducts);
}

// Funciones específicas para categorías
export async function getCategories(): Promise<Category[]> {
  return readData<Category>('categories.json');
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find(category => category.id === id) || null;
}

export async function createCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
  const categories = await getCategories();
  const newCategory: Category = {
    ...category,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  await writeData('categories.json', [...categories, newCategory]);
  return newCategory;
}

export async function updateCategory(id: string, categoryData: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Category | null> {
  const categories = await getCategories();
  const index = categories.findIndex(category => category.id === id);
  
  if (index === -1) return null;
  
  const updatedCategory: Category = {
    ...categories[index]!,
    ...categoryData,
    updatedAt: new Date()
  };
  
  categories[index] = updatedCategory;
  await writeData('categories.json', categories);
  return updatedCategory;
}

export async function deleteCategory(id: string): Promise<{ success: boolean; linkedProducts?: string[] }> {
  const categories = await getCategories();
  const category = categories.find(c => c.id === id);

  if (!category) return { success: false };

  const products = await getProducts();
  const linkedProducts = products.filter(p => p.categoryId === id);

  if (linkedProducts.length > 0) {
    return { success: false, linkedProducts: linkedProducts.map(p => p.name) };
  }

  const filteredCategories = categories.filter(c => c.id !== id);
  const writeSuccess = await writeData('categories.json', filteredCategories);

  return { success: writeSuccess };
}

// Funciones específicas para tags
export async function getTags(): Promise<Tag[]> {
  return readData<Tag>('tags.json');
}

export async function getTagById(id: string): Promise<Tag | null> {
  const tags = await getTags();
  return tags.find(tag => tag.id === id) || null;
}

export async function createTag(tag: Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tag> {
  const tags = await getTags();
  const newTag: Tag = {
    ...tag,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  await writeData('tags.json', [...tags, newTag]);
  return newTag;
}

export async function updateTag(id: string, tagData: Partial<Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Tag | null> {
  const tags = await getTags();
  const index = tags.findIndex(tag => tag.id === id);
  
  if (index === -1) return null;
  
  const updatedTag: Tag = {
    ...tags[index]!,
    ...tagData,
    updatedAt: new Date()
  };
  
  tags[index] = updatedTag;
  await writeData('tags.json', tags);
  return updatedTag;
}

export async function deleteTag(id: string): Promise<boolean> {
  const tags = await getTags();
  const filteredTags = tags.filter(tag => tag.id !== id);
  
  if (filteredTags.length === tags.length) return false;
  
  return writeData('tags.json', filteredTags);
}

// Funciones específicas para archivos
export async function getFiles(): Promise<File[]> {
  return readData<File>('files.json');
}

export async function getFileById(id: string): Promise<File | null> {
  const files = await getFiles();
  return files.find(file => file.id === id) || null;
}

export async function createFile(file: Omit<File, 'id' | 'createdAt' | 'updatedAt'>): Promise<File> {
  const files = await getFiles();
  const newFile: File = {
    ...file,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  await writeData('files.json', [...files, newFile]);
  return newFile;
}

export async function updateFileName(id: string, newName: string): Promise<File | null> {
  const files = await getFiles();
  const index = files.findIndex(file => file.id === id);

  if (index === -1) return null;

  const updatedFile: File = {
    ...files[index]!,
    name: newName,
    updatedAt: new Date(),
  };

  files[index] = updatedFile;
  await writeData('files.json', files);

  return updatedFile;
}

export async function deleteFile(id: string): Promise<boolean> {
  const files = await getFiles();
  const filteredFiles = files.filter(file => file.id !== id);
  
  if (filteredFiles.length === files.length) return false;
  
  return writeData('files.json', filteredFiles);
}

// Funciones específicas para usuarios
export async function getUsers(): Promise<User[]> {
  return readData<User>('users.json');
}

// Funciones específicas para settings
export async function getSettings(): Promise<Setting[]> {
  return readData<Setting>('settings.json');
}

export async function updateSetting(
  id: string,
  tagData: Partial<Omit<Setting, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Setting | null> {
  const settings = await getSettings();
  const index = settings.findIndex(setting => setting.id === id);
  if (index === -1) return null;

  const updatedSetting: Setting = {
    ...settings[index]!,
    ...tagData,
    updatedAt: new Date(),
  };

  settings[index] = updatedSetting;
  await writeData('settings.json', settings);
  return updatedSetting;
}
