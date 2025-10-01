import { connectDB } from '@/lib/utils/db';

export class ProductService {

    static async getProducts() {
        const connection = await connectDB();
        try {
            const [rows]: any = await connection.query(`
                SELECT * FROM products
                `);
            return rows;
        } finally {
            connection.release();
        }
    }

    static async getProductById(id_product: number) {
        const connection = await connectDB();
        try {
            const [rows]: any = await connection.query(`
                SELECT * FROM products
                WHERE id_product = ?`,
                [id_product]
            );
            return rows[0];
        } finally {
            connection.release();
        }
    }

    static async getProductsByCategory(categoryId: number) {
        const connection = await connectDB();
        try {
          const [rows] = await connection.query(
            `
            SELECT * FROM products
            WHERE id_category_product = ?
            `,
            [categoryId]
          );
          return rows as any[]; 
        } finally {
          connection.release();
        }
      }      

    static async createProduct(name_product: string, description_product: string, price_product: number, stock_product: number, isAvailable_product: number, image_product: string, id_category_product: number, status_product: number, id_tag_product: string[], offerPrice_product: number, hasOffer_product: number) {
        const connection = await connectDB();
        try {
            const [rows]: any = await connection.query(
                'INSERT INTO products (name_product, description_product, price_product, stock_product, isAvailable_product, image_product, id_category_product, status_product, id_tag_product, offerPrice_product, hasOffer_product) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [name_product, description_product, price_product, stock_product, isAvailable_product, image_product, id_category_product, status_product, JSON.stringify(id_tag_product), offerPrice_product, hasOffer_product]
            );
            
            return { id_product: rows.insertId };

        } finally {
            connection.release();
        }
    }

    static async updateProduct(id_product: number, name_product: string, description_product: string, price_product: number, stock_product: number, isAvailable_product: number, image_product: string, id_category_product: number, status_product: number, id_tag_product: string[], offerPrice_product: number, hasOffer_product: number) {
        const connection = await connectDB();
        try {
            
            const [rows]: any = await connection.query(
                'UPDATE products SET name_product = ?, description_product = ?, price_product = ?, stock_product = ?, isAvailable_product = ?, image_product = ?, id_category_product = ?, status_product = ?, id_tag_product = ?, offerPrice_product = ?, hasOffer_product = ? WHERE id_product = ?',
                [name_product, description_product, price_product, stock_product, isAvailable_product, image_product, id_category_product, status_product, JSON.stringify(id_tag_product), offerPrice_product, hasOffer_product, id_product]
            );
            return rows.affectedRows;
            
        } finally {
            connection.release();
        }
    }

    static async updateStatusProduct(id_product: number, status_product: number) {
        const connection = await connectDB();
        try {
            
            const [rows]: any = await connection.query(
                'UPDATE products SET status_product = ? WHERE id_product = ?',
                [status_product, id_product]
            );
            return rows.affectedRows;
            
        } finally {
            connection.release();
        }
    }

    static async deleteProduct(id_product: number) {
        const connection = await connectDB();
        try {
            const [rows]: any = await connection.query(
                'DELETE FROM products WHERE id_product = ?',
                [id_product]
            );
            return rows.affectedRows;
        } finally {
            connection.release();
        }
    }

}
