import { test, expect, type Page } from '@playwright/test';
import { ProfilePage } from '../../../pages/admin/profile.page';
import {getUserPasswordHash, verifyProfileRecord,verifyProfileUpdate} from  '../../../utils/db/profile-assertions';
import { randomEmployee, randomPassword } from '../../../utils/dataFactory/dataFactory';
import { randomEmployeeImage } from '../../../utils/uiHelpers';
import { profile } from 'console';
import { verifyPassword } from '../../../utils/db/Helpers';
import { ADMIN_PASSWORD } from '../../../utils/config';
test.use({ storageState: 'playwright/.auth/admin.json', });
test.describe('Admin Profile Page', () => {
let profilePage: ProfilePage;
test.beforeEach(async ({ page }) => {
profilePage= new ProfilePage(page);
});
test('Hiển thị thông tin profile đúng', async ({ page }) => {
  await profilePage.open();

  // 2. Lấy userId từ localStorage
  const employeeId = await page.evaluate(() => {
    return window.localStorage.getItem("employee_id");
  });

  expect(employeeId).not.toBeNull();

  // 3. Lấy dữ liệu UI
  const uiData = await profilePage.getProfileInfo();

  // 4. Verify DB ↔ UI
  //await verifyProfileRecord(employeeId!, uiData);
  }

)
test("sửa tên,giới tính,địa chỉ,ảnh ",async({page})=>{
  await profilePage.open();
  await profilePage.openEditInfoSection();
  const emp = randomEmployee();
await profilePage.editFullName(emp.full_name);
await profilePage.editGender(emp.gender);
await profilePage.editBirthdate(emp.date_of_birth);
await profilePage.editAddress(emp.address);
await profilePage.uploadImage(randomEmployeeImage());
const uiData = await profilePage.getInputProfileInfo();
console.log(uiData);
await profilePage.saveProfile();
await profilePage.expectToastUpdateSuccess();
 const employeeId = await page.evaluate(() => {
    return window.localStorage.getItem("employee_id");
  });
  //await verifyProfileUpdate(employeeId!, uiData);
})
test("đổi mật khẩu thành công",async({page})=>{ // Đổi tên test để phản ánh cả hai hành động
  await profilePage.open();
   const employeeId = await page.evaluate(() => {
    return window.localStorage.getItem("employee_id");
  });
  expect(employeeId).not.toBeNull();
  await profilePage.openChangePasswordSection();
  // Đổi mật khẩu
  let newPassword: string;
  if(ADMIN_PASSWORD==="12345678"){
    newPassword="1234567";
  }
  else{
    newPassword="12345678";
  }
  await profilePage.changePassword(ADMIN_PASSWORD, newPassword);
  await profilePage.expectToastUpdatePasswordSuccess();
  /*
  const passwordHashAfterChange = await getUserPasswordHash(employeeId as string);
  expect(passwordHashAfterChange).not.toBeNull();
  page.waitForTimeout(2000);
 await expect(verifyPassword(newPassword, passwordHashAfterChange!)).resolves.toBe(true);
  console.log("Password changed successfully.");
*/
  // Khôi phục mật khẩu về ban đầu
  // Mật khẩu hiện tại trong hệ thống chính là 'newPassword' vừa đặt
  const currentPasswordInSystem = newPassword;
  const originalAdminPassword = ADMIN_PASSWORD;

  await profilePage.changePassword(currentPasswordInSystem, originalAdminPassword);
  await profilePage.expectToastUpdatePasswordSuccess();
  /*
  const passwordHashAfterRestore = await getUserPasswordHash(employeeId as string);
  expect(passwordHashAfterRestore).not.toBeNull();

  console.log("Password restored successfully.");
  */
});
});