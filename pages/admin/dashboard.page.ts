import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./base.page";
export class DashboardPage extends BasePage {
    // ----- FILTERS -----
    readonly startDate: Locator;
    readonly endDate: Locator;
    readonly tournamentSelect: Locator;
    readonly matchSelect: Locator;
    readonly applyFiltersBtn: Locator;
    readonly sportSelect: Locator;

    // ----- SUMMARY CARDS -----
    readonly totalRevenue: Locator;
    readonly ticketsSoldToday: Locator;
    readonly overallFillRate: Locator;
    readonly totalReturns: Locator;

    // ----- CHARTS -----
    readonly revenueChart: Locator;
    readonly fillRateChart: Locator;
//---TOASTS---
readonly toastMessage: Locator;
    constructor(page: Page) {
        super(page);
        // Filters
        this.startDate = page.locator("#startDate");
        this.endDate = page.locator("#endDate");
        this.tournamentSelect = page.locator("#filterTournament");
        this.matchSelect = page.locator("#filterMatch");
        this.applyFiltersBtn = page.locator("#applyFilters");
        this.sportSelect = page.locator("#filterSport");

        // Summary cards
        this.totalRevenue = page.locator("#totalRevenue");
        this.ticketsSoldToday = page.locator("#ticketsSoldToday");
        this.overallFillRate = page.locator("#overallFillRate");
        this.totalReturns = page.locator("#totalReturns");

        // Charts
        this.revenueChart = page.locator("#revenueChart");
        this.fillRateChart = page.locator("#fillRateChart");

        // Toasts
        this.toastMessage = page.locator("#swal2-title");
        
    }

    // -----------------------------
    // NAVIGATION
    // -----------------------------
    async goto() {
        await this.page.goto(`${this.basePagesUrl}/base.html`); // chờ 1s cho trang load xong 
        await this.sidebar.clickDashboard();
        await this.expectToastMessage("thành công");
    }

    // -----------------------------
    // ACTIONS
    // -----------------------------

    async selectDateRange(start: string, end: string) {
        await this.startDate.fill(start);
        await this.endDate.fill(end);
    }

    async selectTournament(tournament: string) {
        // tournament = value attribute
        await this.tournamentSelect.selectOption(tournament);
    }

    async selectMatch(match: string) {
        await this.matchSelect.selectOption(match);
    }
    async selectSport(sport: string) {
        await this.sportSelect.selectOption(sport);
    };
    async applyFilters() {
        await this.applyFiltersBtn.click();

    }


    // -----------------------------
    // VALIDATION FUNCTIONS
    // -----------------------------
    async expectToastMessage(expectedMessage: string) {
        await expect(this.toastMessage).toContainText(expectedMessage);
    }
    async expectDashboardLoaded() {
    await expect(this.totalRevenue).toBeVisible();
    await expect(this.ticketsSoldToday).toBeVisible();
    await expect(this.overallFillRate).toBeVisible();
    await expect(this.totalReturns).toBeVisible();
    await expect(this.revenueChart).toBeVisible();
    await expect(this.fillRateChart).toBeVisible();
    }
    async expectFiltersVisible() {
    await expect(this.startDate).toBeVisible();
    await expect(this.endDate).toBeVisible();
    await expect(this.tournamentSelect).toBeVisible();
    await expect(this.matchSelect).toBeVisible();
    await expect(this.applyFiltersBtn).toBeVisible();
    }
    async expectSummaryNumbersLoaded() {
        await expect(this.totalRevenue).not.toHaveText("--");
        await expect(this.ticketsSoldToday).not.toHaveText("--");
        await expect(this.overallFillRate).not.toHaveText("--");
    }
    async expectDashboardRight(){
        const text = await this.totalRevenue.innerText();
        const numberValue = Number(
  text
    .replace(/\./g, '')      // bỏ dấu chấm
    .replace(/[^\d]/g, '')   // bỏ ₫, space, ký tự khác
);
expect(numberValue).toBeGreaterThanOrEqual(0);
const text2 = await this.ticketsSoldToday.innerText();
const numberValue2 = Number(
  text2 );
expect(numberValue2).toBeGreaterThanOrEqual(0);
const text3 = await this.overallFillRate.innerText();
const numberValue3 = Number(
  text3
    .replace(/%/g, '')   // bỏ ký tự %
);
expect(numberValue3).toBeGreaterThanOrEqual(0);
const text4 = await this.totalReturns.innerText();
const numberValue4 = Number(
  text4 );
expect(numberValue4).toBeGreaterThanOrEqual(0);
    }
    async waitForFiltersToLoad() {
        await expect(this.tournamentSelect).toBeVisible();
        await expect(this.matchSelect).toBeVisible();
    }
}
