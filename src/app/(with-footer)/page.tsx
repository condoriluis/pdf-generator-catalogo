'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Settings, ChevronDown, Search, Trash2 } from 'lucide-react';
import { AnimatedHomeCard } from '@/components/about';
import { Button } from '@/components/ui';
import { Category, Product, Tag } from '@/lib/constants';

export default function Home() {
  const [showAll, setShowAll] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard');
        if (!res.ok) throw new Error('Error cargando datos del dashboard');
        const data = await res.json();
        setProducts(data.products);
        setCategories(data.categories);
        setTags(data.tags);
      } catch (error) {
        console.error('Error al traer datos del dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeProducts = products
    .filter((product) => product.status_product === 1)
    .sort((a, b) => {
      const dateA = a.date_created_product ? new Date(a.date_created_product).getTime() : 0;
      const dateB = b.date_created_product ? new Date(b.date_created_product).getTime() : 0;
      return dateB - dateA;
    });
  
  const activeCategoryIds = new Set(
    products
      .filter((p) => p.status_product === 1)
      .map((p) => p.id_category_product)
  );

  const filteredCategories = categories.filter((cat) =>
    activeCategoryIds.has(cat.id_category)
  );

  // Filtro por categoría y búsqueda
  const filteredProducts = activeProducts.filter((p) => {
    const matchCategory = selectedCategory
      ? p.id_category_product === Number(selectedCategory)
      : true;
  
    const matchSearch =
      search === '' ||
      p.name_product.toLowerCase().includes(search.toLowerCase()) ||
      p.description_product.toLowerCase().includes(search.toLowerCase());
  
    const matchTag =
      selectedTag === '' ||
      (p.id_tag_product &&
        JSON.parse(p.id_tag_product.toString()).includes(selectedTag));
  
    return matchCategory && matchSearch && matchTag;
  });
  
  const productsToShow = showAll ? filteredProducts : filteredProducts.slice(0, 6);

  return (
    <>
      <div className="bg-mesh-gradient-lcz fixed -z-10 min-h-screen w-full overflow-hidden" />

      <main className="container mx-auto py-6 space-y-6">
        {/* Hero */}
        <section className="relative flex flex-col items-center justify-center text-center w-full
          min-h-[50vh] sm:min-h-[55vh] md:min-h-[60vh] lg:min-h-[55vh]
          max-h-[500px]
          px-4 sm:px-6 md:px-12 rounded-3xl shadow-lg
          bg-[url('/assets/images/catalogo-hero.jpeg')] bg-cover bg-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 via-gray-800/40 to-gray-700/60 rounded-3xl shadow-inner"></div>

          <div className="relative z-10 flex flex-col items-center justify-center text-center px-2 sm:px-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white drop-shadow-lg">
              Catálogo Profesional de Productos
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mb-6 text-white drop-shadow-md">
              Gestiona fácilmente tus <strong>productos, categorías y etiquetas</strong> en nuestro sistema intuitivo,
              y genera automáticamente un <strong>catálogo PDF profesional</strong>.
            </p>
            <Button asChild className="bg-gray-800 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-full shadow-md hover:shadow-xl hover:bg-gray-900 transition duration-300 flex items-center gap-2 transform hover:-translate-y-0.5 hover:scale-105">
              <Link href="/admin" className="flex items-center gap-2">
                <Settings className="w-4 sm:w-5 h-4 sm:h-5" />
                Acceder al Panel Admin
              </Link>
            </Button>
          </div>
        </section>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 sm:gap-6 w-full px-4 sm:px-0">
          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 w-full sm:w-auto">

            {/* Filtro de Categorías */}
            <div className="relative w-full sm:w-56">
              <select
                className="
                  block w-full rounded-2xl border border-gray-300 bg-white/80 backdrop-blur-md
                  px-5 py-3 pr-10 text-sm font-medium text-gray-700 shadow-lg
                  hover:shadow-xl transition-shadow duration-300 ease-in-out
                  focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none
                "
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {filteredCategories.map((cat) => (
                  <option key={cat.id_category} value={cat.id_category}>
                    {cat.name_category}
                  </option>
                ))}
              </select>
            
            </div>

            {/* Filtro de Tags */}
            <div className="relative w-full sm:w-56">
              <select
                className="
                  block w-full rounded-2xl border border-gray-300 bg-white/80 backdrop-blur-md
                  px-5 py-3 pr-10 text-sm font-medium text-gray-700 shadow-lg
                  hover:shadow-xl transition-shadow duration-300 ease-in-out
                  focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none
                "
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                <option value="">Todas las etiquetas</option>
                {tags.map((tag) => (
                  <option key={tag.id_tag} value={tag.id_tag}>
                    {tag.name_tag}
                  </option>
                ))}
              </select>
              
            </div>

            {/* Input de búsqueda */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  block w-full rounded-2xl border border-gray-300 bg-white/80 backdrop-blur-md
                  px-5 py-3 pr-12 text-sm font-medium text-gray-700 shadow-lg
                  hover:shadow-xl transition-shadow duration-300 ease-in-out
                  placeholder-gray-400
                  focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none
                "
              />
              <Search
                size={20}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            {/* Botón de limpiar filtros */}
            <button
              onClick={() => { setSelectedCategory(''); setSelectedTag(''); setSearch(''); }}
              className="
                flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-500 text-white
                hover:bg-gray-600 transition-colors duration-300 shadow-md hover:shadow-lg
                text-sm font-medium
              "
            >
              <Trash2 size={18} /> Limpiar
            </button>
          </div>
        </div>

        {/* Productos */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {productsToShow.map((product, index) => {
            const category = categories.find((c) => c.id_category === product.id_category_product);
            const productTags = product.id_tag_product
              ? JSON.parse(product.id_tag_product.toString())
                  .map((tagId: string) => tags.find((t) => t.id_tag.toString() === tagId))
                  .filter(Boolean)
              : [];

            return (
              <AnimatedHomeCard
                overrideClassName
                key={product.id_product}
                delay={index * 0.1 + 0.2}
                className="flex flex-col rounded-xl shadow-md hover:shadow-xl transition-shadow duration-500 overflow-hidden bg-white transform hover:-translate-y-1 hover:scale-105 transition-transform duration-500"
              >
                {product.image_product && (
                  <div className="h-56 overflow-hidden relative">
                    <img
                      src={product.image_product}
                      alt={product.name_product}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity text-white font-medium text-sm cursor-pointer"
                    >
                      Ver detalle
                    </button>
                  </div>
                )}

                <div className="p-5 flex flex-col flex-1">
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2 hover:text-teal-600 transition-colors duration-300">
                    {product.name_product}
                  </h2>

                  <div className="flex items-baseline gap-2 mb-3">
                    {product.offerPrice_product && Number(product.offerPrice_product) > 0 ? (
                      <>
                        <span className="text-gray-500 line-through text-sm">
                          Antes:{' '}
                          {new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(
                            Number(product.price_product)
                          )}
                        </span>
                        <span className="text-green-600 font-bold text-lg">
                          Ahora:{' '}
                          {new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(
                            Number(product.offerPrice_product)
                          )}
                        </span>
                      </>
                    ) : (
                      <span className="text-green-600 font-bold text-lg">
                        {new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(
                          Number(product.price_product)
                        )}
                      </span>
                    )}
                  </div>

                  {category && (
                    <div
                      className="inline-block px-3 py-1 mb-3 text-sm font-medium text-white rounded-full"
                      style={{ backgroundColor: '#0ea5e9' }}
                    >
                      Categoría: {category.name_category}
                    </div>
                  )}

                  <p className="text-gray-700 mb-4 flex-1 text-sm md:text-base">
                    {product.description_product.length > 100
                      ? product.description_product.slice(0, 100) + '...'
                      : product.description_product}
                  </p>

                  <div className="flex justify-between items-center mt-auto flex-wrap gap-2">
                    {product.isAvailable_product ? (
                      <p className="text-gray-500 text-sm">
                        Stock: <span className="text-green-600 text-sm">Disponible</span>
                      </p>
                    ) : (
                      <p className="text-gray-500 text-sm">Stock: {product.stock_product} unidades</p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {productTags.map((tag: any) => (
                        <span
                          key={tag!.id_tag}
                          className="px-3 py-1 text-xs font-medium rounded-full"
                          style={{
                            backgroundColor: tag!.color_tag || '#e0f2f1',
                            color: tag!.color_tag ? '#fff' : '#000'
                          }}
                        >
                          {tag!.name_tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedHomeCard>
            );
          })}
        </section>

        {!showAll && filteredProducts.length > 6 && (
          <div className="flex justify-center">
            <Button
              onClick={() => setShowAll(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition duration-300 flex items-center gap-2 transform hover:-translate-y-0.5 hover:scale-105 cursor-pointer"
            >
              <span>Ver más productos</span>
              <ChevronDown className="w-5 h-5" />
            </Button>
          </div>
        )}
      </main>

      {/* Modal detalle */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden flex flex-col md:flex-row animate-[fadeIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1 bg-gray-100 flex items-center justify-center p-6">
              <img
                src={selectedProduct.image_product}
                alt={selectedProduct.name_product}
                className="w-full h-[500px] object-contain rounded-2xl border-1 border-gray-200 shadow-lg"
              />
            </div>

            <div className="flex-1 flex flex-col p-6 gap-6">
              <div className="flex justify-between items-start">
                <h2 className="text-3xl font-bold text-gray-900">{selectedProduct.name_product}</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:text-gray-800 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                {selectedProduct.description_product}
              </p>

              {categories && (
                <div className="inline-block px-4 py-1 text-sm font-medium text-white rounded-full bg-sky-600">
                  Categoría:{" "}
                  {
                    categories.find((c) => c.id_category === selectedProduct.id_category_product)
                      ?.name_category
                  }
                </div>
              )}

              {selectedProduct.id_tag_product && (
                <div className="flex flex-wrap gap-2">
                  {JSON.parse(selectedProduct.id_tag_product.toString())
                    .map((tagId: string) =>
                      tags.find((t) => t.id_tag.toString() === tagId)
                    )
                    .filter(Boolean)
                    .map((tag: any) => (
                      <span
                        key={tag.id_tag}
                        className="px-3 py-1 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor: tag.color_tag || '#e0f2f1',
                          color: tag.color_tag ? '#fff' : '#000'
                        }}
                      >
                        {tag.name_tag}
                      </span>
                    ))}
                </div>
              )}

              <div className="flex items-baseline gap-3">
                {selectedProduct.offerPrice_product &&
                Number(selectedProduct.offerPrice_product) > 0 ? (
                  <>
                    <span className="text-gray-500 line-through text-lg">
                      {new Intl.NumberFormat('es-BO', {
                        style: 'currency',
                        currency: 'BOB',
                      }).format(Number(selectedProduct.price_product))}
                    </span>
                    <span className="text-green-600 font-extrabold text-3xl">
                      {new Intl.NumberFormat('es-BO', {
                        style: 'currency',
                        currency: 'BOB',
                      }).format(Number(selectedProduct.offerPrice_product))}
                    </span>
                  </>
                ) : (
                  <span className="text-green-600 font-extrabold text-3xl">
                    {new Intl.NumberFormat('es-BO', {
                      style: 'currency',
                      currency: 'BOB',
                    }).format(Number(selectedProduct.price_product))}
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm">
                Stock:{" "}
                {selectedProduct.isAvailable_product
                  ? "Disponible"
                  : `${selectedProduct.stock_product} unidades`}
              </p>

              <div className="flex justify-end mt-auto">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="bg-red-500 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-full shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-0.5 hover:scale-105"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
