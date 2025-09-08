"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from "recharts";

interface Product {
  id: number;
  name: string;
  categoryId: number;
  tags: number[];
  price: number;
  offerPrice: number;
  stock: number;
  isAvailable: boolean;
  image?: string;
  description?: string;
}

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
  color?: string;
}

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<any[]>([]);
  const [productsByTag, setProductsByTag] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProducts, resCategories, resTags] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
          fetch("/api/tags"),
        ]);

        const [dataProducts, dataCategories, dataTags] = await Promise.all([
          resProducts.json(),
          resCategories.json(),
          resTags.json(),
        ]);

        setProducts(dataProducts);
        setCategories(dataCategories);
        setTags(dataTags);

        const groupCategory = dataCategories
        .map((cat: Category) => ({
          name: cat.name,
          value: dataProducts.filter((p: Product) => p.categoryId === cat.id).length,
        }))
        .filter((item: any) => item.value > 0)
        .sort((a: any, b: any) => b.value - a.value)
        .slice(0, 10);
        setProductsByCategory(groupCategory);

        const groupTag = dataTags
        .map((tag: Tag) => ({
          name: tag.name,
          value: dataProducts.filter((p: Product) => p.tags.includes(tag.id)).length,
        }))
        .filter((item: any) => item.value > 0)
        .sort((a: any, b: any) => b.value - a.value)
        .slice(0, 10);
        setProductsByTag(groupTag);


      } catch (err) {
        console.error("Error cargando datos del dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
    <div className="flex flex-col items-start">
      <h1 className="text-4xl font-bold tracking-tight">Dashboard Administración</h1>
      <p className="text-muted-foreground mb-8 text-lg">Bienvenido al dashboard de administración donde puedes visualizar totales y gráficos</p>
    </div>
    <div className="space-y-8">

      {/* Cards resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="text-white border-1 shadow-lg rounded-xl p-6 bg-blue-500">
          <h2 className="text-lg font-semibold">Total Productos</h2>
          <p className="text-3xl font-bold mt-2">{products.length}</p>
        </div>

        <div className="text-white border-1 shadow-lg rounded-xl p-6 bg-green-500">
          <h2 className="text-lg font-semibold">Total Categorías</h2>
          <p className="text-3xl font-bold mt-2">{categories.length}</p>
        </div>

        <div className="text-white border-1 shadow-lg rounded-xl p-6 bg-purple-500">
          <h2 className="text-lg font-semibold">Total Etiquetas</h2>
          <p className="text-3xl font-bold mt-2">{tags.length}</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white dark:bg-neutral-900 border-1 rounded-2xl p-6 flex flex-col h-96">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200 drop-shadow-sm">
            Total de Productos por Categoría
          </h2>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productsByCategory}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={40}
                  outerRadius={100}
                  paddingAngle={3}
                  cornerRadius={10}
                  label={({ name, percent }) =>
                    `${name}: ${(percent! * 100).toFixed(0)}%`
                  }
                >
                  {productsByCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f9fafb",
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border-1 rounded-2xl p-6 flex flex-col h-96">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200 drop-shadow-sm">
            Total de Productos por Etiqueta
          </h2>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productsByTag}
                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                barCategoryGap="20%"
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#4B5563" }}
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 12, fill: "#4B5563" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f9fafb",
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12, fontWeight: 600, color: "#4B5563" }}
                />
                <Bar
                  dataKey="value"
                  radius={[6, 6, 0, 0]}
                  fill="#0EA5E9"
                  barSize={30}
                  background={{ fill: "#E0F2FE" }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Últimos productos */}
      <div className="bg-white dark:bg-neutral-900 border-1 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200">Últimos Productos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.slice(-4).reverse().map((p) => {
            const category = categories.find(c => c.id === p.categoryId);
            const productTags = p.tags.map(tagId => tags.find(t => t.id === tagId)).filter(Boolean);

            return (
              <div
                key={p.id}
                className="flex flex-col md:flex-row border rounded-2xl p-4 hover:shadow-md transition-transform duration-300 transform hover:-translate-y-1 hover:scale-[1.02] bg-white dark:bg-neutral-900"
              >
                {p.image && (
                  <div className="w-full md:w-36 h-28 md:h-28 overflow-hidden rounded-xl flex-shrink-0 mb-3 md:mb-0 md:mr-4">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                )}

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{p.name}</h3>
                    
                    {p.description && (
                      <p className="text-gray-500 text-sm mt-1">
                        {p.description.length > 60 ? p.description.slice(0, 60) + "..." : p.description}
                      </p>
                    )}

                  </div>
        
                  <div className="flex items-baseline justify-between flex-wrap gap-2 mb-3">
                    {p.offerPrice && Number(p.offerPrice) > 0 ? (
                      <>
                        <span className="text-gray-500 line-through text-sm">
                          Antes: {new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(Number(p.price))}
                        </span>
                        <span className="text-green-600 font-bold text-lg">
                          Oferta: {new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(Number(p.offerPrice))}
                        </span>
                      </>
                    ) : (
                      <span className="text-green-600 font-bold text-lg">
                        {new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(Number(p.price))}
                      </span>
                    )}

                    {p.isAvailable ? (
                      <p className="text-gray-400 text-sm">Stock: <span className="text-green-600 text-sm">Disponible</span></p>
                    ) : (
                      <p className="text-gray-400 text-sm">Stock: {p.stock} unidades</p>
                    )}
                    
                  </div>

                  <div>
                    {category && (
                      <span className="inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full bg-blue-500 text-white">
                        Categoría: {category.name}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {productTags.map(tag => (
                      <span
                        key={tag!.id}
                        className="px-2 py-1 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor: tag!.color || "#e0f2f1",
                          color: tag!.color ? "#fff" : "#000"
                        }}
                      >
                        {tag!.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
    </>
  );
};

export default AdminDashboard;
