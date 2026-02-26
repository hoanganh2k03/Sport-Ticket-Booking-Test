import { expect, Locator, Page } from "@playwright/test";
import {BasePage} from "./base.page";

export default class TeamPage extends BasePage {

  // Locators
  readonly searchInput: Locator;
  readonly addTeamBtn: Locator;
  readonly tableRows: Locator;
  readonly dataTable: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator("#searchTeamInput");
    this.addTeamBtn = page.locator('a[href="/pages/admin/events/add_team.html"]');
    this.tableRows = page.locator("#teamTable tbody tr");
    this.dataTable = page.locator("#teamTable");
  }

  /** Mở trang danh sách đội bóng */
  async goto() {
     await this.page.goto(`${this.basePagesUrl}/base.html`);
            const [teamResp, sportsResp] = await Promise.all([
  this.page.waitForResponse(res => res.url().includes('/api/events/teams')),
  this.page.waitForResponse(res => res.url().includes('/api/events/sports')),
  this.sidebar.clickTeams()
  
]

);
expect(teamResp.status()).toBe(200);
expect(sportsResp.status()).toBe(200);
  }

  /** Chờ bảng DataTable load xong */
  async waitUntilTableLoaded() {
    await this.page.waitForFunction(() => {
      const rows = document.querySelectorAll("#teamTable tbody tr");
      return rows.length > 0;
    });
  }

  /** Lấy số đội bóng trong bảng */
  async getTeamCount() {
    await this.waitUntilTableLoaded();
    return await this.tableRows.count();
  }

  /** Tìm kiếm đội bóng (search realtime bằng DataTables) */
  async searchTeam(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.page.waitForTimeout(500); // chờ DataTables filter
  }

  /** Click nút Thêm đội bóng */
  async clickAddTeam() {
    await this.addTeamBtn.click();
  }

  /** Click Edit đội bóng theo ID */
  async clickEditTeam(id: number | string) {
    const btn = this.page.locator(`button.edit-btn[data-id="${id}"]`);
    await expect(btn).toBeVisible();
    await btn.click();
  }

  /** Xóa đội bóng theo ID (Xác nhận popup) */
  async deleteTeam(id: number | string) {
    const deleteBtn = this.page.locator(`button.delete-stadium-btn[data-id="${id}"]`);
    await expect(deleteBtn).toBeVisible();

    await deleteBtn.click();

    // Xử lý SweetAlert2
    const confirmBtn = this.page.locator(".swal2-confirm");
    await confirmBtn.click();

    await this.page.waitForTimeout(500);
  }

  /** Upload logo đội bóng */
  async uploadTeamLogo(id: number | string, filePath: string) {
    const row = this.page.locator(`tr[data-team-id="${id}"]`);
    await expect(row).toBeVisible();

    const input = row.locator("input.team-logo-input");

    await input.setInputFiles(filePath);

    await this.page.locator(".swal2-confirm").click(); // Confirm alert
    await this.page.waitForTimeout(600);
  }

  /** Kiểm tra logo đã thay đổi */
  async expectLogoUpdated(id: number | string) {
    const row = this.page.locator(`tr[data-team-id="${id}"] img`);
    await expect(row).not.toHaveAttribute("src", "/media/team_logos/default.webp");
  }
}
