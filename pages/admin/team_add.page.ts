import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class TeamAddPage extends BasePage {
  readonly teamName: Locator;
  readonly headCoach: Locator;
  readonly description: Locator;
  readonly submitBtn: Locator;

  // SweetAlert locators
  readonly swalPopup: Locator;
  readonly swalTitle: Locator;
  readonly swalConfirmBtn: Locator;

  constructor(page: Page) {
    super(page);

    this.teamName = page.locator("#team_name");
    this.headCoach = page.locator("#head_coach");
    this.description = page.locator("#description");
    this.submitBtn = page.locator("button[type='submit']");

    // SweetAlert2 popup
    this.swalPopup = page.locator(".swal2-popup");
    this.swalTitle = page.locator(".swal2-title");
    this.swalConfirmBtn = page.locator(".swal2-confirm");
  }

  /** Fill form */
  async fillTeamForm(name: string, coach: string, desc: string) {
    await this.teamName.fill(name);
    await this.headCoach.fill(coach);
    await this.description.fill(desc);
  }

  /** Click submit */
  async submitForm() {
    await this.submitBtn.click();
  }

  /** Wait SweetAlert appear */
  async waitForSwal() {
    await expect(this.swalPopup).toBeVisible();
  }

  /** Verify success */
  async expectSuccess(message: string = "Đội bóng đã được tạo!") {
    await this.waitForSwal();
    await expect(this.swalTitle).toHaveText("Thành công");
    await this.swalConfirmBtn.click();
  }

  /** Verify fail (team exists...) */
  async expectFail(errorMessage: string) {
    await this.waitForSwal();
    await expect(this.swalTitle).toHaveText("Lỗi");
    await expect(this.page.locator(".swal2-html-container")).toContainText(errorMessage);
    await this.swalConfirmBtn.click();
  }

  /** Create team end-to-end */
  async createTeam(name: string, coach: string, desc: string) {
    await this.fillTeamForm(name, coach, desc);
    await this.submitForm();
  }
}
