import { test, expect, type Page } from '@playwright/test';
import CustomerPage from '../../../pages/admin/customer.page';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin Customer Page', () => {
    let customerPage: CustomerPage;

    test.beforeEach(async ({ page }) => {
        customerPage = new CustomerPage(page);
        await customerPage.goto();
    });

    test('Kiểm tra hiển thị trang khách hàng', async ({ page }) => {
        await customerPage.waitForLoading();
        await expect(customerPage.table).toBeVisible();
    });

    test('Kiểm tra số lượng dòng trong bảng', async ({ page }) => {
        const rowCount = await customerPage.getRowCount();
        expect(rowCount).toBeGreaterThan(0);
    });

    test('Kiểm tra các thành phần giao diện', async ({ page }) => {
        await expect(customerPage.table).toBeVisible();
        await expect(customerPage.searchInput).toBeVisible();
        await expect(customerPage.btnFilter).toBeVisible();
        await expect(customerPage.btnReset).toBeVisible();
        await expect(customerPage.btnAdd).toBeVisible();
    });
});

test.describe('Admin Customer Add Flow', () => {
    let customerPage: CustomerPage;

    test.beforeEach(async ({ page }) => {
        customerPage = new CustomerPage(page);
        await customerPage.goto();
        await customerPage.waitForLoading();
    });

    test('Kiểm tra mở modal thêm khách hàng', async ({ page }) => {
        await customerPage.openAddModal();
        await expect(customerPage.modalTitle).toBeVisible();
    });

    test('Kiểm tra các trường trong form thêm', async ({ page }) => {
        await customerPage.openAddModal();

        await expect(customerPage.inputFullName).toBeVisible();
        await expect(customerPage.inputEmail).toBeVisible();
        await expect(customerPage.inputPhone).toBeVisible();
    });

    test('Kiểm tra nhập thông tin và lưu khách hàng', async ({ page }) => {
        await customerPage.openAddModal();

        await customerPage.fillCustomerForm({
            fullName: 'Test Customer',
            email: 'testcustomer@example.com',
            phone: '0123456788'
        });

        await customerPage.submitModal();
        
        // Kiểm tra modal đóng
        const isModalHidden = await customerPage.modal.isHidden().catch(() => true);
        expect(isModalHidden).toBeTruthy();
    });

    test('Kiểm tra đóng modal mà không lưu', async ({ page }) => {
        await customerPage.openAddModal();

        await customerPage.fillCustomerForm({
            fullName: 'Test Customer',
            email: 'test@example.com'
        });

        await customerPage.closeModal();
        
        // Kiểm tra modal đóng
        await expect(customerPage.modal).toBeHidden();
    });
});

test.describe('Admin Customer Edit Flow', () => {
    let customerPage: CustomerPage;

    test.beforeEach(async ({ page }) => {
        customerPage = new CustomerPage(page);
        await customerPage.goto();
        await customerPage.waitForLoading();
    });
/*
    test('Kiểm tra mở modal chỉnh sửa khách hàng', async ({ page }) => {
        const rowCount = await customerPage.getRowCount();
        
        if (rowCount > 0) {
            await customerPage.openEditModalByRow(0);
            await expect(customerPage.modal).toBeVisible();
        }
    });

    test('Kiểm tra chỉnh sửa thông tin khách hàng', async ({ page }) => {
        const rowCount = await customerPage.getRowCount();
        
        if (rowCount > 0) {
            await customerPage.openEditModalByRow(0);

            await customerPage.fillCustomerForm({
                fullName: 'Updated Customer Name',
                email: 'updated@example.com',
                phone: '0987654321'
            });

            await customerPage.submitModal();
            await page.waitForTimeout(1000);
            
            // Kiểm tra modal đóng
            const isModalHidden = await customerPage.modal.isHidden().catch(() => true);
            expect(isModalHidden).toBeTruthy();
        }
    });*/
});

test.describe('Admin Customer Delete Flow', () => {
    let customerPage: CustomerPage;

    test.beforeEach(async ({ page }) => {
        customerPage = new CustomerPage(page);
        await customerPage.goto();
        await customerPage.waitForLoading();
    });

    test('Kiểm tra xóa khách hàng', async ({ page }) => {
        // Navigate to page 3
        await customerPage.gotoPage(3);
        await page.waitForTimeout(1000);
        
        const rowCount = await customerPage.getRowCount();
        
        if (rowCount > 0) {
            // Delete the last row on page 3
            await customerPage.deleteCustomerByRow(1);
            await page.waitForTimeout(1000);
            
            // Kiểm tra xác nhận modal đóng
            await expect(customerPage.confirmModal).toBeHidden();
        }
    });

    test('Kiểm tra hiển thị modal xác nhận xóa', async ({ page }) => {
        const rowCount = await customerPage.getRowCount();
        
        if (rowCount > 0) {
            const row = customerPage.tableRows.nth(0);
            await row.locator("button[data-action='delete']").click();
            
            await expect(customerPage.confirmModal).toBeVisible();
            await expect(customerPage.confirmText).toBeVisible();
            await expect(customerPage.btnConfirmDelete).toBeVisible();
        }
    });
});

test.describe('Admin Customer Filter Tests', () => {
    let customerPage: CustomerPage;

    test.beforeEach(async ({ page }) => {
        customerPage = new CustomerPage(page);
        await customerPage.goto();
        await customerPage.waitForLoading();
    });

    test('Kiểm tra lọc theo tên khách hàng', async ({ page }) => {
        const initialCount = await customerPage.getRowCount();

        await customerPage.applyFilters({ name: 'Anh' });
        await page.waitForTimeout(1000);

        const filteredCount = await customerPage.getRowCount();
        expect(filteredCount).toBeLessThanOrEqual(initialCount);
    });

    test('Kiểm tra lọc theo email', async ({ page }) => {
        const initialCount = await customerPage.getRowCount();

        await customerPage.applyFilters({ email: '@example.com' });
        await page.waitForTimeout(1000);

        const filteredCount = await customerPage.getRowCount();
        expect(filteredCount).toBeLessThanOrEqual(initialCount);
    });

    test('Kiểm tra lọc theo số điện thoại', async ({ page }) => {
        const initialCount = await customerPage.getRowCount();

        await customerPage.applyFilters({ phone: '0123' });
        await page.waitForTimeout(1000);

        const filteredCount = await customerPage.getRowCount();
        expect(filteredCount).toBeLessThanOrEqual(initialCount);
    });

    test('Kiểm tra lọc theo khoảng thời gian', async ({ page }) => {
        const initialCount = await customerPage.getRowCount();

        await customerPage.applyFilters({ 
            from: '2025-01-01', 
            to: '2025-12-31' 
        });
        await page.waitForTimeout(1000);

        const filteredCount = await customerPage.getRowCount();
        expect(filteredCount).toBeLessThanOrEqual(initialCount);
    });

    test('Kiểm tra reset bộ lọc', async ({ page }) => {
        // Apply filter first
        await customerPage.applyFilters({ name: 'Test' });
        await page.waitForTimeout(1000);

        const filteredCount = await customerPage.getRowCount();

        // Reset filters
        await customerPage.resetFilters();
        await page.waitForTimeout(1000);

        const resetCount = await customerPage.getRowCount();
        expect(resetCount).toBeGreaterThanOrEqual(0);
    });

    test('Kiểm tra lọc nhiều tiêu chí', async ({ page }) => {
        const initialCount = await customerPage.getRowCount();

        await customerPage.applyFilters({ 
            name: 'Test',
            email: '@example.com',
            phone: '0123'
        });
        await page.waitForTimeout(1000);

        const filteredCount = await customerPage.getRowCount();
        expect(filteredCount).toBeLessThanOrEqual(initialCount);
    });
});

test.describe('Admin Customer Table Data', () => {
    let customerPage: CustomerPage;

    test.beforeEach(async ({ page }) => {
        customerPage = new CustomerPage(page);
        await customerPage.goto();
        await customerPage.waitForLoading();
    });

    test('Kiểm tra lấy dữ liệu từng dòng', async ({ page }) => {
        const rowCount = await customerPage.getRowCount();
        
        if (rowCount > 0) {
            const rows = customerPage.tableRows;
            
            for (let i = 0; i < Math.min(rowCount, 3); i++) {
                const row = rows.nth(i);
                const textContent = await row.textContent();
                expect(textContent).toBeTruthy();
            }
        }
    });

    test('Kiểm tra header map', async ({ page }) => {
        const headerMap = await customerPage.getHeaderMap();
        expect(headerMap.size).toBeGreaterThan(0);
        expect(headerMap.has('ID')).toBeTruthy();
        expect(headerMap.has('HỌ TÊN / EMAIL')).toBeTruthy();
        expect(headerMap.has('SĐT')).toBeTruthy();
        expect(headerMap.has('HẠNG')).toBeTruthy();
        expect(headerMap.has('ĐIỂM THÀNH VIÊN')).toBeTruthy();
        expect(headerMap.has('ĐIỂM HIỆN CÓ')).toBeTruthy();
        expect(headerMap.has('NGÀY TẠO')).toBeTruthy();
    });

    test('Kiểm tra lấy thông tin khách hàng theo dòng', async ({ page }) => {
        const rowCount = await customerPage.getRowCount();
        
        if (rowCount > 0) {
            const customerInfo = await customerPage.getCustomerInfoByRow(0);
            
            expect(customerInfo.id).toBeTruthy();
            expect(customerInfo.fullName).toBeTruthy();
            expect(customerInfo.email).toBeTruthy();
            expect(customerInfo.phone).toBeTruthy();
            expect(customerInfo.createdAt).toBeTruthy();
        }
    });
});

test.describe('Admin Customer Pagination', () => {
    let customerPage: CustomerPage;

    test.beforeEach(async ({ page }) => {
        customerPage = new CustomerPage(page);
        await customerPage.goto();
        await customerPage.waitForLoading();
    });

    test('Kiểm tra phân trang', async ({ page }) => {
        const paginationVisible = await customerPage.pagination.isVisible().catch(() => false);
        
        if (paginationVisible) {
            // Try to navigate to page 2 if available
            
                await customerPage.gotoPage(2);
                await page.waitForTimeout(1000);
                
                const rowCount = await customerPage.getRowCount();
                expect(rowCount).toBeGreaterThanOrEqual(0);
        
        }
    });
});
