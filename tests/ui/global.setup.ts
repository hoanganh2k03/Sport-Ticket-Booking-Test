import { test } from '@playwright/test';
import { LoginPage } from '../../pages/admin/login.page';
import { BASE_URL } from "../../utils/config";
import fs from 'fs';
import path from 'path';
import { ADMIN_USERNAME,ADMIN_PASSWORD } from "../../utils/config";
const authDir = path.join(__dirname, '../../playwright/.auth');
const adminAuth = path.join(authDir, 'admin.json');
test('setup project: login once', async ({ page }) => {
    if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(ADMIN_USERNAME, ADMIN_PASSWORD);
  await page.waitForURL(`${BASE_URL}/pages/admin/base.html`, {
    timeout: 10_000
  });
  // lưu session để các test khác dùng
  await page.context().storageState({ path: adminAuth });
});
