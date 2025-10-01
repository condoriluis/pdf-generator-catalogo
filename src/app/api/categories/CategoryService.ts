import { connectDB } from '@/lib/utils/db';

export class CategoryService {

    static async getCategories() {
        const connection = await connectDB();
        try {
            const [rows]: any = await connection.query(`
                SELECT * FROM categories
                `);
            return rows;
        } finally {
            connection.release();
        }
    }

    static async getCategoryById(id_category: number) {
        const connection = await connectDB();
        try {
            const [rows]: any = await connection.query(`
                SELECT * FROM categories
                WHERE id_category = ?`,
                [id_category]
            );
            return rows[0];
        } finally {
            connection.release();
        }
    }

    static async createCategory(name_category: string, description_category: string) {
        const connection = await connectDB();
        try {
            const [rows]: any = await connection.query(
                'INSERT INTO categories (name_category, description_category) VALUES (?, ?)',
                [name_category, description_category]
            );
            return rows.insertId;
        } finally {
            connection.release();
        }
    }

    static async updateCategory(id_category: number, name_category: string, description_category: string) {
        const connection = await connectDB();
        try {
            
            const [rows]: any = await connection.query(
                'UPDATE categories SET name_category = ?, description_category = ? WHERE id_category = ?',
                [name_category, description_category, id_category]
            );
            return rows.affectedRows;
            
        } finally {
            connection.release();
        }
    }

    static async deleteCategory(id_category: number) {
        const connection = await connectDB();
        try {
            const [rows]: any = await connection.query(
                'DELETE FROM categories WHERE id_category = ?',
                [id_category]
            );
            return rows.affectedRows;
        } finally {
            connection.release();
        }
    }

}
