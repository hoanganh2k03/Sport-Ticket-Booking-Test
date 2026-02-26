import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./base.page";

export class PromotionPage extends BasePage {
    readonly table: Locator;
    readonly tableRows: Locator;
    readonly searchInput: Locator;
    readonly filterStatus: Locator;
    readonly filterQuantity: Locator;
    readonly filterEndDate: Locator;
    readonly pageSize: Locator;
    readonly selectAll: Locator;
    readonly bulkDelete: Locator;
    readonly bulkToggle: Locator;
    readonly pagination: Locator;
    readonly detailButtons: Locator;
    readonly deleteButtons: Locator;

    readonly detailModal: Locator;

    constructor(page: Page) {
        super(page);

        this.table = page.locator("#promotionsTable");
        this.tableRows = page.locator("#promotionsTable tbody tr");

        this.searchInput = page.locator("#searchInput");
        this.filterStatus = page.locator("#filterStatus");
        this.filterQuantity = page.locator("#filterQuantity");
        this.filterEndDate = page.locator("#filterEndDate");
        this.pageSize = page.locator("#pageSize");

        this.selectAll = page.locator("#selectAll");
        this.bulkDelete = page.locator("#bulkDelete");
        this.bulkToggle = page.locator("#bulkToggle");

        this.pagination = page.locator("#pagination");
        this.detailButtons = page.locator(".detail-btn");
        this.deleteButtons = page.locator(".delete-btn");

        this.detailModal = page.locator("#detailModal");
    }

    async goto() {
          await this.page.goto(`${this.basePagesUrl}/base.html`);
            const [promotionResp] = await Promise.all([
  this.page.waitForResponse(res => res.url().includes('/api/promotions/')),
  this.sidebar.clickPromotion()]);
expect(promotionResp.status()).toBe(200);
    };

    async waitTableLoaded() {
        await expect(this.tableRows.first()).toBeVisible({ timeout: 5000 });
    }

    /** Search by code/description */
    async search(keyword: string) {
        await this.searchInput.fill(keyword);
        await this.waitTableLoaded();
    }

    /** Filter status: "" | "true" | "false" */
    async filterByStatus(status: string) {
        await this.filterStatus.selectOption(status);
        await this.waitTableLoaded();
    }

    /** quantity: "" | "exhausted" | "available" */
    async filterByQuantity(q: string) {
        await this.filterQuantity.selectOption(q);
        await this.waitTableLoaded();
    }

    /** end date: "" | "valid" | "expired" */
    async filterByEndDate(type: string) {
        await this.filterEndDate.selectOption(type);
        await this.waitTableLoaded();
    }

    /** Change page size */
    async changePageSize(size: string) {
        await this.pageSize.selectOption(size);
        await this.waitTableLoaded();
    }

    async clickDetailByCode(code: string) {
        const btn = this.page.locator(`.detail-btn:has-text("${code}")`);
        await btn.click();
        await expect(this.detailModal).toBeVisible();
    }

    async deletePromotionByCode(code: string) {
        const btn = this.page.locator(`.delete-btn[data-id]`).filter({
            has: this.page.locator(`text=${code}`)
        });

        await btn.click();
        await this.page.waitForTimeout(300); // chờ confirm

        await this.page.click('button:has-text("OK")').catch(() => {});

        await this.waitTableLoaded();
    }

    /** Bulk actions */
    async selectPromotionByCode(code: string) {
        const checkbox = this.page.locator(`tr:has-text("${code}") .selectRow`);
        await checkbox.check();
    }

    async selectAllRows() {
        await this.selectAll.check();
    }

    async bulkDeleteSelected() {
        await this.bulkDelete.click();
        await this.page.waitForTimeout(300);
        await this.page.click('button:has-text("OK")').catch(() => {});
        await this.waitTableLoaded();
    }

    async bulkToggleSelected() {
        await this.bulkToggle.click();
        await this.waitTableLoaded();
    }

    async gotoPage(num: number) {
        await this.pagination.locator(`text="${num}"`).click();
        await this.waitTableLoaded();
    }

    /** Verify row exists */
    async expectPromotionExists(code: string) {
        await expect(this.page.locator(`tr:has-text("${code}")`)).toBeVisible();
    }

    async expectPromotionNotExists(code: string) {
        await expect(this.page.locator(`tr:has-text("${code}")`)).toHaveCount(0);
    }
}
