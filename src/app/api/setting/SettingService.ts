import { connectDB } from '@/lib/utils/db';

export class SettingService {

    static async getSetting() {
        const connection = await connectDB();
        try {
            const [rows]: any = await connection.query(`
                SELECT * FROM settings
                `);
            return rows;
        } finally {
            connection.release();
        }
    }

    static async updateSetting(id_setting: number, logo_url_setting: string, title_setting: string, description_setting: string, category_bg_setting: string, orientation_setting: string, template_setting: string, watermark_setting: string) {
        const connection = await connectDB();
        try {
            
            const [rows]: any = await connection.query(
                'UPDATE settings SET logo_url_setting = ?, title_setting = ?, description_setting = ?, category_bg_setting = ?, orientation_setting = ?, template_setting = ?, watermark_setting = ? WHERE id_setting = ?',
                [logo_url_setting, title_setting, description_setting, category_bg_setting, orientation_setting, template_setting, watermark_setting, id_setting]
            );
            return rows.affectedRows;
            
        } finally {
            connection.release();
        }
    }

}
