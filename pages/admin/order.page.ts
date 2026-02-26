import { Locator, Page, expect } from "@playwright/test";
import {BasePage} from "./base.page";

export default class OrdersPage extends BasePage {
  readonly btnAddOrder: Locator;
  readonly filterKeyword: Locator;
  readonly filterStatus: Locator;
  readonly filterMethod: Locator;
  readonly filterFrom: Locator;
  readonly filterTo: Locator;
  readonly filterTournament: Locator;
  readonly filterMatch: Locator;
  readonly btnFilter: Locator;
  readonly btnReset: Locator;

  readonly tableBody: Locator;
  readonly pagination: Locator;

  // Detail Modal
  readonly modalDetail: Locator;
  readonly detailOrderId: Locator;
  readonly detailUser: Locator;
  readonly detailAmount: Locator;
  readonly detailStatus: Locator;
  readonly detailMethod: Locator;
  readonly detailDate: Locator;

  readonly detailMatchDesc: Locator;
  readonly detailMatchLeague: Locator;
  readonly detailMatchStadium: Locator;
  readonly detailMatchTeam1: Locator;
  readonly detailMatchTeam2: Locator;
  readonly detailMatchRound: Locator;
  readonly detailMatchTime: Locator;

  readonly payTableBody: Locator;
  readonly detailItems: Locator;

  // Add order modal
  readonly modalAddOrder: Locator;
  readonly customerInput: Locator;
  readonly customerDatalist: Locator;
  readonly btnAddCustomer: Locator;
  readonly btnNextOrder: Locator;

  constructor(page: Page) {
    super(page);

    this.btnAddOrder = page.locator("#btnAddOrder");

    // Filters
    this.filterKeyword = page.locator("#filterKeyword");
    this.filterStatus = page.locator("#filterStatus");
    this.filterMethod = page.locator("#filterMethod");
    this.filterFrom = page.locator("#filterFrom");
    this.filterTo = page.locator("#filterTo");
    this.filterTournament = page.locator("#filterTournament");
    this.filterMatch = page.locator("#filterMatch");

    this.btnFilter = page.locator("#btnFilter");
    this.btnReset = page.locator("#btnReset");

    // Table
    this.tableBody = page.locator("#orderTableBody");
    this.pagination = page.locator("#pagination");

    // Detail modal
    this.modalDetail = page.locator("#detailModal");
    this.detailOrderId = page.locator("#detailOrderId");
    this.detailUser = page.locator("#detailUser");
    this.detailAmount = page.locator("#detailAmount");
    this.detailStatus = page.locator("#detailStatus");
    this.detailMethod = page.locator("#detailMethod");
    this.detailDate = page.locator("#detailDate");

    this.detailMatchDesc = page.locator("#detailMatchDesc");
    this.detailMatchLeague = page.locator("#detailMatchLeague");
    this.detailMatchStadium = page.locator("#detailMatchStadium");
    this.detailMatchTeam1 = page.locator("#detailMatchTeam1");
    this.detailMatchTeam2 = page.locator("#detailMatchTeam2");
    this.detailMatchRound = page.locator("#detailMatchRound");
    this.detailMatchTime = page.locator("#detailMatchTime");

    this.payTableBody = page.locator("#payTableBody");
    this.detailItems = page.locator("#detailItems");

    // Add order modal
    this.modalAddOrder = page.locator("#addOrderModal");
    this.customerInput = page.locator("#customerInput");
    this.customerDatalist = page.locator("#customerDatalist");
    this.btnAddCustomer = page.locator("#btnAddCustomer");
    this.btnNextOrder = page.locator("#btnNextOrder");
  }
  async goto() {
    await this.page.goto(`${this.basePagesUrl}/base.html`);
            const [empResp] = await Promise.all([
  this.page.waitForResponse(res => res.url().includes('/api/reports/orders/?page')),
  this.sidebar.clickOrders()
]);
expect(empResp.status()).toBe(200);
    }
  /** 🔍 Mở modal chi tiết đơn hàng */
  async openOrderDetail(orderId: string | number) {
    const row = this.tableBody.locator(`tr:has(td:text-is("${orderId}"))`);
    await row.click();
    await expect(this.modalDetail).toBeVisible();
  }

  /** 👤 Chọn khách hàng trong modal Add Order */
  async selectCustomer(name: string) {
    await this.customerInput.fill(name);
    await this.page.keyboard.press("Enter");
  }

  /** ⚙️ Filter đơn hàng */
  async applyFilters(filters: {
    keyword?: string;
    status?: string;
    method?: string;
    from?: string;
    to?: string;
    tournament?: string;
    match?: string;
  }) {
    if (filters.keyword) await this.filterKeyword.fill(filters.keyword);
    if (filters.status) await this.filterStatus.selectOption(filters.status);
    if (filters.method) await this.filterMethod.selectOption(filters.method);
    if (filters.from) await this.filterFrom.fill(filters.from);
    if (filters.to) await this.filterTo.fill(filters.to);
    if (filters.tournament)
      await this.filterTournament.selectOption(filters.tournament);
    if (filters.match) await this.filterMatch.selectOption(filters.match);

    await this.btnFilter.click();
  }
}
