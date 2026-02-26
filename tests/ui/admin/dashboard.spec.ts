import { test, expect, type Page } from '@playwright/test';
import { DashboardPage } from '../../../pages/admin/dashboard.page';
test.use({ storageState: 'playwright/.auth/admin.json', });
test.describe('Admin Dashboard Page', () => {
    let dashboardPage :DashboardPage;
  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    // Mở trang dashboard trước mỗi test
  });
  test('Kiểm tra hiển thị bộ lọc', async ({ page }) => {
    await dashboardPage.expectFiltersVisible();
  });
  test('Kiểm tra hiển thị dashboard', async ({ page }) => {
    await dashboardPage.expectDashboardRight();
    await dashboardPage.expectDashboardLoaded();
  });
      test('Áp dụng bộ lọc và kiểm tra kết quả', async ({ page }) => {
        await dashboardPage.selectDateRange('2025-12-01', '2025-12-31');
        await dashboardPage.selectSport('Football');
        await dashboardPage.selectTournament("Premier League");
        //await dashboardPage.selectMatch('Manchester United (Football) vs Liverpool (Football) - 01 Dec 2025, 19:30');
        await dashboardPage.applyFilters();
        // Thêm các kiểm tra để xác minh rằng dữ liệu đã được lọc đúng cách
        await dashboardPage.expectToastMessage("thành công");
      });
    });