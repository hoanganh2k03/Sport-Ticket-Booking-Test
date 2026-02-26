import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./base.page";

export class MatchHistoryPage extends BasePage {
  readonly searchInput: Locator;
  readonly tableRows: Locator;
  readonly btnBack: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator("#matchHistorySearchInput");
    this.tableRows = page.locator("#matchHistoryTable tbody tr");
    this.btnBack = page.locator("#btnBack");
  }

  /**
   * Load trang lịch sử trận
   */
  async load() {
    await this.page.goto("/pages/admin/events/match_history.html");
    await this.page.waitForSelector("#matchHistoryTable");
    await this.waitForTableLoaded();
  }

  /**
   * Chờ bảng render xong (ít nhất 1 hàng)
   */
  async waitForTableLoaded() {
    await this.page.waitForFunction(() => {
      const tbody = document.querySelector("#matchHistoryTable tbody");
      return tbody && tbody.children.length > 0;
    });
  }

  /**
   * Tìm kiếm theo mã trận hoặc nhân viên
   */
  async search(keyword: string) {
    await this.searchInput.fill(keyword);
    // DataTable redraw delay
    await this.page.waitForTimeout(300);
  }

  /**
   * Lấy số lượng hàng hiện tại trong bảng
   */
  async getRowCount(): Promise<number> {
    return await this.tableRows.count();
  }

  /**
   * Lấy dữ liệu hàng theo index
   */
  async getRowData(rowIndex: number) {
    const row = this.tableRows.nth(rowIndex);
    const cells = row.locator("td");
    const cellCount = await cells.count();
    const data: string[] = [];
    for (let i = 0; i < cellCount; i++) {
      data.push((await cells.nth(i).innerText()).trim());
    }
    return data;
  }

  /**
   * Click nút quay lại
   */
  async clickBack() {
    await this.btnBack.click();
  }
}
