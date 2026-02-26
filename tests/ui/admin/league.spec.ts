import { test, expect, type Page } from '@playwright/test';
import LeaguePage from '../../../pages/admin/league.page';
import LeagueAddPage from '../../../pages/admin/league_add.page';
import LeagueEditPage from '../../../pages/admin/league_edit.page';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('League Management Page', () => {
    let leaguePage: LeaguePage;

    test.beforeEach(async ({ page }) => {
        leaguePage = new LeaguePage(page);
        await leaguePage.gotoLeagueList();
    });

    test('Hiển thị danh sách giải đấu', async ({ page }) => {
        await expect(leaguePage.leagueTable).toBeVisible();
        const rowCount = await leaguePage.getRowCount();
        expect(rowCount).toBeGreaterThan(0);
    });

    test('Tìm kiếm giải đấu', async ({ page }) => {
        await leaguePage.searchLeague('VBA');
        await page.waitForTimeout(500);
        const rowCount = await leaguePage.getRowCount();
        expect(rowCount).toBeGreaterThanOrEqual(0);
    });
});

test.describe('League Add Page', () => {
    let leagueAddPage: LeagueAddPage;
    let leaguePage: LeaguePage;
    test.beforeEach(async ({ page }) => {
        leagueAddPage = new LeagueAddPage(page);
        leaguePage = new LeaguePage(page);
        await leaguePage.gotoLeagueList();
        
        // Đóng bất kỳ SweetAlert2 nào đang hiển thị
       
        await leaguePage.addLeagueBtn.click();
    });

    test('Hiển thị form thêm giải đấu', async ({ page }) => {
        await expect(leagueAddPage.inputName).toBeVisible();
        await expect(leagueAddPage.selectType).toBeVisible();
        await expect(leagueAddPage.startDate).toBeVisible();
        await expect(leagueAddPage.endDate).toBeVisible();
    });
});

test.describe('League Edit Page', () => {
    let leagueEditPage: LeagueEditPage;
    let leaguePage: LeaguePage;
    test.beforeEach(async ({ page }) => {
        leagueEditPage = new LeagueEditPage(page);
        leaguePage = new LeaguePage(page);
        await leaguePage.gotoLeagueList();
    });

    test('Hiển thị form cập nhật giải đấu', async ({ page }) => {
        // Thay thế ID thực tế từ test data nếu cần
        await leaguePage.clickUpdateBtn(5);
        await expect(leagueEditPage.leagueName).toBeVisible();
        await expect(leagueEditPage.leagueType).toBeVisible();
        await leagueEditPage.loadLeagueData();
    });
});
