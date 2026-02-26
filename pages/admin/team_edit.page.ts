import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class TeamEditPage extends BasePage {
  readonly teamName: Locator;
  readonly headCoach: Locator;
  readonly description: Locator;
  readonly submitBtn: Locator;

  readonly swalPopup: Locator;
  readonly swalTitle: Locator;
  readonly swalHtml: Locator;
  readonly swalConfirmBtn: Locator;

  constructor(page: Page) {
    super(page);

    this.teamName = page.locator("#team_name");
    this.headCoach = page.locator("#head_coach");
    this.description = page.locator("#description");
    this.submitBtn = page.locator("button[type='submit']");

    this.swalPopup = page.locator(".swal2-popup");
    this.swalTitle = page.locator(".swal2-title");
    this.swalHtml = page.locator(".swal2-html-container");
    this.swalConfirmBtn = page.locator(".swal2-confirm");
  }

  /** Load existing team info (wait until API fills form) */
  async waitForTeamLoaded() {
    await expect(this.teamName).toBeVisible();

    // Chờ JS load data vào input
    await this.page.waitForFunction(() => {
      const value = (document.querySelector("#team_name") as HTMLInputElement)?.value;
      return value && value.trim().length > 0;
    });
  }

  /** Fill form */
  async fillForm(name: string, coach: string, desc: string) {
    await this.teamName.fill(name);
    await this.headCoach.fill(coach);
    await this.description.fill(desc);
  }

  /** Click save */
  async submitForm() {
    await this.submitBtn.click();
  }

  /** Wait SweetAlert appears */
  async waitForSwal() {
    await expect(this.swalPopup).toBeVisible();
  }

  /** Expect success */
  async expectSuccess(msg: string = "Cập nhật đội bóng thành công!") {
    await this.waitForSwal();
    await expect(this.swalTitle).toHaveText("Thành công");
    await expect(this.swalHtml).toContainText(msg);
    await this.swalConfirmBtn.click();
  }

  /** Expect fail with message */
  async expectFailContains(text: string) {
    await this.waitForSwal();
    await expect(this.swalTitle).toHaveText("Lỗi");
    await expect(this.swalHtml).toContainText(text);
    await this.swalConfirmBtn.click();
  }

  /** Full update flow */
  async updateTeam(name: string, coach: string, desc: string) {
    await this.fillForm(name, coach, desc);
    await this.submitForm();
  }
}
