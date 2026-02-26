import { Page, Locator, expect } from "@playwright/test";
import {BasePage} from "./base.page";

export default class ReportTicketStatusPage extends BasePage {

  // Filter controls
  readonly startDate: Locator;
  readonly endDate: Locator;
  readonly matchSelect: Locator;
  readonly applyFilterBtn: Locator;

  // Export buttons
  readonly exportPdfBtn: Locator;
  readonly exportExcelBtn: Locator;

  // Overview cards
  readonly totalMatches: Locator;
  readonly avgFillRate: Locator;
  readonly totalSold: Locator;

  // Charts
  readonly fillRateChart: Locator;
  readonly dailySalesChart: Locator;

  // Matches Table
  readonly matchesTable: Locator;
  readonly matchesTableRows: Locator;

  // Sections Table
  readonly sectionsTable: Locator;
  readonly sectionsTableRows: Locator;

  constructor(page: Page) {
    super(page);

    // Filters
    this.startDate = page.locator("#startDate");
    this.endDate = page.locator("#endDate");
    this.matchSelect = page.locator("#matchSelect");
    this.applyFilterBtn = page.locator("#applyFilter");

    // Export buttons
    this.exportPdfBtn = page.locator("#export-pdf-report");
    this.exportExcelBtn = page.locator("#export-excel-report");

    // Overview cards
    this.totalMatches = page.locator("#totalMatches");
    this.avgFillRate = page.locator("#avgFillRate");
    this.totalSold = page.locator("#totalSold");

    // Charts
    this.fillRateChart = page.locator("#fillRateChart_T");
    this.dailySalesChart = page.locator("#dailySalesChart");

    // Tables
    this.matchesTable = page.locator("#matchesTable");
    this.matchesTableRows = page.locator("#matchesTable tbody tr");

    this.sectionsTable = page.locator("#sectionsTable");
    this.sectionsTableRows = page.locator("#sectionsTable tbody tr");
  }

  // ==============================================
  // ACTIONS
  // ==============================================

  /** Set date range filter */
  async setDateRange(start: string, end: string) {
    await this.startDate.fill(start);
    await this.endDate.fill(end);
  }

  /** Select match */
  async selectMatch(matchId: string) {
    await this.matchSelect.selectOption(matchId);
  }

  /** Click filter button */
  async applyFilter() {
    await this.applyFilterBtn.click();
    await this.page.waitForTimeout(800); // đợi chart, tables load lại
  }

  /** Load default first time */
  async waitInitialLoad() {
    await this.page.waitForSelector("#matchesTable");
    await this.page.waitForTimeout(800);
  }

  /** Export PDF */
  async exportPDF() {
    const [download] = await Promise.all([
      this.page.waitForEvent("download"),
      this.exportPdfBtn.click()
    ]);
    return download;
  }

  /** Export Excel */
  async exportExcel() {
    const [download] = await Promise.all([
      this.page.waitForEvent("download"),
      this.exportExcelBtn.click()
    ]);
    return download;
  }

  // ==============================================
  // VERIFICATIONS
  // ==============================================

  /** Verify overview cards are visible */
  async verifyOverviewCards() {
    await expect(this.totalMatches).toBeVisible();
    await expect(this.avgFillRate).toBeVisible();
    await expect(this.totalSold).toBeVisible();
  }

  /** Verify charts are visible */
  async verifyChartsLoaded() {
    await expect(this.fillRateChart).toBeVisible();
    await expect(this.dailySalesChart).toBeVisible();
  }

  /** Get number of match rows */
  async getMatchRowCount() {
    return await this.matchesTableRows.count();
  }

  /** Get number of section rows */
  async getSectionRowCount() {
    return await this.sectionsTableRows.count();
  }

  /** Return match table row data */
  async getMatchRowData(row: number) {
    const r = this.matchesTableRows.nth(row);
    return {
      id: await r.locator("td:nth-child(1)").textContent(),
      dateTime: await r.locator("td:nth-child(2)").innerHTML(),
      matchName: await r.locator("td:nth-child(3)").textContent(),
      capacity: await r.locator("td:nth-child(4)").textContent(),
      sold: await r.locator("td:nth-child(5)").textContent(),
      remaining: await r.locator("td:nth-child(6)").textContent(),
      fillRate: await r.locator("td:nth-child(7)").textContent(),
    };
  }

  /** Return section table row data */
  async getSectionRowData(row: number) {
    const r = this.sectionsTableRows.nth(row);
    return {
      id: await r.locator("td:nth-child(1)").textContent(),
      sectionName: await r.locator("td:nth-child(2)").textContent(),
      capacity: await r.locator("td:nth-child(3)").textContent(),
      available: await r.locator("td:nth-child(4)").textContent(),
    };
  }

  /** Tab switcher */
  async switchToMatchesTab() {
    await this.page.click('button[data-bs-target="#matchesTab"]');
  }

  async switchToSectionsTab() {
    await this.page.click('button[data-bs-target="#sectionsTab"]');
  }
}
