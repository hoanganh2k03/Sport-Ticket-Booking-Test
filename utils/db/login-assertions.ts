// db-assertions.ts
import { expect } from '@playwright/test';
import { executeQuery } from './db'; // Hàm thực thi truy vấn đã có
import {verifyPassword}  from './Helpers';

/**
 * Xác minh một bản ghi người dùng tồn tại và khớp với dữ liệu mong đợi
 * @param email - Email của người dùng cần kiểm tra
 * @param expectedName - Tên mong đợi
 * @param expectedStatus - Trạng thái mong đợi (ACTIVE/INACTIVE, v.v.)
 */
export async function verifyUserRecord(username: string, password:string,expectedStatus:number,expectedRole:string) {
    
    // 1. Thực thi truy vấn DB
 const sqlQuery = `SELECT * FROM employee_account WHERE username = ?`;
const results = await executeQuery(sqlQuery, [username]);

    // 2. Bắt đầu Assertions Cốt lõi
    
    // Kiểm tra A: Đảm bảo chỉ có 1 bản ghi
    expect(results.length).toBe(1);
    const userRecord = results[0];
const hashedPassword = userRecord.password;
const isPasswordValid = await verifyPassword(password, hashedPassword);
console.log("mật khẩu băm " +hashedPassword);
console.log("có đúng không " +isPasswordValid);
expect(isPasswordValid).toBe(true);
    // Kiểm tra B: Kiểm tra tính chính xác của các trường dữ liệu
    expect(userRecord.username).toBe(username);
    
    // Kiểm tra C: Kiểm tra các quy tắc kinh doanh/ràng buộc
    expect(userRecord.is_active).toBe(expectedStatus);
    expect(userRecord.role).toBe(expectedRole);
    // Kiểm tra D: Ví dụ về các trường bắt buộc khác
    
} 