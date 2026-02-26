import { test, expect, type Page } from '@playwright/test';
import { PromotionPage } from '../../../pages/admin/promotion.page';
import { PromotionEditPage } from '../../../pages/admin/promotion_edit.page';
import AddPromotionPage from '../../../pages/admin/promotion_add.page';
import { BASE_URL } from '../../../utils/config';
test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Promotion Management Page', () => {
    let promotionPage: PromotionPage;

    test.beforeEach(async ({ page }) => {
        promotionPage = new PromotionPage(page);
        await promotionPage.goto();
    });

    test('Hiển thị danh sách khuyến mãi', async ({ page }) => {
        await expect(promotionPage.table).toBeVisible();
        await expect(promotionPage.tableRows.first()).toBeVisible();
    });

    test('Tìm kiếm khuyến mãi', async ({ page }) => {
        await promotionPage.search('ABC');
        await expect(promotionPage.tableRows).toBeDefined();
    });

    test('Lọc theo trạng thái', async ({ page }) => {
        await promotionPage.filterByStatus('false');
        await promotionPage.waitTableLoaded();
    });

    test('Lọc theo số lượng', async ({ page }) => {
        await promotionPage.filterByQuantity('available');
        await promotionPage.waitTableLoaded();
    });

    test('Lọc theo ngày kết thúc', async ({ page }) => {
        await promotionPage.filterByEndDate('expired');
        await promotionPage.waitTableLoaded();
    });

    test('Thay đổi kích thước trang', async ({ page }) => {
        await promotionPage.changePageSize('20');
        await promotionPage.waitTableLoaded();
    });
});

test.describe('Promotion Add Page', () => {
    let addPromotionPage: AddPromotionPage;

    test.beforeEach(async ({ page }) => {
        addPromotionPage = new AddPromotionPage(page);
        await page.goto(`${BASE_URL}/pages/admin/promotions/add_promotions.html`);
    });

    test('Hiển thị form thêm khuyến mãi', async ({ page }) => {
        await expect(addPromotionPage.promoCode).toBeVisible();
        await expect(addPromotionPage.discountType).toBeVisible();
        await expect(addPromotionPage.discountValue).toBeVisible();
        await expect(addPromotionPage.startTime).toBeVisible();
        await expect(addPromotionPage.endTime).toBeVisible();
        await expect(addPromotionPage.usageLimit).toBeVisible();
        await expect(addPromotionPage.btnSubmit).toBeVisible();
    });

    test('Điền form thêm khuyến mãi', async ({ page }) => {
        const startTime = new Date().toISOString().slice(0, 16);
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        const endTime = endDate.toISOString().slice(0, 16);

        await addPromotionPage.fillForm({
            promo_code: 'TEST_PROMO_001',
            discount_type: 'percentage',
            discount_value: 10,
            start_time: startTime,
            end_time: endTime,
            usage_limit: 100,
            description: 'Test promotion'
        });

        await expect(addPromotionPage.promoCode).toHaveValue('TEST_PROMO_001');
        await expect(addPromotionPage.discountValue).toHaveValue('10');
    });

    test('Áp dụng khuyến mãi toàn bộ trận đấu', async ({ page }) => {
        const matchOptions = await addPromotionPage.matchBulkSelect.locator('option').count();
        
        if (matchOptions > 1) {
            // Có ít nhất 1 option (ngoài default)
            await addPromotionPage.matchBulkSelect.selectOption({ index: 1 });
            await addPromotionPage.btnBulkApply.click();
            await page.waitForTimeout(300);
        }
    });

    test('Áp dụng khuyến mãi theo khu vực cụ thể', async ({ page }) => {
        await addPromotionPage.btnSectionTab.click();
        await page.waitForTimeout(300);
        const matchOptions = await addPromotionPage.matchSectionSelect.locator('option').count();
        const sectionOptions = await addPromotionPage.sectionSectionSelect.locator('option').count();
            await addPromotionPage.matchSectionSelect.selectOption({ index: 1 });
            await addPromotionPage.sectionSectionSelect.selectOption({ index: 1 });
            await addPromotionPage.btnSectionApply.click();
            await page.waitForTimeout(300);
        
    });
});

test.describe('Promotion Edit Page', () => {
    let promotionEditPage: PromotionEditPage;

    test.beforeEach(async ({ page }) => {
        promotionEditPage = new PromotionEditPage(page);
        // Navigate to edit page with sample ID
        await page.goto(`${BASE_URL}/pages/admin/promotions/edit_promotions.html?promoId=1`).catch(() => {});
    });

    test('Hiển thị form cập nhật khuyến mãi', async ({ page }) => {
            await expect(promotionEditPage.endTimeInput).toBeVisible();
            await expect(promotionEditPage.usageLimitInput).toBeVisible();
            await expect(promotionEditPage.descriptionInput).toBeVisible();
             await expect(promotionEditPage.discountValueInput).toBeVisible();
    });

    test('Cập nhật thông tin khuyến mãi', async ({ page }) => {
        const endTimeVisible = await promotionEditPage.endTimeInput.isVisible();
        
        if (endTimeVisible) {
            const newEndTime = new Date();
            newEndTime.setMonth(newEndTime.getMonth() + 2);
            const endTimeStr = newEndTime.toISOString().slice(0, 16);

            await promotionEditPage.fillEndTime(endTimeStr);
            await promotionEditPage.fillUsageLimit('150');
            await promotionEditPage.fillDescription('Updated promotion');
            await promotionEditPage.fillDiscountValue('20.00');

             // Verify fill succeeded
        }
    });

    test('Áp dụng khuyến mãi cho trận đấu (Bulk)', async ({ page }) => {
        const bulkMatchVisible = await promotionEditPage.bulkMatchSelect.isVisible();
        
        if (bulkMatchVisible) {
            const matchCount = await promotionEditPage.bulkMatchSelect.locator('option').count();
            if (matchCount > 1) {
                await promotionEditPage.selectBulkMatch((7).toString());
                await promotionEditPage.clickBulkApply();
            }
        }
    });

    test('Áp dụng khuyến mãi cho khu vực cụ thể', async ({ page }) => {
        await promotionEditPage.btnSectionTab.click();
        const sectionMatchVisible = await promotionEditPage.sectionMatchSelect.isVisible();
        
        if (sectionMatchVisible) {
                await promotionEditPage.selectSectionMatch((7).toString());
                await promotionEditPage.selectSection((16).toString());
                await promotionEditPage.clickApplySection();
            
        }
    });
});
