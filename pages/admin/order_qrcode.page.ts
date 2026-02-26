import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./base.page";

export class OrderQrCodePage extends BasePage {

  // ===== Constructor =====
  constructor(page: Page) {
    super(page);

    // Header
    this.orderId = page.locator("#order-id");

    // Order info
    this.userName = page.locator("#user-name");
    this.createdAt = page.locator("#created-at");
    this.orderMethod = page.locator("#order-method");
    this.orderStatus = page.locator("#order-status");
    this.totalAmount = page.locator("#total-amount");

    // Match info
    this.matchDesc = page.locator("#match-desc");
    this.matchLeague = page.locator("#match-league");
    this.matchStadium = page.locator("#match-stadium");
    this.matchTeams = page.locator("#match-teams");
    this.matchRound = page.locator("#match-round");
    this.matchTime = page.locator("#match-time");

    // Tickets
    this.ticketList = page.locator("#ticket-list .ticket-item");

    // Buttons
    this.homeBtn = page.locator("#home-btn");
    this.printBtn = page.locator("#print-btn");
  }

  // ===== Locators =====
  readonly orderId: Locator;

  readonly userName: Locator;
  readonly createdAt: Locator;
  readonly orderMethod: Locator;
  readonly orderStatus: Locator;
  readonly totalAmount: Locator;

  readonly matchDesc: Locator;
  readonly matchLeague: Locator;
  readonly matchStadium: Locator;
  readonly matchTeams: Locator;
  readonly matchRound: Locator;
  readonly matchTime: Locator;

  readonly ticketList: Locator;

  readonly homeBtn: Locator;
  readonly printBtn: Locator;

  // ===== Methods =====

  /** Mở trang Chi tiết đơn hàng */
  async open(orderId: string) {
    await this.page.goto(`${this.basePagesUrl}/orders/order_qrcode.html`);
    await this.page.evaluate((id) => localStorage.setItem("orderId", id), orderId);
    await this.page.reload(); // load lại để JS fetch API theo orderId
  }

  /** Validate header đơn hàng */
  async expectOrderId(id: string) {
    await expect(this.orderId).toHaveText(id);
  }

  /** Lấy số lượng vé */
  async getTicketCount(): Promise<number> {
    return await this.ticketList.count();
  }

  /** Lấy locator 1 vé theo index */
  ticketAt(index: number) {
    return this.ticketList.nth(index);
  }

  /** Check nút Print */
  async clickPrint() {
    await this.printBtn.click();
  }

  /** Check nút về trang Home */
  async goHome() {
    await this.homeBtn.click();
  }

}
