'use client'; 
import Link from 'next/link';
import { useState } from 'react';
import { Settings, ChevronDown } from "lucide-react";
import { AnimatedHomeCard } from '@/components/about';
import { Button } from '@/components/ui';
import { catalog } from '@/lib/constants';

export default function Home() {
  const [showAll, setShowAll] = useState(false);

  const activeProducts = catalog.products
  .filter(product => product.status === 1)
  .sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  const productsToShow = showAll ? activeProducts : activeProducts.slice(0, 6);

  return (
    <>
      <div className='bg-mesh-gradient-lcz fixed -z-10 min-h-screen w-full overflow-hidden' />

      <main className='container mx-auto py-6 space-y-6'>

        <section className="relative flex flex-col items-center justify-center text-center w-full
          min-h-[50vh] sm:min-h-[55vh] md:min-h-[60vh] lg:min-h-[55vh]
          max-h-[500px]
          px-4 sm:px-6 md:px-12 rounded-3xl shadow-lg
          bg-[url('/assets/images/catalogo-hero.jpeg')] bg-cover bg-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 via-gray-800/40 to-gray-700/60 rounded-3xl shadow-inner"></div>

          <div className="relative z-10 flex flex-col items-center justify-center text-center px-2 sm:px-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white drop-shadow-lg">
              Catálogo Profesional de Productos
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mb-6 text-white drop-shadow-md">
              Gestiona fácilmente tus <strong>productos, categorías y etiquetas</strong> en nuestro sistema intuitivo, y genera automáticamente un <strong>catálogo PDF profesional</strong> listo para compartir o imprimir. 
              Optimizado para empresas que buscan control completo sobre su inventario y presentación de productos.
            </p>
            <Button asChild className="bg-gray-800 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-full shadow-md hover:shadow-xl hover:bg-gray-900 transition duration-300 flex items-center gap-2 transform hover:-translate-y-0.5 hover:scale-105">
              <Link href="/admin" className="flex items-center gap-2">
                <Settings className="w-4 sm:w-5 h-4 sm:h-5" />
                Acceder al Panel Admin
              </Link>
            </Button>
          </div>
        </section>

        {activeProducts.length === 0 && (
          <div className="w-full flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl shadow-md border border-gray-200">
            <img
              src="/assets/images/empty-catalog.png" 
              alt="Sin productos"
              className="w-24 h-24 mb-4 opacity-80"
            />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              No hay productos activos disponibles
            </h2>
            <p className="text-gray-600 max-w-md mb-6">
              Aún no has activado ningún producto en tu catálogo. 
              Accede al panel de administración para agregar o activar productos.
            </p>
          </div>
        )}

        <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {productsToShow.map((product, index) => {
            const category = catalog.categories.find(c => c.id === product.categoryId);
            const tags = product.tags
              ? product.tags.map(tagId => catalog.tags.find(t => t.id === tagId)).filter(Boolean)
              : [];

            return (
              <AnimatedHomeCard 
                overrideClassName
                key={product.id} 
                delay={index * 0.1 + 0.2} 
                className="flex flex-col rounded-xl shadow-md hover:shadow-xl transition-shadow duration-500 overflow-hidden bg-white transform hover:-translate-y-1 hover:scale-105 transition-transform duration-500"
              >
                {product.image && (
                  <div className="h-56 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="p-5 flex flex-col flex-1">

                  <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2 hover:text-teal-600 transition-colors duration-300">
                    {product.name}
                  </h2>

                  <div className="flex items-baseline gap-2 mb-3">
                    {product.offerPrice && Number(product.offerPrice) > 0 ? (
                      <>
                        <span className="text-gray-500 line-through text-sm">
                          Antes: {new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(Number(product.price))}
                        </span>
                        <span className="text-green-600 font-bold text-lg">
                          Ahora: {new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(Number(product.offerPrice))}
                        </span>
                      </>
                    ) : (
                      <span className="text-green-600 font-bold text-lg">
                        {new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(Number(product.price))}
                      </span>
                    )}
                  </div>

                  {category && (
                    <div
                      className="inline-block px-3 py-1 mb-3 text-sm font-medium text-white rounded-full"
                      style={{ backgroundColor: '#0ea5e9' }}
                    >
                      Categoría: {category.name}
                    </div>
                  )}

                  <p className="text-gray-700 mb-4 flex-1 text-sm md:text-base">
                    {product.description.length > 100
                      ? product.description.slice(0, 100) + '...'
                      : product.description}
                  </p>

                  <div className="flex justify-between items-center mt-auto flex-wrap gap-2">

                    {product.isAvailable ? (
                      <p className="text-gray-500 text-sm">Stock: <span className="text-green-600 text-sm">Disponible</span></p>
                    ) : (
                      <p className="text-gray-500 text-sm">Stock: {product.stock} unidades</p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => tag && (
                        <span
                          key={tag.id}
                          className="px-3 py-1 text-xs font-medium rounded-full"
                          style={{
                            backgroundColor: tag.color || '#e0f2f1',
                            color: tag.color ? '#fff' : '#000'
                          }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </AnimatedHomeCard>
            );
          })}
        </section>

        {!showAll && activeProducts.length > 6 && (
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
    </>
  );
}
