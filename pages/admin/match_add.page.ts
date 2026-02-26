import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./base.page";

export class MatchAddPage extends BasePage {
  readonly matchDateInput: Locator;
  readonly descriptionInput: Locator;
  readonly leagueSelect: Locator;
  readonly roundSelect: Locator;
  readonly stadiumSelect: Locator;
  readonly team1Select: Locator;
  readonly team2Select: Locator;
  readonly submitBtn: Locator;

  constructor(page: Page) {
    super(page);

    this.matchDateInput = page.locator("#match_date");
    this.descriptionInput = page.locator('input[name="description"]');
    this.leagueSelect = page.locator("#leagueSelect");
    this.roundSelect = page.locator("#roundSelect");
    this.stadiumSelect = page.locator("#stadiumSelect");
    this.team1Select = page.locator("#team1Select");
    this.team2Select = page.locator("#team2Select");
    this.submitBtn = page.locator('#createMatchForm button[type="submit"]');
  }

  /**
   * Set ngày giờ trận đấu
   */
  async setMatchDate(datetime: string) {
    await this.matchDateInput.fill(datetime);
  }

  /**
   * Chọn giải đấu
   */
  async selectLeague(leagueName: string) {
    await this.leagueSelect.selectOption({ label: leagueName });
  }

  /**
   * Chọn vòng đấu
   */
  async selectRound(round: string) {
    await this.roundSelect.selectOption({ label: round });
  }

  /**
   * Chọn sân
   */
  async selectStadium(stadiumName: string) {
    await this.stadiumSelect.selectOption({ label: stadiumName });
  }

  /**
   * Chọn đội 1
   */
  async selectTeam1(teamName: string) {
    await this.team1Select.selectOption({ label: teamName });
  }

  /**
   * Chọn đội 2
   */
  async selectTeam2(teamName: string) {
    await this.team2Select.selectOption({ label: teamName });
  }

  /**
   * Điền mô tả
   */
  async setDescription(description: string) {
    await this.descriptionInput.fill(description);
  }

  /**
   * Submit form tạo trận đấu
   */
  async submit() {
    await this.submitBtn.click();
  }

  /**
   * Verify SweetAlert success
   */
  async verifySuccessAlert() {
    const title = this.page.locator(".swal2-title");
    await expect(title).toHaveText("Thành công");
  }

  /**
   * Verify SweetAlert error
   */
  async verifyErrorAlert(message: string) {
    const title = this.page.locator(".swal2-title");
    const content = this.page.locator(".swal2-html-container");

    await expect(title).toHaveText("Lỗi");
    await expect(content).toContainText(message);
  }

  /**
   * Load match add page
   */
  async load() {
    await this.page.goto("/pages/admin/events/add_match.html");
    await this.page.waitForSelector("#createMatchForm");
  }
}
