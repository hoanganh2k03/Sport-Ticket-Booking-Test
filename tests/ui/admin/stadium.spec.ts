import { test, expect, type Page } from '@playwright/test';
import { StadiumPage } from '../../../pages/admin/stadium.page';
import { StadiumAddPage } from '../../../pages/admin/stadium_add.page';
import { StadiumEditPage } from '../../../pages/admin/stadium_edit.page';
import { BASE_URL } from '../../../utils/config';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Stadium Management Page', () => {
    let stadiumPage: StadiumPage;

    test.beforeEach(async ({ page }) => {
        stadiumPage = new StadiumPage(page);
        await stadiumPage.gotoListPage();
    });

    test('Hiển thị danh sách sân vận động', async ({ page }) => {
        await expect(stadiumPage.tableRows).toBeDefined();
        await expect(page.locator('table')).toBeVisible();
    });

    test('Tìm kiếm sân vận động', async ({ page }) => {
        await stadiumPage.search('Anfield');
        await page.waitForTimeout(500);
    });
});

test.describe('Stadium Add Page', () => {
    let stadiumAddPage: StadiumAddPage;

    test.beforeEach(async ({ page }) => {
        stadiumAddPage = new StadiumAddPage(page);
        await stadiumAddPage.goto();
    });

    test('Hiển thị form thêm sân vận động', async ({ page }) => {
        await expect(stadiumAddPage.stadiumCodeInput).toBeVisible();
        await expect(stadiumAddPage.stadiumNameInput).toBeVisible();
        await expect(stadiumAddPage.locationInput).toBeVisible();
        await expect(stadiumAddPage.addSectionBtn).toBeVisible();
        await expect(stadiumAddPage.submitBtn).toBeVisible();
    });

    test('Thêm khu vực', async ({ page }) => {
        await stadiumAddPage.addSectionBtn.click();
        await page.waitForTimeout(300);
        // Verify section was added
        const sections = await stadiumAddPage.sectionsContainer.locator('.row').count();
        expect(sections).toBeGreaterThan(0);
    });
});

test.describe('Stadium Edit Page', () => {
    let stadiumEditPage: StadiumEditPage;
    let stadiumPage: StadiumPage;
    test.beforeEach(async ({ page }) => {
        stadiumEditPage = new StadiumEditPage(page);
        stadiumPage = new StadiumPage(page);
        await stadiumPage.gotoListPage();

    });

    test('Hiển thị form cập nhật sân vận động', async ({ page }) => {
        // Navigate to edit page (assuming ID 1 exists)
        await stadiumPage.clickEdit('Anfield');
        await page.waitForTimeout(500);
        await expect(stadiumEditPage.stadiumCode).toBeVisible();
        await expect(stadiumEditPage.stadiumName).toBeVisible();
        await expect(stadiumEditPage.stadiumLocation).toBeVisible();
        await expect(stadiumEditPage.submitBtn).toBeVisible();
    });
});
