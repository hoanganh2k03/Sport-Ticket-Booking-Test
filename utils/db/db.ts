// db.ts
import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();
// Cấu hình kết nối DB (thường được lấy từ biến môi trường)
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'test_user',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306
};

/**
 * Thực hiện truy vấn SQL và trả về kết quả
 * @param sqlQuery - Câu lệnh SQL để thực thi
 * @returns Kết quả truy vấn
 */
export async function executeQuery(sqlQuery: string, params: any[] = []): Promise<any[]> {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute(sqlQuery,params);
        return rows as any[];
    } catch (error) {
        console.error('Lỗi khi truy vấn DB:', error);
        throw error;
    } finally {
        await connection.end();
    }
}