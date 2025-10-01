import { connectDB } from '@/lib/utils/db';

export class TagService {

    static async getTags() {
        const connection = await connectDB();
        try {
            const [rows]: any = await connection.query(`
                SELECT * FROM tags
                `);
            return rows;
        } finally {
            connection.release();
        }
    }

    static async getTagById(id_tag: number) {
        const connection = await connectDB();
        try {
            const [rows]: any = await connection.query(`
                SELECT * FROM tags
                WHERE id_tag = ?`,
                [id_tag]
            );
            return rows[0];
        } finally {
            connection.release();
        }
    }

    static async createTag(name_tag: string, color_tag: string) {
        const connection = await connectDB();
        try {
            const [rows]: any = await connection.query(
                'INSERT INTO tags (name_tag, color_tag) VALUES (?, ?)',
                [name_tag, color_tag]
            );
            return rows.insertId;
        } finally {
            connection.release();
        }
    }

    static async updateTag(id_tag: number, name_tag: string, color_tag: string) {
        const connection = await connectDB();
        try {
            
            const [rows]: any = await connection.query(
                'UPDATE tags SET name_tag = ?, color_tag = ? WHERE id_tag = ?',
                [name_tag, color_tag, id_tag]
            );
            return rows.affectedRows;
            
        } finally {
            connection.release();
        }
    }

    static async deleteTag(id_tag: number) {
        const connection = await connectDB();
        try {
            const [rows]: any = await connection.query(
                'DELETE FROM tags WHERE id_tag = ?',
                [id_tag]
            );
            return rows.affectedRows;
        } finally {
            connection.release();
        }
    }

}
