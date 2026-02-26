import { Page, Locator, expect } from "@playwright/test";
import {BasePage} from "./base.page";
import {createHeaderMap} from "../../utils/uiHelpers";
export default class CustomerPage extends BasePage {
  // Table & pagination
  readonly table: Locator;
  readonly tableRows: Locator;
  readonly pagination: Locator;
  readonly loading: Locator;
  // Filter inputs
  readonly searchInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly fromDate: Locator;
  readonly toDate: Locator;
  readonly btnFilter: Locator;
  readonly btnReset: Locator;

  // Modal Thêm/Sửa
  readonly modal: Locator;
  readonly modalTitle: Locator;
  readonly inputFullName: Locator;
  readonly inputEmail: Locator;
  readonly inputPhone: Locator;
  readonly inputId: Locator;
  readonly btnModalSave: Locator;
  readonly btnModalClose: Locator;

  // Add button
  readonly btnAdd: Locator;

  // Confirm delete modal
  readonly confirmModal: Locator;
  readonly confirmText: Locator;
  readonly btnConfirmDelete: Locator;
  constructor(page: Page) {
    super(page);
    this.loading = page.locator("#table-loading, .loading, .spinner-border").first();
    // Table
    this.table = page.locator("#customerTable");
    this.tableRows = this.table.locator("tbody tr");
    this.pagination = page.locator(".pagination");

    // Filters
    this.searchInput = page.locator("#searchInput");
    this.emailInput = page.locator("#emailFilter");
    this.phoneInput = page.locator("#phoneFilter");
    this.fromDate = page.locator("#fromDate");
    this.toDate = page.locator("#toDate");
    this.btnFilter = page.locator("#btnFilter");
    this.btnReset = page.locator("#btnReset");

    // Add/Edit Modal
    this.modal = page.locator("#customerModal");
    this.modalTitle = page.locator("#modalTitle");
    this.inputFullName = page.locator("#fullName");
    this.inputEmail = page.locator("#email");
    this.inputPhone = page.locator("#phone");
    this.inputId = page.locator("#customerId");
    this.btnModalSave = page.locator("#customerForm >> button[type='submit']");
    this.btnModalClose = page.locator("#customerModal .btn-close, #customerModal button.btn-outline-secondary");

    // Add button
    this.btnAdd = page.locator("#btnAdd");

    // Confirm delete modal
    this.confirmModal = page.locator("#confirmModal.show");
    this.confirmText = page.locator("#confirmModal.show #confirmText");
    this.btnConfirmDelete = page.locator("#confirmModal.show #confirmBtn");
  }
  async goto() {
    await this.page.goto(`${this.basePagesUrl}/base.html`);
            const [empResp] = await Promise.all([
  this.page.waitForResponse(res => res.url().includes('/api/accounts/staff/customers')),
  this.sidebar.clickCustomers()
]);
expect(empResp.status()).toBe(200);
    }
     async waitForLoading() {
    // Nếu có loading thì đợi mất
    if (await this.loading.isVisible({ timeout: 500 }).catch(() => false)) {
      await this.loading.waitFor({ state: "detached" });
    }
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
  async openAddModal() {
    await this.btnAdd.click();
    await expect(this.modal).toBeVisible();
  }

  async openEditModalByRow(index: number) {
    await this.tableRows.nth(index).locator("button[data-action='edit']").click();
    await expect(this.modal).toBeVisible();
  }

  async fillCustomerForm(data: { fullName?: string; email?: string; phone?: string }) {
    if (data.fullName) await this.inputFullName.fill(data.fullName);
    if (data.email) await this.inputEmail.fill(data.email);
    if (data.phone) await this.inputPhone.fill(data.phone);
  }

  async submitModal() {
    await this.btnModalSave.click();
    await expect(this.modal).toBeHidden();
  }

  async closeModal() {
    await this.btnModalClose.first().click();
    await expect(this.modal).toBeHidden();
  }

  async deleteCustomerByRow(index: number) {
    const row = this.tableRows.nth(index);
    await row.locator("button[data-action='delete']").click();
    await expect(this.confirmModal).toBeVisible();
    await this.btnConfirmDelete.click();
    await expect(this.confirmModal).toBeHidden();
  }

  async applyFilters(filters: { name?: string; email?: string; phone?: string; from?: string; to?: string }) {
    if (filters.name !== undefined) await this.searchInput.fill(filters.name);
    if (filters.email !== undefined) await this.emailInput.fill(filters.email);
    if (filters.phone !== undefined) await this.phoneInput.fill(filters.phone);
    if (filters.from !== undefined) await this.fromDate.fill(filters.from);
    if (filters.to !== undefined) await this.toDate.fill(filters.to);
    await this.btnFilter.click();
  }

  async resetFilters() {
    await this.btnReset.click();
  }

  async getRowCount() {
    return await this.tableRows.count();
  }

  async getCustomerInfoByRow(index: number) {
    const headerMap = await this.getHeaderMap();

    const row = this.tableRows.nth(index);
    return {
      id: await row.locator("td").nth(headerMap.get("ID") ?? 0).innerText(),
      fullName: await row.locator("td").nth(headerMap.get("HỌ & TÊN") ?? 1).innerText(),
      email: await row.locator("td").nth(headerMap.get("EMAIL") ?? 2).innerText(),
      phone: await row.locator("td").nth(headerMap.get("SĐT") ?? 3).innerText(),
      createdAt: await row.locator("td").nth(headerMap.get("NGÀY TẠO") ?? 4).innerText(),
    };
  }

  async gotoPage(pageNumber: number) {
    await this.pagination.locator("li >> text='" + pageNumber + "'").click();
  }
}
