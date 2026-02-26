import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";
export class TicketAddPage extends BasePage {

  // Toolbar
  readonly searchInput: Locator;
  readonly matchTypeFilter: Locator;
  readonly pageSizeSelect: Locator;
  readonly startDateInput: Locator;
  readonly endDateInput: Locator;

  // Table + Rows
  readonly matchesTable: Locator;
  readonly tableRows: Locator;
  readonly createTicketButtons: Locator;

  // Pagination
  readonly pagination: Locator;
  readonly paginationInfo: Locator;

  // Content container (nơi load chi tiết)
  readonly contentContainer: Locator;

  // (OPTIONAL) Loading (nếu HTML không có thì locator vẫn được tạo)
  readonly tableLoading: Locator;

  constructor(page: Page) {
    super(page);

    // Toolbar
    this.searchInput = page.locator("#matchSearchInput");
    this.matchTypeFilter = page.locator("#matchTypeFilter");
    this.pageSizeSelect = page.locator("#pageSize");
    this.startDateInput = page.locator("#startDate");
    this.endDateInput = page.locator("#endDate");

    // Table
    this.matchesTable = page.locator("#matchesTable");
    this.tableRows = page.locator("#matchesTable tbody tr");

    // Mỗi dòng sẽ có nút Tạo vé, giả sử class "btn-create-ticket"
    this.createTicketButtons = page.locator("button >> text=Tạo vé");

    // Pagination
    this.pagination = page.locator("#pagination");
    this.paginationInfo = page.locator("#paginationInfo");

    // Content container
    this.contentContainer = page.locator("#content-container");

    // Optional loading (nếu sau này bạn thêm loader)
    this.tableLoading = page.locator("#table-loading, .table-loading");
  }

  // 👉 Function search match
  async searchMatch(text: string) {
    await this.searchInput.fill(text);
  }

  // 👉 Filter match
  async filterMatch(type: string) {
    await this.matchTypeFilter.selectOption(type);
  }

  // 👉 Select page size
  async selectPageSize(size: string) {
    await this.pageSizeSelect.selectOption(size);
  }

  // 👉 Click “Tạo vé” của một dòng nào đó
  async clickCreateTicketAt(index: number) {
    await this.createTicketButtons.nth(index).click();
  }

  // 👉 Wait loading disappear (optional)
  async waitForTableLoaded() {
    await this.tableLoading.waitFor({ state: "detached", timeout: 3000 }).catch(() => {});
  }
}
