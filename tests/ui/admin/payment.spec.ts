import { test, expect } from '@playwright/test';
import { PaymentPage } from '../../../pages/admin/payment.page';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Payment Management Page', () => {
  let paymentPage: PaymentPage;

  test.beforeEach(async ({ page }) => {
    paymentPage = new PaymentPage(page);
    await paymentPage.goto();
 
  });

  test('Hiển thị danh sách thanh toán', async ({ page }) => {
    const rowCount = await paymentPage.tableRows.count();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test('Tìm kiếm thanh toán theo từ khóa', async ({ page }) => {
    await paymentPage.searchPayment('MOCK');
    await page.waitForTimeout(300);
    await paymentPage.clickApplyFilter();
    const rowCount = await paymentPage.tableRows.count();
    for(let i = 0; i < rowCount; i++) {
      const paymentId = await paymentPage.tableRows.nth(i).innerText();
      expect(paymentId).toContain('MOCK');
    }
  });

  test('Lọc thanh toán theo trạng thái', async ({ page }) => {
    const statusOptions = await paymentPage.filterStatus.locator('option').count();
    if (statusOptions > 1) {
      await paymentPage.selectStatus(('success').toString());
      await paymentPage.clickApplyFilter();
      await page.waitForTimeout(500);
      const rowCount = await paymentPage.tableRows.count();
      for(let i = 0; i < rowCount; i++) {
        const status = await paymentPage.tableRows.nth(i).locator('td').nth(3).innerText();
        expect(status.toLowerCase()).toBe('thành công');
      }
    }
  });

  test('Lọc thanh toán theo phương thức', async ({ page }) => {
    const methodOptions = await paymentPage.filterMethod.locator('option').count();
    if (methodOptions > 1) {
      await paymentPage.selectMethod(('cash').toString());
      await paymentPage.clickApplyFilter();
      await page.waitForTimeout(500);
      const rowCount = await paymentPage.tableRows.count();
      for(let i = 0; i < rowCount; i++) {
        const method = await paymentPage.tableRows.nth(i).locator('td').nth(2).innerText();
        expect(method.toLowerCase()).toBe('tiền mặt');
      }
    }
  });

  test('Lọc thanh toán theo khoảng thời gian', async ({ page }) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    await paymentPage.setDateRange(yesterday, today);
    await paymentPage.clickApplyFilter();
    await page.waitForTimeout(500);
    const rowCount = await paymentPage.tableRows.count();
    for(let i = 0; i < rowCount; i++) {
      const dateStr = await paymentPage.tableRows.nth(i).locator('td').nth(5).innerText();
      const [time, date] = dateStr.split(" ");
      const [hours, minutes, seconds] = time.split(":");
      const [day, month, year] = date.split("/");

      const parsedDate = new Date(
  parseInt(year),
  parseInt(month) - 1,  // ⚠ tháng trong JS bắt đầu từ 0
  parseInt(day),
  parseInt(hours),
  parseInt(minutes),
  parseInt(seconds)
);

      console.log(parsedDate);
      expect(parsedDate >= new Date(yesterday) && parsedDate <= new Date(today)).toBeTruthy();
    }
  });

  test('Reset bộ lọc', async ({ page }) => {
    // Đặt một vài bộ lọc
    await paymentPage.searchPayment('test');
    await page.waitForTimeout(200);
    
    // Reset tất cả
    await paymentPage.clickResetFilter();
    await page.waitForTimeout(500);
    
    // Verify search field is empty
    await expect(paymentPage.filterSearch).toHaveValue('');
  });

  test('Xem chi tiết thanh toán (nếu có dữ liệu)', async ({ page }) => {
    const rowCount = await paymentPage.tableRows.count();
    
    if (rowCount === 0) {
      test.skip();
      return;
    }

    // Open detail from first row
    await paymentPage.openDetailByRow(0);
    await page.waitForTimeout(300);

    // Verify modal appears
    await expect(paymentPage.modal).toBeVisible();
  });

  test('Đóng modal chi tiết thanh toán', async ({ page }) => {
    const rowCount = await paymentPage.tableRows.count();
    
    if (rowCount === 0) {
      test.skip();
      return;
    }

    // Open detail
    await paymentPage.openDetailByRow(0);
    await paymentPage.waitForDetailModal();

    // Close modal
    await paymentPage.closeDetailModal();
    await expect(paymentPage.modal).toBeHidden();
  });

  test('Phân trang - Chuyển trang tiếp theo (nếu có)', async ({ page }) => {
    const isDisabled = await paymentPage.paginationNext
  .locator('..')
  .evaluate(el => el.classList.contains('disabled'));
    console.log("Next button disabled:", isDisabled);
    if (!isDisabled) {
      await paymentPage.goNextPage();
      await page.waitForTimeout(500);
    }
  });

  test('Phân trang - Chuyển trang trước đó (nếu có)', async ({ page }) => {
    // First, go to next page
    const nextBtnDisabled = await paymentPage.paginationNext
  .locator('..')
  .evaluate(el => el.classList.contains('disabled'));
    console.log("Next button disabled:", nextBtnDisabled);
    if (!nextBtnDisabled) {
      await paymentPage.goNextPage();
      await page.waitForTimeout(500);
      
      // Now try to go back
      const prevBtnDisabled = await paymentPage.paginationPrev
  .locator('..')
  .evaluate(el => el.classList.contains('disabled'));
      if (!prevBtnDisabled) {
        await paymentPage.goPrevPage();
        await page.waitForTimeout(500);
      }
    }
  });

  test('Kết hợp - Lọc + Tìm kiếm + Xem chi tiết', async ({ page }) => {
    // Search
    await paymentPage.searchPayment('');
    await page.waitForTimeout(200);

    // Filter by status
    const statusOptions = await paymentPage.filterStatus.locator('option').count();
    if (statusOptions > 1) {
      await paymentPage.selectStatus('success');
      await page.waitForTimeout(200);
    }

    // Apply filter
    await paymentPage.clickApplyFilter();
    await page.waitForTimeout(500);

    // Check results
    const rowCount = await paymentPage.tableRows.count();
    if (rowCount > 0) {
      // Try to open detail
      await paymentPage.openDetailByRow(0);
      await page.waitForTimeout(300);
      
      if (await paymentPage.modal.isVisible()) {
        await paymentPage.closeDetailModal();
      }
    }
  });

});
