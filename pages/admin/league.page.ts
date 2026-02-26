import { expect, Locator, Page } from "@playwright/test";
import {BasePage} from "./base.page";

export default class LeaguePage extends BasePage {


  readonly leagueTable: Locator;
  readonly tableRows: Locator;
  readonly searchInput: Locator;

  readonly addLeagueBtn: Locator;

  constructor(page: Page) {
    super(page);

    this.leagueTable = page.locator("#leagueTable");
    this.tableRows = page.locator("#leagueTable tbody tr");
    this.searchInput = page.locator("#searchLeagueInput");

    this.addLeagueBtn = page.locator('a[href="/pages/admin/events/add_leagues.html"]');
  }

  /** -------------------------
   * PAGE ACTIONS
   * ------------------------*/

  // ⬇️ Mở trang danh sách giải đấu
  async gotoLeagueList() {
     await this.page.goto(`${this.basePagesUrl}/base.html`);
            const [leaResp, sportsResp] = await Promise.all([
  this.page.waitForResponse(res => res.url().includes('/api/events/leagues/')),
  this.page.waitForResponse(res => res.url().includes('/api/events/sports/')),
  this.sidebar.clickLeagues()
  
]

);
expect(leaResp.status()).toBe(200);
expect(sportsResp.status()).toBe(200);
  await this.page.waitForTimeout(500);
        const swalPopup = this.page.locator('.swal2-popup.swal2-show');
        if (await swalPopup.isVisible().catch(() => false)) {
            const confirmBtn = this.page.locator('.swal2-confirm, .swal2-cancel');
            await confirmBtn.first().click().catch(() => {});
           
        }
        else{
        await this.page.waitForTimeout(1000);
    }
  }

  // ⬇️ Chờ bảng DataTables render xong
  async waitForTableLoad() {
    await this.leagueTable.waitFor({ state: "visible" });

    // Chờ ít nhất 1 row render
    await this.page.waitForFunction(() => {
      const rows = document.querySelectorAll("#leagueTable tbody tr");
      return rows.length > 0;
    });

    await expect(this.tableRows.first()).toBeVisible();
  }

  // ⬇️ Nhập vào search (DataTables tự filter)
  async searchLeague(text: string) {
    await this.searchInput.fill(text);
    await this.page.waitForTimeout(500); // cho DataTables update
  }

  // ⬇️ Lấy số dòng hiện tại của bảng
  async getRowCount() {
    return await this.tableRows.count();
  }

  // ⬇️ Click nút Cập nhật theo league_id
  async clickUpdateBtn(leagueId: string | number) {
    const updateBtn = this.page.locator(`.edit-btn[data-id="${leagueId}"]`);
    await expect(updateBtn).toBeVisible();
    await updateBtn.click();
  }

  // ⬇️ Click nút Xóa theo league_id
  async clickDeleteBtn(leagueId: string | number) {
    const deleteBtn = this.page.locator(`.delete-stadium-btn[data-id="${leagueId}"]`);
    await expect(deleteBtn).toBeVisible();
    await deleteBtn.click();
  }

  // ⬇️ Bấm nút Confirm của SweetAlert2
  async confirmDelete() {
    const confirm = this.page.locator(".swal2-confirm");
    await expect(confirm).toBeVisible();
    await confirm.click();
  }

  // ⬇️ Lấy dữ liệu 1 row dưới dạng object
  async getRowData(index: number) {
    const row = this.tableRows.nth(index);
    const cells = row.locator("td");

    return {
      stt: await cells.nth(0).innerText(),
      name: await cells.nth(1).innerText(),
      type: await cells.nth(2).innerText(),
      startDate: await cells.nth(3).innerText(),
      endDate: await cells.nth(4).innerText(),
      created: await cells.nth(5).innerText(),
      updated: await cells.nth(6).innerText(),
    };
  }
}
