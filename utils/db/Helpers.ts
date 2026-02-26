// Giả định sử dụng Node.js 'crypto' để làm rõ cơ chế
import * as crypto from 'crypto';
export async function verifyPassword(password: string, encodedHash: string): Promise<boolean> {
    // 1. Phân tích chuỗi băm (vd: pbkdf2_sha256$600000$salt$hash)
    const parts = encodedHash.split('$');
    if (parts.length !== 4 || parts[0] !== 'pbkdf2_sha256') {
        // Xử lý lỗi nếu chuỗi băm không đúng định dạng
        return false;
    }
    
    const iterations = parseInt(parts[1], 10);
    const salt = parts[2];
    const storedHash = parts[3];

    // 2. Tái tạo chuỗi băm (sử dụng async PBKDF2)
    // Kích thước key (keylen) thường là 32 byte cho SHA-256
    const keylen = 32; 
    
    // Sử dụng crypto.pbkdf2 để băm lại mật khẩu
    const newHashBuffer = await new Promise<Buffer>((resolve, reject) => {
        crypto.pbkdf2(
            password, 
            salt, 
            iterations, 
            keylen, 
            'sha256', // Hàm băm
            (err, derivedKey) => {
                if (err) return reject(err);
                resolve(derivedKey);
            }
        );
    });

    // Chuyển buffer thành base64 (Django thường dùng base64)
    const newHash = newHashBuffer.toString('base64');
    
    // 3. So sánh (So sánh buffer thô để tránh timing attacks, nhưng so sánh chuỗi cũng thường được chấp nhận ở cấp độ này)
    return newHash === storedHash;
}
export async function normalizeDbDate(isoString: string): Promise<string> {
  if (!isoString) return "";

  const date = new Date(isoString);
  // chuyển sang UTC+7
  date.setHours(date.getHours() + 7);

  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}
export async function normalizeGender(value: string | null): Promise<string> {
  if (!value) return "";

  const v = value.toUpperCase().trim();

  // UI dạng chữ → DB dạng số
  if (v === "NAM") return "0";
  if (v === "NỮ" || v === "NU") return "1";

  // DB dạng số → giữ nguyên
  if (v === "0" || v === "1") return v;

  return "";
}
export function stripImageSuffix(path: string) {
  // lấy filename
  const file = path.split('/').pop()!;
  // bỏ _xxxx trước .jpg
  return file.replace(/_[^_.]+(?=\.)/, '');
}
