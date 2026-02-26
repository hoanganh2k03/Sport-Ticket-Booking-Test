import { Page, Locator, expect } from "@playwright/test";
import {BasePage} from "./base.page";
import { BASE_URL } from "../../utils/config";

export default class ReturnsPage extends BasePage {


  // Search
  readonly searchInput: Locator;

  // Table
  readonly table: Locator;
  readonly tableRows: Locator;

  // Process Modal
  readonly processModal: Locator;
  readonly processReturnId: Locator;
  readonly refundMethod: Locator;
  readonly refundAmount: Locator;
  readonly processNote: Locator;
  readonly btnProcess: Locator;

  // Reject Modal
  readonly rejectModal: Locator;
  readonly rejectReturnId: Locator;
  readonly rejectNote: Locator;
  readonly btnReject: Locator;

  constructor(page: Page) {
    super(page);

    // Search
    this.searchInput = page.locator("#searchInput");

    // Table
    this.table = page.locator("#returns-table");
    this.tableRows = page.locator("#returns-table tbody tr");

    // Process Modal
    this.processModal = page.locator("#processModal");
    this.processReturnId = page.locator("#processReturnId");
    this.refundMethod = page.locator("#refundMethod");
    this.refundAmount = page.locator("#refundAmount");
    this.processNote = page.locator("#processNote");
    this.btnProcess = page.locator("#btnProcess");

    // Reject Modal
    this.rejectModal = page.locator("#rejectModal");
    this.rejectReturnId = page.locator("#rejectReturnId");
    this.rejectNote = page.locator("#rejectNote");
    this.btnReject = page.locator("#btnReject");
  }

  // ============================
  // Actions
  // ============================
  async goto(){
    await this.page.goto(`${BASE_URL}/pages/admin/base.html#returns/returns`);
        // Wait for table to render rows (or at least the table element)
        await this.page.waitForSelector('#returns-table');
  }
  /** Tìm kiếm */
  async search(keyword: string) {
    await this.searchInput.fill(keyword);
  }

  /** Click nút Process của một row */
  async clickProcessButton(returnId: number) {
    const button = this.page.locator(
      `button[onclick="openProcessModal(${returnId},`
    );
    await button.click();
    await expect(this.processModal).toBeVisible();
  }

  /** Click nút Reject */
  async clickRejectButton(returnId: number) {
    const button = this.page.locator(
      `button[onclick="openRejectModal(${returnId})"]`
    );
    await button.click();
    await expect(this.rejectModal).toBeVisible();
  }

  /** Xử lý hoàn vé */
  async processReturn({
    method,
    amount,
    note,
  }: {
    method: string;
    amount?: number;
    note?: string;
  }) {
    await this.refundMethod.selectOption(method);

    if (amount !== undefined) {
      await this.refundAmount.fill(amount.toString());
    }

    if (note) {
      await this.processNote.fill(note);
    }

    await this.btnProcess.click();
    await expect(this.processModal).toBeHidden();
  }

  /** Từ chối hoàn vé */
  async rejectReturn(note: string) {
    await this.rejectNote.fill(note);
    await this.btnReject.click();
    await expect(this.rejectModal).toBeHidden();
  }

  /** Lấy số lượng dòng trong bảng */
  async getRowCount() {
    return await this.tableRows.count();
  }
  async getRowCountPendingReturns(){
    const rows = this.tableRows.filter({ has: this.page.locator('button[title="Xử lý hoàn vé"]') });
    return await rows.count();
  }

  /** Kiểm tra badge status */
  async getStatusBadge(rowIndex: number) {
    return this.tableRows.nth(rowIndex).locator("span.badge");
  }
}
