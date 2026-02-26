import { expect, Locator, Page } from "@playwright/test";
import {BasePage} from "./base.page";

export default class LeagueAddPage extends BasePage {
  readonly page: Page;

  readonly inputName: Locator;
  readonly selectType: Locator;
  readonly startDate: Locator;
  readonly endDate: Locator;
  readonly submitBtn: Locator;

  // SweetAlert2
  readonly swalConfirmBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.inputName = page.locator("#league_name");
    this.selectType = page.locator("#league_type");
    this.startDate = page.locator("#start_date");
    this.endDate = page.locator("#end_date");
    this.submitBtn = page.locator('button[type="submit"]');

    this.swalConfirmBtn = page.locator(".swal2-confirm");
  }

  /** -------------------------
   * PAGE ACTIONS
   * ------------------------*/

  async gotoAddLeaguePage() {
    await this.page.goto("/pages/admin/events/add_leagues.html");
    await expect(this.inputName).toBeVisible();
  }

  async enterLeagueName(name: string) {
    await this.inputName.fill(name);
  }

  async selectLeagueType(type: string | number) {
    await this.selectType.selectOption(type.toString());
  }

  async pickStartDate(date: string) {
    await this.startDate.fill(date);
  }

  async pickEndDate(date: string) {
    await this.endDate.fill(date);
  }

  async submitForm() {
    await this.submitBtn.click();
  }

  async confirmSuccessAlert() {
    await expect(this.swalConfirmBtn).toBeVisible();
    await this.swalConfirmBtn.click();
  }
}
