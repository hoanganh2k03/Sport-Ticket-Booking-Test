import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./base.page";

export class StadiumEditPage extends BasePage {
  readonly stadiumCode: Locator;
  readonly stadiumName: Locator;
  readonly stadiumLocation: Locator;
  readonly submitBtn: Locator;

  constructor(page: Page) {
    super(page);

    this.stadiumCode = this.page.locator("#stadiumCode");
    this.stadiumName = this.page.locator("#stadiumName");
    this.stadiumLocation = this.page.locator("#stadiumLocation");
    this.submitBtn = this.page.locator('button[type="submit"]');
  }

  /**
   * Load stadium data from API auto-filled into form
   */
  async waitForStadiumDataLoaded() {
    // Chờ input được fill bởi JS fetch
    await expect(this.stadiumCode).toBeVisible();

    await this.page.waitForFunction(() => {
      const code = (document.querySelector("#stadiumCode") as HTMLInputElement)?.value;
      return code && code.trim().length > 0;
    });

    await expect(this.stadiumName).not.toHaveValue("");
    await expect(this.stadiumLocation).not.toHaveValue("");
  }

  /**
   * Fill stadium form
   */
  async fillStadiumForm(stadium: {
    code: string;
    name: string;
    location: string;
  }) {
    await this.stadiumCode.fill(stadium.code);
    await this.stadiumName.fill(stadium.name);
    await this.stadiumLocation.fill(stadium.location);
  }

  /**
   * Click submit update
   */
  async submit() {
    await this.submitBtn.click();
  }

  /**
   * Verify SweetAlert success popup
   */
  async verifySuccessAlert() {
    const swalTitle = this.page.locator(".swal2-title");
    await expect(swalTitle).toHaveText("Thành công");
  }

  /**
   * Verify SweetAlert error popup
   */
  async verifyErrorAlert(message: string) {
    const swalTitle = this.page.locator(".swal2-title");
    const swalContent = this.page.locator(".swal2-html-container");

    await expect(swalTitle).toHaveText("Lỗi");
    await expect(swalContent).toContainText(message);
  }
}
