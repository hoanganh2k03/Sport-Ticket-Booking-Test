import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { BASE_URL } from "../../utils/config";
export class StadiumAddPage extends BasePage {
  // FORM FIELDS
  readonly stadiumCodeInput: Locator;
  readonly stadiumNameInput: Locator;
  readonly locationInput: Locator;

  // SECTION dynamic
  readonly sectionsContainer: Locator;
  readonly addSectionBtn: Locator;

  // SUBMIT
  readonly submitBtn: Locator;

  // SweetAlert2
  readonly swalPopup: Locator;
  readonly swalTitle: Locator;
  readonly swalContent: Locator;
  readonly swalConfirm: Locator;

  constructor(page: Page) {
    super(page);

    this.stadiumCodeInput = page.locator("input[name='stadium_code']");
    this.stadiumNameInput = page.locator("input[name='stadium_name']");
    this.locationInput = page.locator("input[name='location']");

    this.sectionsContainer = page.locator("#sectionsContainer");
    this.addSectionBtn = page.locator("button:has-text('Thêm khu vực')");

    this.submitBtn = page.locator("button[type='submit']");

    this.swalPopup = page.locator(".swal2-popup");
    this.swalTitle = page.locator(".swal2-title");
    this.swalContent = page.locator(".swal2-html-container");
    this.swalConfirm = page.locator(".swal2-confirm");
  }

  /** Navigate to add stadium page */
  async goto() {
    await this.page.goto(
      `${BASE_URL}/pages/admin/events/add_stadiums.html`
    );
  }

  /** Fill main stadium info */
  async fillMainInfo(code: string, name: string, location: string) {
    await this.stadiumCodeInput.fill(code);
    await this.stadiumNameInput.fill(name);
    await this.locationInput.fill(location);
  }

  /** Click "Thêm khu vực" */
  async addSection() {
    await this.addSectionBtn.click();
  }

  /**
   * Fill section at index
   * index = 0,1,2...
   */
  async fillSection(index: number, sectionName: string, capacity: string) {
    const sectionRow = this.sectionsContainer.locator(".row").nth(index);

    await sectionRow
      .locator(`input[name='section_name_${index}']`)
      .fill(sectionName);

    await sectionRow
      .locator(`input[name='capacity_${index}']`)
      .fill(capacity);
  }

  /** Remove section at index */
  async removeSection(index: number) {
    const sectionRow = this.sectionsContainer.locator(".row").nth(index);
    await sectionRow.locator("button.btn-danger").click();
  }

  /** Submit create stadium form */
  async submit() {
    await this.submitBtn.click();
  }

  /** Expect success popup */
  async expectSuccess(message: string) {
    await expect(this.swalPopup).toBeVisible();
    await expect(this.swalTitle).toHaveText("Thành công");
    await expect(this.swalContent).toContainText(message);
    await this.swalConfirm.click();
  }

  /** Expect error popup */
  async expectError(message: string) {
    await expect(this.swalPopup).toBeVisible();
    await expect(this.swalTitle).toHaveText("Lỗi");
    await expect(this.swalContent).toContainText(message);
    await this.swalConfirm.click();
  }
}
