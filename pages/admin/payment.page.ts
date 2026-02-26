import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./base.page";
import { BASE_URL } from "../../utils/config";
export class PaymentPage extends BasePage {
  readonly filterSearch: Locator;
  readonly filterStatus: Locator;
  readonly filterMethod: Locator;
  readonly filterFrom: Locator;
  readonly filterTo: Locator;
  readonly btnFilter: Locator;
  readonly btnReset: Locator;
  readonly tableRows: Locator;
  readonly noDataRow: Locator;
  readonly paginationPrev: Locator;
  readonly paginationNext: Locator;

  // Detail Modal
  readonly modal: Locator;
  readonly modalPaymentId: Locator;
  readonly modalOrderId: Locator;
  readonly modalMethod: Locator;
  readonly modalStatus: Locator;
  readonly modalCode: Locator;
  readonly modalDate: Locator;
  readonly modalCloseBtn: Locator;

  constructor(page: Page) {
    super(page);

    this.filterSearch = page.locator('#filterSearch');
    this.filterStatus = page.locator('#filterStatus');
    this.filterMethod = page.locator('#filterMethod');
    this.filterFrom = page.locator('#filterFrom');
    this.filterTo = page.locator('#filterTo');
    this.btnFilter = page.locator('#btnFilter');
    this.btnReset = page.locator('#btnReset');

    this.tableRows = page.locator('#paymentTableBody tr');
    this.noDataRow = page.locator('#paymentTableBody tr:has-text("Không có dữ liệu")');

    this.paginationPrev = page.locator('#prevPage');
    this.paginationNext = page.locator('#nextPage');

    this.modal = page.locator('#paymentDetailModal');
    this.modalPaymentId = page.locator('#detailPaymentId');
    this.modalOrderId = page.locator('#detailOrderId');
    this.modalMethod = page.locator('#detailMethod');
    this.modalStatus = page.locator('#detailStatus');
    this.modalCode = page.locator('#detailCode');
    this.modalDate = page.locator('#detailDate');
    this.modalCloseBtn = page.locator('#paymentDetailModal button[data-bs-dismiss="modal"][class*="btn-close"]');
  }
  async goto(){
       await this.page.goto(`${BASE_URL}/pages/admin/base.html#payments/payments`);
        await this.page.waitForSelector('#paymentTableBody');
  }
  async searchPayment(keyword: string) {
    await this.filterSearch.fill(keyword);
  }

  async selectStatus(status: string) {
    await this.filterStatus.selectOption(status);
  }

  async selectMethod(method: string) {
    await this.filterMethod.selectOption(method);
  }

  async setDateRange(from: string, to: string) {
    await this.filterFrom.fill(from);
    await this.filterTo.fill(to);
  }

  async clickApplyFilter() {
    await this.btnFilter.click();
  }

  async clickResetFilter() {
    await this.btnReset.click();
  }

  async openDetailByRow(index: number) {
    const btn = this.tableRows.nth(index).locator('button.btn-outline-primary');
    await btn.click();
  }

  async verifyHasResults() {
    await expect(this.noDataRow).toHaveCount(0);
  }

  async verifyNoResults() {
    await expect(this.noDataRow).toHaveCount(1);
  }

  async goNextPage() {
    await this.paginationNext.click();
  }

  async goPrevPage() {
    await this.paginationPrev.click();
  }

  async waitForDetailModal() {
    await expect(this.modal).toBeVisible();
  }

  async closeDetailModal() {
    await this.modalCloseBtn.click();
  }

  async verifyDetail({ id, orderId }: { id?: string; orderId?: string }) {
    if (id) await expect(this.modalPaymentId).toContainText(id);
    if (orderId) await expect(this.modalOrderId).toContainText(orderId);
  }
}
