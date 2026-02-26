import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./base.page";
import {createHeaderMap} from "../../utils/uiHelpers";
export class TicketPage extends BasePage {

    // ----- HEADER ACTION BUTTONS -----
    readonly btnAddTicket: Locator;
    readonly btnPriceHistory: Locator;

    // ----- TOOLBAR -----
    readonly searchInput: Locator;
    readonly matchFilter: Locator;
    readonly pageSizeSelect: Locator;
    readonly sportFilter: Locator;

    // ----- TABLE -----
    readonly table: Locator;
    readonly tableRows: Locator;
    //readonly tableLoading: Locator;

    // ----- PAGINATION -----
    readonly paginationInfo: Locator;
    readonly pagination: Locator;
    readonly paginationNext: Locator;
    constructor(page: Page) {
        super(page);

        // Header
        this.btnAddTicket = page.locator("#btnAddTicket");
        this.btnPriceHistory = page.locator("#btnPriceHistory");

        // Filters
        this.searchInput = page.locator("#ticketSearchInput");
        this.matchFilter = page.locator("#match-filter");
        this.pageSizeSelect = page.locator("#pageSize");
        this.sportFilter = page.locator("#sport-filter");

        // Table
        this.table = page.locator("#ticketTable");
        this.tableRows = page.locator("#ticketTable tbody tr");

        // Pagination
        this.paginationInfo = page.locator("#paginationInfo");
        this.pagination = page.locator("ul.pagination");
        this.paginationNext= page.locator("ul.pagination >> text=Next");
    }

    // -------------------------------
    // NAVIGATION
    // -------------------------------
    async goto() {
    await this.page.goto(`${this.basePagesUrl}/base.html`);
            const [ticketResp, matchResp, sportsResp] = await Promise.all([
  this.page.waitForResponse(res => res.url().includes('/api/tickets/section-prices')),
  this.page.waitForResponse(res => res.url().includes('/api/tickets/completed-matches')),
  this.page.waitForResponse(res => res.url().includes('/api/events/sports')),
 this.sidebar.clickTickets()
]);
expect(ticketResp.status()).toBe(200);
expect(matchResp.status()).toBe(200);
expect(sportsResp.status()).toBe(200); 
    }

    // -------------------------------
    // ACTIONS
    // -------------------------------
      async getHeaderMap() {
        const headerMap = await createHeaderMap(this.table);
        const uppercaseMap = new Map<string, number>();
        headerMap.forEach((value, key) => {
          uppercaseMap.set(key.toUpperCase(), value);
        });
        return uppercaseMap;
      }
    async search(text: string) {
        await this.searchInput.fill(text);
        await this.page.keyboard.press("Enter");  
    }

    async filterMatch(matchId: string) {
        await this.matchFilter.selectOption(matchId);
    }
    async filterSport(sportId: string) {
        await this.sportFilter.selectOption(sportId);
    }

    async changePageSize(size: string) {
        await this.pageSizeSelect.selectOption(size);
    }

    async clickAddTicket() {
        await this.btnAddTicket.click();
    }

    async clickPriceHistory() {
        await this.btnPriceHistory.click();
    }

    // -------------------------------
    // TABLE VALIDATIONS
    // -------------------------------

    async expectPageLoaded() {

        await expect(this.table).toBeVisible();
        await expect(this.searchInput).toBeVisible();
        await expect(this.matchFilter).toBeVisible();
        await expect(this.pageSizeSelect).toBeVisible();
        await expect(this.sportFilter).toBeVisible();

    }
    async expectPageLoadedPagination()  {
        await expect(this.pagination.nth(0)).toBeVisible();
        await this.paginationNext.click();
        await expect(this.tableRows.first()).toBeVisible(); 
    }
    async expectApplyFilterTicket(matchName: string, sportName: string) {
        this.search(matchName);
        const count = await this.tableRows.count();
        this.filterSport(sportName);
        if( count>0 && matchName!='') {
        for (let i = 0; i < count; i++) {
            const rowText = await this.tableRows.nth(i).textContent();
            expect(rowText).toContain(matchName);
           }
    }
    }
    async expectupdateTicket(rowIndex: number, newName: string, newStadium: string, newZone: string, newPrice: string) {
        const row = this.tableRows.nth(rowIndex);
        const priceText = await row.locator("td:nth-child(5)").innerText();
        expect(priceText).toBe(newPrice);
    }
    async expectTableHasRows() {
        await expect(this.tableRows.first()).toBeVisible();
    }

    async expectSearchResultsContain(keyword: string) {
        const count = await this.tableRows.count();
        for (let i = 0; i < count; i++) {
            const rowText = await this.tableRows.nth(i).textContent();
            expect(rowText?.toLowerCase()).toContain(keyword.toLowerCase());
        }
    }

    async clickPagination(pageNumber: number) {
        await this.pagination.locator(`li >> text="${pageNumber}"`).click();
    }

    async getRowData(index: number) {
        const row = this.tableRows.nth(index);
        return {
            name: await row.locator("td:nth-child(2)").innerText(),
            stadium: await row.locator("td:nth-child(3)").innerText(),
            zone: await row.locator("td:nth-child(4)").innerText(),
            price: await row.locator("td:nth-child(5)").innerText(),
            seatsLeft: await row.locator("td:nth-child(6)").innerText(),
            status: await row.locator("td:nth-child(7)").innerText(),
        };
    }
}
