# PDF Generator - Catálogo de Productos

Este proyecto es una aplicación web construida con [Next.js](https://nextjs.org) que permite generar y descargar catálogos de productos en formato PDF de manera dinámica. Incluye un panel de administración para gestionar productos, categorías, etiquetas, archivos y configuración general del catálogo.

## Características principales

- Generación de catálogos de productos en PDF usando [@react-pdf/renderer](https://react-pdf.org/).
- Panel de administración para CRUD de productos, categorías, archivos y configuración.
- Gestión de imágenes y recursos estáticos.
- Personalización de estilos, marcas de agua y colores desde la configuración.
- Visualización y descarga de PDF desde la interfaz web.
- Estructura modular y escalable usando TypeScript.

## Estructura del proyecto

- `/src/app`: Rutas principales de la aplicación, incluyendo `/admin` (panel de administración) y `/generate` (endpoint para generar el PDF).
- `/src/components/pdf`: Componentes reutilizables para la generación y visualización de PDFs.
- `/src/lib/constants` y `/src/lib/utils`: Lógica y utilidades compartidas, manejo de datos y constantes globales.
- `/public/assets`: Imágenes y recursos estáticos usados en el catálogo y los PDFs.

## Instalación y uso

### Variables de entorno necesarias

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables según los servicios que utilices:

```env
# AWS S3 (opcional, solo si usas almacenamiento S3)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=TU_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=TU_SECRET_KEY
AWS_BUCKET_NAME=tu-nombre-bucket

# Cloudinary (opcional, solo si usas almacenamiento Cloudinary)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Mailchimp (opcional, solo si usas integración de Mailchimp)
MAILCHIMP_API_KEY=tu_mailchimp_api_key
MAILCHIMP_LIST_ID=tu_mailchimp_list_id

# Variables públicas de Next.js
NEXT_PUBLIC_SITE_URL=localhost:3000
PORT=3000
```

1. Instala las dependencias:
   ```bash
   npm install
   # o
   pnpm install
   ```

2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   # o
   pnpm dev
   ```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

4. Accede al panel de administración en `/admin` para gestionar los datos del catálogo.

5. Para generar y descargar el catálogo en PDF, accede a `/generate` o usa los botones de descarga en la interfaz.

## Generación de PDF

La generación del PDF se realiza en el endpoint `/generate`, que utiliza los datos de productos, categorías y configuración para crear un documento PDF personalizado y descargable. Puedes previsualizar el PDF o forzar la descarga usando el parámetro `?preview=true` en la URL.

## Dependencias principales

- **Next.js**: Framework React para SSR y SSG.
- **@react-pdf/renderer**: Generación de PDFs en el servidor y cliente.
- **Tailwind CSS**: Estilado de la interfaz.
- **Zod**: Validación de esquemas.
- **AWS SDK y Cloudinary**: Soporte para almacenamiento de archivos e imágenes (opcional/configurable).

Consulta `package.json` para el listado completo de dependencias.

## Configuración adicional

- Personaliza la marca de agua, logo, colores y textos directamente desde la base de datos a través del panel de administración.
- Al iniciar el proyecto por primera vez, asegúrate de crear las tablas necesarias en tu base de datos. Ejemplo de estructura MySQL:

```sql
CREATE TABLE IF NOT EXISTS `settings`  (
  `id_setting`  int(11) NOT NULL AUTO_INCREMENT,
  `logo_url_setting`  varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `title_setting`  varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `description_setting`  text COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `category_bg_setting`  varchar(7) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `watermark_setting`  text COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `orientation_setting`  enum('portrait','landscape') COLLATE utf8mb4_spanish_ci DEFAULT 'portrait',
  `template_setting`  varchar(50) COLLATE utf8mb4_spanish_ci DEFAULT 'grid',
  `date_created_setting`  timestamp NOT NULL DEFAULT current_timestamp(),
  `date_updated_setting`  timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_setting`)
);

CREATE TABLE IF NOT EXISTS `files`  (
  `id_file`  int(11) NOT NULL AUTO_INCREMENT,
  `name_file`  varchar(100) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `name_folder_file`  varchar(20) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `extension_file`  varchar(5) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `type_file`  varchar(20) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `size_file`  int(11) DEFAULT NULL,
  `url_file`  varchar(500) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `id_mailchimp`  int(11) DEFAULT NULL,
  `date_created_file`  timestamp NOT NULL DEFAULT current_timestamp(),
  `date_updated_file`  timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_file`)
);

CREATE TABLE IF NOT EXISTS `categories`  (
  `id_category`  int(11) NOT NULL AUTO_INCREMENT,
  `name_category`  varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `description_category`  text COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `date_created_category`  timestamp NOT NULL DEFAULT current_timestamp(),
  `date_updated_category`  timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_category`) USING BTREE
);

CREATE TABLE IF NOT EXISTS `tags`  (
  `id_tag`  int(11) NOT NULL AUTO_INCREMENT,
  `name_tag`  varchar(50) COLLATE utf8mb4_spanish_ci NOT NULL,
  `color_tag`  varchar(50) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `date_created_tag`  timestamp NOT NULL DEFAULT current_timestamp(),
  `date_updated_tag`  timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_tag`)
);

CREATE TABLE IF NOT EXISTS `products`  (
  `id_product`  int(11) NOT NULL AUTO_INCREMENT,
  `name_product`  varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `description_product`  text COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `price_product`  decimal(10,2) DEFAULT NULL,
  `stock_product`  int(11) DEFAULT NULL,
  `isAvailable_product`  tinyint(1) DEFAULT NULL,
  `image_product`  varchar(255) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `id_category_product`  int(11) DEFAULT NULL,
  `status_product`  tinyint(1) DEFAULT NULL,
  `id_tag_product`  varchar(50) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `hasOffer_product`  tinyint(1) DEFAULT NULL,
  `offerPrice_product`  decimal(10,2) DEFAULT NULL,
  `date_created_product`  timestamp NOT NULL DEFAULT current_timestamp(),
  `date_updated_product`  timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_product`),
  KEY `id_category_product` (`id_category_product`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`id_category_product`) REFERENCES `categories` (`id_category`)
);
```

- Puedes agregar nuevas categorías, productos y etiquetas desde la interfaz de administración.

## Autor

- Luis CZ ([GitHub](https://github.com/condoriluis))

---

Este proyecto está bajo licencia MIT. Siéntete libre de contribuir, reportar issues o sugerir mejoras.
