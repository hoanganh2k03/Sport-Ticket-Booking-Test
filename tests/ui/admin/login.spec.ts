import { test, expect, type Page } from '@playwright/test';
import { LoginPage } from '../../../pages/admin/login.page';
import { ProfilePage } from '../../../pages/admin/profile.page';
import { ADMIN_USERNAME,ADMIN_PASSWORD } from "../../../utils/config";
import { verifyUserRecord } from '../../../utils/db/login-assertions';
test.describe('Admin Login Page', () => {
let loginPage: LoginPage;
let profilePage: ProfilePage;
test.beforeEach(async ({ page }) => {
loginPage = new LoginPage(page);
profilePage= new ProfilePage(page);
});
test('Đăng nhập thành công', async ({ page }) => {
  // Test này chạy đầy đủ các bước UI login
  await loginPage.open();
  await loginPage.login(ADMIN_USERNAME, ADMIN_PASSWORD, true);
  await profilePage.expectHeaderRole();
  //await verifyUserRecord(ADMIN_USERNAME, ADMIN_PASSWORD,1,"admin");
});
});
