import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./base.page";

export class MatchPage extends BasePage {
  readonly searchInput: Locator;
  readonly tableRows: Locator;

  constructor(page: Page) {
    super(page);

    this.searchInput = page.locator("#searchMatchInput");
    this.tableRows = page.locator("#matchTable tbody tr");
  }

  /**
   * Tìm kiếm theo term (dùng DataTables search)
   */
  async search(term: string) {
    await this.searchInput.fill(term);
    await this.page.evaluate(() => {
      ($('#matchTable') as any).DataTable().search((document.getElementById('searchMatchInput') as HTMLInputElement).value).draw();
    });
  }

  /**
   * Click update trận đấu theo matchId
   */
  async clickUpdate(matchId: number) {
    const btn = this.page.locator(`#matchTable tbody tr >> text=${matchId}`).locator('button:has-text("Cập nhật")');
    await btn.click();
  }

  /**
   * Click xóa trận đấu theo matchId
   */
  async clickDelete(matchId: number) {
    const btn = this.page.locator(`#matchTable tbody tr >> text=${matchId}`).locator('button:has-text("Xóa")');
    await btn.click();
  }

  /**
   * Verify table row count
   */
  async expectRowCount(count: number) {
    await expect(this.tableRows).toHaveCount(count);
  }

  /**
   * Load match page (giống loadMatchPage)
   */
  async loadMatchPage() {
    await this.page.goto("/pages/admin/events/match.html");
    await this.page.waitForSelector("#matchTable tbody tr");
  }

  /**
   * Update match via SweetAlert2 form
   * (giống showUpdateMatchForm)
   */
  async updateMatch(matchId: number, description: string, stadiumName: string, matchTime: string) {
    await this.clickUpdate(matchId);

    // Điền form trong SweetAlert2
    const descriptionInput = this.page.locator(".swal2-container input#edit-description");
    const stadiumSelect = this.page.locator(".swal2-container select#edit-stadium");
    const matchTimeInput = this.page.locator(".swal2-container input#edit-match-time");
    const confirmBtn = this.page.locator(".swal2-container .swal2-confirm");

    await descriptionInput.fill(description);
    await stadiumSelect.selectOption({ label: stadiumName });
    await matchTimeInput.fill(matchTime);
    await confirmBtn.click();
  }

  /**
   * Update match history (trận đang mở bán)
   */
  async updateMatchHistory(matchId: number, description: string, matchTime: string, reason: string) {
    // Mở form lịch sử
    await this.page.evaluate((id) => {
      (window as any).showUpdateMatchHistoryForm(id);
    }, matchId);

    const descriptionInput = this.page.locator(".swal2-container input#edit-description");
    const matchTimeInput = this.page.locator(".swal2-container input#edit-match-time");
    const reasonInput = this.page.locator(".swal2-container input#edit-reason");
    const confirmBtn = this.page.locator(".swal2-container .swal2-confirm");

    await descriptionInput.fill(description);
    await matchTimeInput.fill(matchTime);
    await reasonInput.fill(reason);
    await confirmBtn.click();
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
}
