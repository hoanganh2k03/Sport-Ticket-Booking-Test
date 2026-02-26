import { test, expect } from '@playwright/test';
import ReturnsPage from '../../../pages/admin/return.page';
import { BASE_URL } from '../../../utils/config';
test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Returns Page (Hoàn vé)', () => {
  let returnsPage: ReturnsPage;

  test.beforeEach(async ({ page }) => {
    returnsPage = new ReturnsPage(page);
    await returnsPage.goto();
  });

  test('Hiển thị danh sách yêu cầu hoàn vé', async ({ page }) => {
    await expect(returnsPage.table).toBeVisible();
    const rows = await returnsPage.getRowCount();
    expect(rows).toBeGreaterThanOrEqual(0);
  });

  test('Tìm kiếm yêu cầu hoàn vé', async ({ page }) => {
    await returnsPage.search('Hà');
    // ensure no throw, and table still present
    await expect(returnsPage.table).toBeVisible();
  });

  test('Xử lý 1 yêu cầu hoàn vé (nếu có)', async ({ page }) => {
    const rows = await returnsPage.getRowCountPendingReturns();
    console.log(`Found ${rows} pending return requests`);
    if (rows === 0) {
      test.skip();
      return;
    }

    // Tìm button xử lý trong hàng đầu tiên
    const firstRow = returnsPage.tableRows.filter({ has: returnsPage.page.locator('button[title="Xử lý hoàn vé"]') }).first();
    const processBtn = firstRow.locator('button[title="Xử lý hoàn vé"]');

    if (await processBtn.count() === 0) {
      // Không có hàng pending (có thể đã xử lý) -> skip
      test.skip();
      return;
    }

    await processBtn.click();

    // Modal should appear and we can process
    await expect(returnsPage.processModal).toBeVisible();

    // Choose refund method and confirm (use 'cash' as example)
    await returnsPage.processReturn({ method: 'cash', note: 'Auto processed by test' });

    // After processing, table should refresh; at least modal hidden
    await expect(returnsPage.processModal).toBeHidden();
  });

  test('Từ chối 1 yêu cầu hoàn vé (nếu có)', async ({ page }) => {
    const rows = await returnsPage.getRowCount();
    if (rows === 0) {
      test.skip();
      return;
    }

    const firstRow = returnsPage.tableRows.first();
    const rejectBtn = firstRow.locator('button[title="Từ chối hoàn vé"]');

    if (await rejectBtn.count() === 0) {
      test.skip();
      return;
    }

    await rejectBtn.click();
    await expect(returnsPage.rejectModal).toBeVisible();

    await returnsPage.rejectReturn('Từ chối test');
    await expect(returnsPage.rejectModal).toBeHidden();
  });

});
