import { Page,Locator } from '@playwright/test';
import fs from 'fs';
import path from 'path';
export async function createHeaderMap(tableLocator:Locator) {
  const headerMap = new Map<string, number>();
  
  // 1. Lấy tất cả tiêu đề
  const headers = tableLocator.locator('thead th');
  const count = await headers.count();

  // 2. Lặp qua tiêu đề (chỉ C cột, rất nhanh)
  for (let i = 0; i < count; i++) {
    const headerText = await headers.nth(i).textContent();
    if (headerText) {
      // 3. Tạo Map
      headerMap.set(headerText.trim(), i);
    }
  }
  return headerMap;
}
export function randomEmployeeImage(): string {
  const IMAGE_DIR = 'D:/DATN/ticket-booking-be/ticket_booking/media/employee_images';
  // Lấy danh sách file trong folder
  const files = fs.readdirSync(IMAGE_DIR);

  // Lọc chỉ lấy file ảnh
  const images = files.filter(file =>
    /\.(jpg|jpeg|png|webp)$/i.test(file)
  );

  if (images.length === 0) {
    throw new Error('Không có ảnh nào trong thư mục employee_images');
  }

  // Random 1 ảnh
  const randomImage = images[Math.floor(Math.random() * images.length)];

  // Trả về path (tuỳ backend)
  return path.join(IMAGE_DIR, randomImage);
  // hoặc: path.join(IMAGE_DIR, randomImage)
}