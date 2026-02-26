import { Page, Locator,expect } from "@playwright/test";
import { BasePage } from "./base.page";

export class ProfilePage extends BasePage {
  // ============== LOCATORS ==============
  readonly avatarImg: Locator;
  readonly fullNameHeader: Locator;
  readonly roleHeader: Locator;

  // Info section
  readonly userId: Locator;
  readonly nameText: Locator;
  readonly birthdateText: Locator;
  readonly genderText: Locator;
  readonly phoneText: Locator;
  readonly emailText: Locator;
  readonly citizenIdText: Locator;
  readonly addressText: Locator;

  // Buttons
  readonly btnEditInfo: Locator;
  readonly btnToggleChangePassword: Locator;
  readonly btnSaveInfo: Locator;
  readonly btnChangePassword: Locator;

  // Edit form fields
  readonly inputFullName: Locator;
  readonly inputUsername: Locator;
  readonly inputBirthdate: Locator;
  readonly selectGender: Locator;
  readonly inputPhone: Locator;
  readonly inputEmail: Locator;
  readonly inputAddress: Locator;
  readonly inputImage: Locator;

  // Change password fields
  readonly inputOldPassword: Locator;
  readonly inputNewPassword: Locator;
  readonly inputConfirmNewPassword: Locator;

  // Sections show/hide
  readonly sectionEditInfo: Locator;
  readonly sectionChangePassword: Locator;
  readonly toastMessage: Locator;
  constructor(page: Page) {
    super(page);

    // Header
    this.avatarImg = page.locator(".avatar");
    this.fullNameHeader = page.locator("#full-name");
    this.roleHeader = page.locator("#role");

    // Info section
    this.userId = page.locator("#user-id");
    this.nameText = page.locator("#name");
    this.birthdateText = page.locator("#user-birthdate");
    this.genderText = page.locator("#user-gender");
    this.phoneText = page.locator("#user-phone");
    this.emailText = page.locator("#user-email");
    this.citizenIdText = page.locator("#user-citizen-id");
    this.addressText = page.locator("#user-address");

    // Buttons
    this.btnEditInfo = page.locator("#btn-edit-info");
    this.btnToggleChangePassword = page.locator("#btn-change-password-toggle");
    this.btnSaveInfo = page.locator("#btn-save-info");
    this.btnChangePassword = page.locator("#btn-doi-mat-khau");

    // Edit fields
    this.inputFullName = page.locator("#full_name");
    this.inputUsername = page.locator("#username");
    this.inputBirthdate = page.locator("#date_of_birth");
    this.selectGender = page.locator("#gender");
    this.inputPhone = page.locator("#phone_number");
    this.inputEmail = page.locator("#email");
    this.inputAddress = page.locator("#address");
    this.inputImage = page.locator("#image");

    // Password fields
    this.inputOldPassword = page.locator("#old_password");
    this.inputNewPassword = page.locator("#new_password");
    this.inputConfirmNewPassword = page.locator("#confirm_new_password");

    // Show/Hide sections
    this.sectionEditInfo = page.locator("#edit-info-section");
    this.sectionChangePassword = page.locator("#change-password-section");
    this.toastMessage = page.locator('#swal2-title');
  }
  // Toast
  

  // ============== ACTIONS ==============

  async open() {
    await this.page.goto(`${this.basePagesUrl}/base.html`);
    await this.sidebar.clickProfile();
    await this.page.waitForTimeout(1000);
  }

  // -------- Toggle sections --------
  async openEditInfoSection() {
    await this.btnEditInfo.click();
    await this.sectionEditInfo.waitFor({ state: "visible" });
  }

  async openChangePasswordSection() {
    await this.btnToggleChangePassword.waitFor({ state: 'visible' });
    await this.btnToggleChangePassword.click();
    await this.sectionChangePassword.waitFor({ state: "visible" });
  }

  // -------- Edit profile fields --------
  async editFullName(name: string) {
    await this.inputFullName.fill(name);
  }

  async editBirthdate(date: string) {
    await this.inputBirthdate.fill(date);
  }

  async editGender(value: "0" | "1") {
    await this.selectGender.selectOption(value);
  }

  async editPhone(phone: string) {
    await this.inputPhone.fill(phone);
  }

  async editEmail(email: string) {
    await this.inputEmail.fill(email);
  }

  async editAddress(address: string) {
    await this.inputAddress.fill(address);
  }

  async uploadImage(filePath: string) {
    await this.inputImage.setInputFiles(filePath);
  }

  async saveProfile() {
    await this.btnSaveInfo.click(); 
  }
 
  // -------- Change password --------
  async changePassword(oldPw: string, newPw: string) {
    await this.inputOldPassword.fill(oldPw);
    await this.inputNewPassword.fill(newPw);
    await this.inputConfirmNewPassword.fill(newPw);

    await this.btnChangePassword.click();
  }
//----------expect-------
async expectHeaderRole() {
  await expect(this.roleHeader).toContainText("Quản trị viên hệ thống");
}
async expectToastUpdateSuccess() {
   const toastLocator = this.page.locator('.swal2-container .swal2-popup.swal2-toast #swal2-title');

  //await toastLocator.waitFor({ state: 'attached', timeout: 5000 });
  await expect(toastLocator).toContainText(/thành công/i);
}
async expectToastUpdatePasswordSuccess() {
   const toastLocator = this.page.locator('.swal2-container .swal2-popup.swal2-toast #swal2-title');
  //await toastLocator.waitFor({ state: 'attached', timeout: 5000 });
  await expect(toastLocator).toContainText(/thành công/i);
}
  // -------- Assertions helper --------
  async getFullName(): Promise<string | null> {
    return await this.fullNameHeader.textContent();
  }

  async getEmail(): Promise<string | null> {
    return await this.emailText.textContent();
  }

  async getPhone(): Promise<string | null> {
    return await this.phoneText.textContent();
  }
  async getTitle(): Promise<string | null> {
    return await this.roleHeader.textContent();
  }
  async getProfileInfo(): Promise<{
  userId: string | null;
  name: string | null;
  birthdate: string | null;
  gender: string | null;
  phone: string | null;
  email: string | null;
  citizenId: string | null;
  address: string | null;
}> {
  const userId = await this.userId.textContent();
  const name = await this.nameText.textContent();
  const birthdate = await this.birthdateText.textContent();
  const gender = await this.genderText.textContent();
  const phone = await this.phoneText.textContent();
  const email = await this.emailText.textContent();
  const citizenId = await this.citizenIdText.textContent();
  const address = await this.addressText.textContent();

  return {
    userId,
    name,
    birthdate,
    gender,
    phone,
    email,
    citizenId,
    address
  };
}
async getInputProfileInfo(): Promise<{
  name: string;
  birthdate: string;
  gender: string;
  phone: string;
  email: string;
  fileName: string;
  address: string;
}> {
  const name = await this.inputFullName.inputValue();
  const birthdate = await this.inputBirthdate.inputValue();
  const gender = await this.selectGender.inputValue();
  const phone = await this.inputPhone.inputValue();
  const email = await this.inputEmail.inputValue();
  const fileName = await this.inputImage.evaluate(
  (el: HTMLInputElement) => el.files?.[0]?.name ?? ''
);
  const address = await this.inputAddress.inputValue();

  return {
    name,
    birthdate,
    gender,
    phone,
    email,
    fileName,
    address
  };
}

}
