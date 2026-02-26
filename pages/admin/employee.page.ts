import { Locator, Page, expect } from "@playwright/test";
import {BasePage} from "./base.page";
import {createHeaderMap} from "../../utils/uiHelpers";
export default class EmployeePage extends BasePage {
  readonly table: Locator;
  readonly tableRows: Locator;
  readonly loading: Locator;

  // Modal
  readonly modal: Locator;
  readonly modalTitle: Locator;
  readonly modalSaveBtn: Locator;
  readonly modalCloseBtn: Locator;

  // Form fields
  readonly employeeIdInput: Locator;
  readonly nameInput: Locator;
  readonly citizenIdInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly dateOfBirthInput: Locator;
  readonly genderSelect: Locator;
  readonly roleSelect: Locator;
  readonly imageInput: Locator;
  readonly addressInput: Locator;

  // Buttons
  readonly addBtn: Locator;
  readonly editBtns: Locator;
  readonly lockBtns: Locator;     // Khóa (lock icon)
  readonly unlockBtns: Locator;   // Kích hoạt (unlock icon)

  // Lock confirmation modal
  readonly confirmDisableModal: Locator;
  readonly confirmDisableBtn: Locator;

  constructor(page: Page) {
    super(page);

    // Table
    this.table = page.locator("table");
    this.tableRows = page.locator("table tbody tr");
    this.loading = page.locator("#table-loading, .loading, .spinner-border").first();

    // Modal
    this.modal = page.locator(".modal.show");
    this.modalTitle = this.modal.locator(".modal-title");
    this.modalSaveBtn = this.modal.locator("button:has-text('Lưu')");
    this.modalCloseBtn = this.modal.locator("button:has-text('Hủy'), .btn-close");

    // Form
    this.employeeIdInput = page.locator("#employeeId");
    this.nameInput = page.locator("#fullName");
    this.citizenIdInput = page.locator("#citizenId");
    this.emailInput = page.locator("#email");
    this.phoneInput = page.locator("#phoneNumber");
    this.dateOfBirthInput = page.locator("#dateOfBirth");
    this.genderSelect = page.locator("#gender");
    this.roleSelect = page.locator("#role");
    this.imageInput = page.locator("#image");
    this.addressInput = page.locator("#address");

    // Action Buttons
    this.addBtn = page.locator("button:has-text('Thêm nhân viên')");
    this.editBtns = page.locator("button[title='Sửa']");
    this.lockBtns = page.locator("button[title='Khóa']");
    this.unlockBtns = page.locator("button[title='Kích hoạt']");

    // Lock confirmation modal
    this.confirmDisableModal = page.locator("#confirmDisableModal");
    this.confirmDisableBtn = page.locator("#confirmDisableBtn");
  }

    async goto() {
    await this.page.goto(`${this.basePagesUrl}/base.html`);
            const [empResp] = await Promise.all([
  this.page.waitForResponse(res => res.url().includes('/api/accounts/employees')),
  this.sidebar.clickEmployees()
]);
expect(empResp.status()).toBe(200);
    }
  // ==========================
  // ACTION METHODS
  // ==========================
  async getHeaderMap() {
    const headerMap = await createHeaderMap(this.table);
    const uppercaseMap = new Map<string, number>();
    headerMap.forEach((value, key) => {
      uppercaseMap.set(key.toUpperCase(), value);
    });
    return uppercaseMap;
  }
  async waitForLoading() {
    // Nếu có loading thì đợi mất
    if (await this.loading.isVisible({ timeout: 500 }).catch(() => false)) {
      await this.loading.waitFor({ state: "detached" });
    }
  }

  async openAddModal() {
    await this.addBtn.click();
    await expect(this.modal).toBeVisible();
  }

  async openEditModal(index: number = 0) {
    await this.editBtns.nth(index).click();
    await expect(this.modal).toBeVisible();
  }

  async fillEmployeeForm(data: {
    id?: string;
    name?: string;
    citizenId?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string; // yyyy-mm-dd
    gender?: string | number;
    role?: string;
    imagePath?: string; // local path to file for upload
    address?: string;
  }) {
    if (data.id) await this.employeeIdInput.fill(String(data.id));
    if (data.name) await this.nameInput.fill(data.name);
    if (data.citizenId) await this.citizenIdInput.fill(data.citizenId);
    if (data.email) await this.emailInput.fill(data.email);
    if (data.phone) await this.phoneInput.fill(data.phone);
    if (data.dateOfBirth) await this.dateOfBirthInput.fill(data.dateOfBirth);
    if (data.gender !== undefined) await this.genderSelect.selectOption(String(data.gender));
    if (data.role) await this.roleSelect.selectOption(data.role);
    if (data.imagePath) await this.imageInput.setInputFiles(data.imagePath);
    if (data.address) await this.addressInput.fill(data.address);
  }

  async saveModal() {
    await this.modalSaveBtn.click();
    await expect(this.modal).toBeHidden();
  }

  async lockEmployee(index: number = 0) {
    await this.lockBtns.nth(index).click();
    await expect(this.confirmDisableModal).toBeVisible();
  }

  async confirmLock() {
    await this.confirmDisableBtn.click();
    await expect(this.confirmDisableModal).toBeHidden();
  }

  async unlockEmployee(index: number = 0) {
    await this.unlockBtns.nth(index).click();
    // No confirmation modal for unlock
  }

  async getRowCount() {
    await this.waitForLoading();
    return await this.tableRows.count();
  }

  async getEmployeeNameAt(index: number) {
    const headerMap = await this.getHeaderMap();
    return await this.tableRows.nth(index).locator("td").nth(headerMap.get("HỌ & TÊN") ?? 1).innerText();
  }
}
