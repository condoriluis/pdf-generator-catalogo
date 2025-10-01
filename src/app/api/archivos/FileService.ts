import { connectDB } from '@/lib/utils/db';

export class FileService {

    static async getFiles() {
        const connection = await connectDB();
        try {
            const [rows]: any = await connection.query(`
                SELECT * FROM files
                `);
            return rows;
        } finally {
            connection.release();
        }
    }

    static async getFileById(id_file: number) {
        const connection = await connectDB();
        try {
            const [rows]: any = await connection.query(`
                SELECT * FROM files
                WHERE id_file = ?`,
                [id_file]
            );
            return rows[0];
        } finally {
            connection.release();
        }
    }

    static async createFile(name_file: string, name_folder_file: string, extension_file: string, type_file: string, size_file: number, url_file: string, id_mailchimp?: number) {
        const connection = await connectDB();
        try {
            const [rows]: any = await connection.query(
                'INSERT INTO files (name_file, name_folder_file, extension_file, type_file, size_file, url_file, id_mailchimp) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [name_file, name_folder_file, extension_file, type_file, size_file, url_file, id_mailchimp]
            );
            return { id_file: rows.insertId }

        } finally {
            connection.release();
        }
    }

    static async updateFileName(id_file: number, name_file: string) {
        const connection = await connectDB();
        try {
            
            const [rows]: any = await connection.query(
                'UPDATE files SET name_file = ? WHERE id_file = ?',
                [name_file, id_file]
            );
            return rows.affectedRows;
            
        } finally {
            connection.release();
        }
    }

    static async deleteFile(id_file: number) {
        const connection = await connectDB();
        try {
            const [rows]: any = await connection.query(
                'DELETE FROM files WHERE id_file = ?',
                [id_file]
            );
            return rows.affectedRows;
        } finally {
            connection.release();
        }
    }

}
