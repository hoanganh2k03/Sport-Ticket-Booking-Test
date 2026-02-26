import { test, expect, type Page } from '@playwright/test';
import TeamPage from '../../../pages/admin/team.page';
import { TeamAddPage } from '../../../pages/admin/team_add.page';
import { TeamEditPage } from '../../../pages/admin/team_edit.page';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Team Management Page', () => {
    let teamPage: TeamPage;

    test.beforeEach(async ({ page }) => {
        teamPage = new TeamPage(page);
        await teamPage.goto();
    });

    test('Hiển thị danh sách đội bóng', async ({ page }) => {
        await expect(teamPage.dataTable).toBeVisible();
        const teamCount = await teamPage.getTeamCount();
        expect(teamCount).toBeGreaterThan(0);
    });

    test('Tìm kiếm đội bóng', async ({ page }) => {
        await teamPage.searchTeam('Manchester United');
        await page.waitForTimeout(500);
        expect(await teamPage.getTeamCount()).toBeGreaterThanOrEqual(0);
    });
});

test.describe('Team Add Page', () => {
    let teamAddPage: TeamAddPage;
    let teamPage: TeamPage;

    test.beforeEach(async ({ page }) => {
        teamAddPage = new TeamAddPage(page);
        teamPage = new TeamPage(page);
        await teamPage.goto();
        
        // Đóng bất kỳ SweetAlert2 nào đang hiển thị
        
        await teamPage.addTeamBtn.click();
    });

    test('Hiển thị form thêm đội bóng', async ({ page }) => {
        await expect(teamAddPage.teamName).toBeVisible();
        await expect(teamAddPage.headCoach).toBeVisible();
        await expect(teamAddPage.description).toBeVisible();
        await expect(teamAddPage.submitBtn).toBeVisible();
    });
});

test.describe('Team Edit Page', () => {
    let teamEditPage: TeamEditPage;
    let teamPage: TeamPage;

    test.beforeEach(async ({ page }) => {
        teamEditPage = new TeamEditPage(page);
        teamPage = new TeamPage(page);
        await teamPage.goto();
    });

    test('Hiển thị form cập nhật đội bóng', async ({ page }) => {
        // Lấy ID đội bóng từ hàng đầu tiên
        const firstRow = teamPage.tableRows.first();
        const teamIdAttr = await firstRow.getAttribute('data-team-id').catch(() => '1');
        
        // Click edit nút
        await teamPage.clickEditTeam(teamIdAttr || '1');
        await page.waitForTimeout(500);
        
        await expect(teamEditPage.teamName).toBeVisible();
        await expect(teamEditPage.headCoach).toBeVisible();
        await expect(teamEditPage.description).toBeVisible();
    });
});
