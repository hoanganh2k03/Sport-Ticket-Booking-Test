import { Page, Locator, expect } from "@playwright/test";
import {BasePage} from "./base.page";

export default class ReportRevenuePage extends BasePage {

  // Date inputs
  readonly startDate: Locator;
  readonly endDate: Locator;

  // Buttons
  readonly loadBtn: Locator;
  readonly exportPdfBtn: Locator;
  readonly exportExcelBtn: Locator;

  // Chart
  readonly revenueChart: Locator;

  // Tables
  readonly tableByMatch: Locator;
  readonly tableByMatchRows: Locator;

  readonly tableBySection: Locator;
  readonly tableBySectionRows: Locator;

  constructor(page: Page) {
    super(page);

    // Inputs
    this.startDate = page.locator("#start-date");
    this.endDate = page.locator("#end-date");

    // Buttons
    this.loadBtn = page.locator("#load-btn");
    this.exportPdfBtn = page.locator("#export-report-pdf");
    this.exportExcelBtn = page.locator("#export-report-excel");

    // Chart
    this.revenueChart = page.locator("#revenue-chart");

    // Tables
    this.tableByMatch = page.locator("#table-by-match");
    this.tableByMatchRows = page.locator("#table-by-match tbody tr");

    this.tableBySection = page.locator("#table-by-section");
    this.tableBySectionRows = page.locator("#table-by-section tbody tr");
  }

  // ============================
  // Actions
  // ============================

  /** Chọn ngày bắt đầu - kết thúc */
  async setDateRange(start: string, end: string) {
    await this.startDate.fill(start);
    await this.endDate.fill(end);
  }

  /** Click nút xem báo cáo */
  async loadReport() {
    await this.loadBtn.click();
    await expect(this.loadBtn).toBeEnabled();
    await this.page.waitForTimeout(400); // cho chart/table render
  }

  /** Xuất PDF */
  async exportPDF() {
    const [download] = await Promise.all([
      this.page.waitForEvent("download"),
      this.exportPdfBtn.click(),
    ]);
    return download;
  }

  /** Xuất Excel */
  async exportExcel() {
    const [download] = await Promise.all([
      this.page.waitForEvent("download"),
      this.exportExcelBtn.click(),
    ]);
    return download;
  }

  // ============================
  // Assertions & Helpers
  // ============================

  /** Lấy số dòng bảng theo trận */
  async getMatchRowCount() {
    return await this.tableByMatchRows.count();
  }

  /** Lấy số dòng bảng theo khu vực */
  async getSectionRowCount() {
    return await this.tableBySectionRows.count();
  }

  /** Lấy dữ liệu 1 row theo trận */
  async getMatchRowData(row: number) {
    const r = this.tableByMatchRows.nth(row);
    return {
      matchId: await r.locator("td:nth-child(1)").textContent(),
      matchName: await r.locator("td:nth-child(2)").textContent(),
      matchDate: await r.locator("td:nth-child(3)").textContent(),
      revenue: await r.locator("td:nth-child(4)").textContent(),
    };
  }

  /** Lấy dữ liệu 1 row theo khu vực */
  async getSectionRowData(row: number) {
    const r = this.tableBySectionRows.nth(row);
    return {
      sectionId: await r.locator("td:nth-child(1)").textContent(),
      sectionName: await r.locator("td:nth-child(2)").textContent(),
      revenue: await r.locator("td:nth-child(3)").textContent(),
    };
  }

  /** Kiểm tra chart đã vẽ (canvas hiển thị) */
  async verifyChartRendered() {
    await expect(this.revenueChart).toBeVisible();
  }
}
