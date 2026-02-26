// db-assertions.ts
import { expect } from '@playwright/test';
import { executeQuery } from './db'; // Hàm thực thi truy vấn đã có
import { normalizeDbDate,normalizeGender,stripImageSuffix} from './Helpers';
/**
 * Xác minh một bản ghi người dùng tồn tại và khớp với dữ liệu mong đợi
 * @param id - id người kiểm tra
 * @param uiData - Object cần so sánh với db
 */
export async function verifyProfileRecord(id: string, uiData: {
        name: string | null;
        birthdate: string | null;
        gender: string | null;
        phone: string | null;
        email: string | null;
        citizenId: string | null;
        address: string | null;
    } ) {
    
    // 1. Thực thi truy vấn DB
 const sqlQuery = `SELECT full_name,date_of_birth,phone_number,email,citizen_id,gender,address FROM employee WHERE id = ?`;
const results = await executeQuery(sqlQuery, [id]);
    // 2. Bắt đầu Assertions Cốt lõi
    
    // Kiểm tra A: Đảm bảo chỉ có 1 bản ghi
    expect(results.length).toBe(1);
    const record = results[0];
    // 3. So sánh từng trường giữa DB ↔ UI
     expect(record.full_name).toBe(uiData.name);
     expect(await normalizeDbDate(record.date_of_birth)).toBe(uiData.birthdate);
     expect(record.gender).toBe(Number(await normalizeGender(uiData.gender)));
     expect(record.phone_number).toBe(uiData.phone);
     expect(record.email).toBe(uiData.email);
     expect(record.citizen_id).toBe(uiData.citizenId);
     expect(record.address).toBe(uiData.address);
    
} 
export async function verifyProfileUpdate(id: string, uiData: {
        name: string;
        birthdate: string ;
        gender: string ;
        phone: string ;
        email: string ;
        fileName: string ;
        address: string;
    } ) {
    
    // 1. Thực thi truy vấn DB
 const sqlQuery = `SELECT full_name,date_of_birth,phone_number,email,citizen_id,gender,address,image FROM employee WHERE id = ?`;
await new Promise(r => setTimeout(r, 2000));
const results = await executeQuery(sqlQuery, [id]);

    // 2. Bắt đầu Assertions Cốt lõi
    
    // Kiểm tra A: Đảm bảo chỉ có 1 bản ghi
    expect(results.length).toBe(1);
    const record = results[0];
    // 3. So sánh từng trường giữa DB ↔ UI
     expect(record.full_name).toBe(uiData.name);
     expect(await normalizeDbDate(record.date_of_birth)).toBe(uiData.birthdate);
     expect(record.gender).toBe(Number(await normalizeGender(uiData.gender)));
     expect(record.phone_number).toBe(uiData.phone);
     expect(record.email).toBe(uiData.email);
     expect(`employee_images/${stripImageSuffix(record.image)}`).toBe(`employee_images/${uiData.fileName}`);
     expect(record.address).toBe(uiData.address);
    
} 
export async function getUserPasswordHash(id: string): Promise<string|null> {
    const sqlQuery = `SELECT password FROM employee_account  WHERE employee_id = ?`;
    const results = await executeQuery(sqlQuery, [id]);
    return results.length > 0 ? results[0].password : null;
}