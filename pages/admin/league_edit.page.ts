import { expect, Locator, Page } from "@playwright/test";
import {BasePage} from "./base.page";

export default class LeagueEditPage extends BasePage {
  readonly leagueName: Locator;
  readonly leagueType: Locator;
  readonly startDate: Locator;
  readonly endDate: Locator;
  readonly submitBtn: Locator;

  constructor(page: Page) {
    super(page);

    this.leagueName = page.locator("#leagueName");
    this.leagueType = page.locator("#leagueType");
    this.startDate = page.locator("#startDate");
    this.endDate = page.locator("#endDate");
    this.submitBtn = page.locator('button[type="submit"]');
  }

  /**
   * Mở trang edit với ID
   */
  async navigate(id: number | string) {
    await this.page.goto(
      `/pages/admin/events/league_edit.html?id=${id}`,
      { waitUntil: "domcontentloaded" }
    );
  }

  /**
   * Load data từ API vào form – giống behaviour HTML
   */
  async loadLeagueData() {
    await expect(this.leagueName).toBeVisible();

    // Chờ browser fetch xong và điền form
    await this.page.waitForFunction(() => {
      const name = (document.querySelector("#leagueName") as HTMLInputElement)?.value;
      return name && name.trim().length > 0;
    });

    // Kiểm tra value được đổ đúng
    await expect(this.leagueName).not.toHaveValue("");
    await expect(this.leagueType).not.toHaveValue("");
  }

  /**
   * Điền form edit league
   */
  async fillLeagueForm({
    league_name,
    league_type,
    start_date,
    end_date
  }: {
    league_name: string;
    league_type: number | string;
    start_date: string;
    end_date: string;
  }) {
    await this.leagueName.fill(league_name);
    await this.leagueType.selectOption(String(league_type));
    await this.startDate.fill(start_date);
    await this.endDate.fill(end_date);
  }

  /**
   * Submit form
   */
  async submitForm() {
    await this.submitBtn.click();
  }

  /**
   * Validate lỗi Swal
   */
  async expectSwalError(message: string) {
    const swal = this.page.locator(".swal2-popup");
    await expect(swal).toBeVisible();
    await expect(swal).toContainText(message);
  }

  /**
   * Validate Swal success
   */
  async expectSwalSuccess() {
    const swal = this.page.locator(".swal2-popup");
    await expect(swal).toBeVisible();
    await expect(swal).toContainText("Thành công");
  }
}
