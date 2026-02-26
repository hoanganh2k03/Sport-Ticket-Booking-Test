import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class StadiumPage extends BasePage {
  // FORM INPUT
  readonly nameInput: Locator;
  readonly locationInput: Locator;
  readonly capacityInput: Locator;
  readonly descriptionInput: Locator;

  readonly submitBtn: Locator;

  // TABLE
  readonly searchInput: Locator;
  readonly tableRows: Locator;

  // DELETE CONFIRM POPUP (SweetAlert2)
  readonly swalPopup: Locator;
  readonly swalTitle: Locator;
  readonly swalContent: Locator;
  readonly swalConfirm: Locator;
  readonly swalCancel: Locator;

  constructor(page: Page) {
    super(page);

    // Form fields
    this.nameInput = page.locator("#stadium_name");
    this.locationInput = page.locator("#location");
    this.capacityInput = page.locator("#capacity");
    this.descriptionInput = page.locator("#description");

    this.submitBtn = page.locator("button[type='submit']");

    // Table
    this.searchInput = page.locator("#searchStadiumInput");
    this.tableRows = page.locator("table tbody tr");

    // SweetAlert2 popup
    this.swalPopup = page.locator(".swal2-popup");
    this.swalTitle = page.locator(".swal2-title");
    this.swalContent = page.locator(".swal2-html-container");
    this.swalConfirm = page.locator(".swal2-confirm");
    this.swalCancel = page.locator(".swal2-cancel");
  }

  /** Navigate */
  async gotoListPage() {
    await this.page.goto("http://127.0.0.1:5500/pages/admin/base.html#events/stadiums");
  }

  /** Fill form */
  async fillForm(name: string, location: string, capacity: string, description: string) {
    await this.nameInput.fill(name);
    await this.locationInput.fill(location);
    await this.capacityInput.fill(capacity);
    await this.descriptionInput.fill(description);
  }

  /** Submit form */
  async submit() {
    await this.submitBtn.click();
  }

  /** Expect success alert */
  async expectSuccess(message: string) {
    await expect(this.swalPopup).toBeVisible();
    await expect(this.swalTitle).toHaveText("Thành công");
    await expect(this.swalContent).toContainText(message);
    await this.swalConfirm.click();
  }

  /** Expect error alert */
  async expectError(message: string) {
    await expect(this.swalPopup).toBeVisible();
    await expect(this.swalTitle).toHaveText("Lỗi");
    await expect(this.swalContent).toContainText(message);
    await this.swalConfirm.click();
  }

  /** Search Stadium */
  async search(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchInput.press("Enter");
    await this.page.waitForTimeout(300); // đợi filter
  }

  /** Click Edit by name */
  async clickEdit(stadiumName: string) {
    const row = this.page.locator(`//tr[td[contains(text(),'${stadiumName}')]]`);
    await row.locator(".edit-btn").click();
  }

  /** Click Delete by name */
  async clickDelete(stadiumName: string) {
    const row = this.page.locator(`//tr[td[contains(text(),'${stadiumName}')]]`);
    await row.locator(".btn-delete").click();
  }

  /** Confirm Delete */
  async confirmDelete() {
    await this.swalConfirm.click();
  }

  /** Cancel Delete */
  async cancelDelete() {
    await this.swalCancel.click();
  }

  /** Verify row exists */
  async expectRowExist(stadiumName: string) {
    await expect(
      this.page.locator(`//tr[td[contains(text(),'${stadiumName}')]]`)
    ).toBeVisible();
  }

  /** Verify row not exist */
  async expectRowNotExist(stadiumName: string) {
    await expect(
      this.page.locator(`//tr[td[contains(text(),'${stadiumName}')]]`)
    ).toHaveCount(0);
  }
}
