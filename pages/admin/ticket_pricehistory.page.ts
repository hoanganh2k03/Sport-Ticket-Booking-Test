import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export class TicketPriceHistoryPage extends BasePage {
  // Search
  readonly ticketSearchInput: Locator;

  // Table + rows (render bởi DataTables)
  readonly priceHistoryTable: Locator;
  readonly tableRows: Locator;

  // Nút quay lại
  readonly btnBack: Locator;

  constructor(page: Page) {
    super(page);

    // Search input
    this.ticketSearchInput = page.locator("#ticketSearchInput");

    // Table (DataTables tự render)
    this.priceHistoryTable = page.locator("#priceHistoryTable");
    this.tableRows = page.locator("#priceHistoryTable tbody tr");

    // Back button
    this.btnBack = page.locator("#btnBack");
  }

  // 👉 Navigate page
  async goto() {
    await this.page.goto(`${this.basePagesUrl}/tickets/price-histories.html`);
  }

  // 👉 Search filter
  async searchTicket(text: string) {
    await this.ticketSearchInput.fill(text);
  }

  // 👉 Click back button
  async clickBack() {
    await this.btnBack.click();
  }

  // 👉 Get number of rows
  async getRowCount() {
    return await this.tableRows.count();
  }

  // 👉 Get full table text (debug / assert)
  async getTableText() {
    return await this.priceHistoryTable.innerText();
  }

  // 👉 Wait DataTables loaded
  async waitForTableLoaded() {
    // DataTables thêm <td> sau khi load
    await this.page.waitForSelector("#priceHistoryTable tbody tr td");
  }

  // 👉 Get values from a row
  async getRowData(rowIndex: number) {
    const row = this.tableRows.nth(rowIndex);
    const cells = row.locator("td");
    const count = await cells.count();

    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(await cells.nth(i).innerText());
    }

    return result;
  }
}
