import { test, expect, type Page } from '@playwright/test';
import EmployeePage from '../../../pages/admin/employee.page';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin Employee Page', () => {
    let employeePage: EmployeePage;

    test.beforeEach(async ({ page }) => {
        employeePage = new EmployeePage(page);
        await employeePage.goto();
    });

    test('Kiểm tra hiển thị trang nhân viên', async ({ page }) => {
        await employeePage.waitForLoading();
        await expect(employeePage.table).toBeVisible();
    });

    test('Kiểm tra số lượng dòng trong bảng', async ({ page }) => {
        const rowCount = await employeePage.getRowCount();
        expect(rowCount).toBeGreaterThan(0);
    });

    test('Kiểm tra lấy tên nhân viên từ dòng đầu', async ({ page }) => {
        const rowCount = await employeePage.getRowCount();
        if (rowCount > 0) {
            const employeeName = await employeePage.getEmployeeNameAt(0);
            expect(employeeName).toBeTruthy();
        }
    });
});

test.describe('Admin Employee Add Flow', () => {
    let employeePage: EmployeePage;

    test.beforeEach(async ({ page }) => {
        employeePage = new EmployeePage(page);
        await employeePage.goto();
        await employeePage.waitForLoading();
    });

    test('Kiểm tra mở modal thêm nhân viên', async ({ page }) => {
        await employeePage.openAddModal();
        await expect(employeePage.modalTitle).toBeVisible();
    });

    test('Kiểm tra nhập thông tin và lưu nhân viên', async ({ page }) => {
        await employeePage.openAddModal();

        await employeePage.fillEmployeeForm({
            name: 'Test Employee',
            citizenId: '012345678',
            email: 'test@example.com',
            phone: '0123456780',
            dateOfBirth: '1990-01-01',
            gender: '0',
            role: 'staff',
            imagePath: 'utils/image/image1.jpg',
            address: '123 Test Street'
        });

        await employeePage.modalSaveBtn.click();
        await page.waitForTimeout(1000);

        // Kiểm tra modal đóng
        const isModalHidden = await employeePage.modal.isHidden().catch(() => true);
        expect(isModalHidden).toBeTruthy();
    });

    test('Kiểm tra form fields visible', async ({ page }) => {
        await employeePage.openAddModal();

        await expect(employeePage.nameInput).toBeVisible();
        await expect(employeePage.emailInput).toBeVisible();
        await expect(employeePage.phoneInput).toBeVisible();
        await expect(employeePage.roleSelect).toBeVisible();
        await expect(employeePage.genderSelect).toBeVisible();
    });
});

test.describe('Admin Employee Edit Flow', () => {
    let employeePage: EmployeePage;

    test.beforeEach(async ({ page }) => {
        employeePage = new EmployeePage(page);
        await employeePage.goto();
        await employeePage.waitForLoading();
    });

    test('Kiểm tra mở modal chỉnh sửa nhân viên', async ({ page }) => {
        const rowCount = await employeePage.getRowCount();
        
        if (rowCount > 0) {
            await employeePage.openEditModal(0);
            await expect(employeePage.modal).toBeVisible();
        }
    });

    test('Kiểm tra chỉnh sửa thông tin nhân viên', async ({ page }) => {
        const rowCount = await employeePage.getRowCount();
        
        if (rowCount > 0) {
            await employeePage.openEditModal(0);

            await employeePage.fillEmployeeForm({
                name: 'Updated Employee Name',
            });

            await employeePage.modalSaveBtn.click();
            await page.waitForTimeout(1000);
        }
    });
});

test.describe('Admin Employee Lock/Unlock Flow', () => {
    let employeePage: EmployeePage;

    test.beforeEach(async ({ page }) => {
        employeePage = new EmployeePage(page);
        await employeePage.goto();
        await employeePage.waitForLoading();
    });

    test('Kiểm tra khóa nhân viên', async ({ page }) => {
        const rowCount = await employeePage.getRowCount();
        
        if (rowCount > 0) {
            await employeePage.lockEmployee(1);
            await expect(employeePage.confirmDisableModal).toBeVisible();
            await employeePage.confirmLock();
            await page.waitForTimeout(1000);
            
            // Row count should remain the same (only locked, not deleted)
            const rowCountAfter = await employeePage.getRowCount();
            expect(rowCountAfter).toBe(rowCount);
        }
    });

    test('Kiểm tra kích hoạt nhân viên', async ({ page }) => {
        const rowCount = await employeePage.getRowCount();
        
        if (rowCount > 0) {
            // Try to unlock if available
            const unlockedBtn = employeePage.unlockBtns.first();
            const isVisible = await unlockedBtn.isVisible({ timeout: 500 }).catch(() => false);
            
            if (isVisible) {
                await employeePage.unlockEmployee(1);
                await page.waitForTimeout(1000);
                
                const rowCountAfter = await employeePage.getRowCount();
                expect(rowCountAfter).toBe(rowCount);
            }
        }
    });
});

test.describe('Admin Employee Table Data', () => {
    let employeePage: EmployeePage;

    test.beforeEach(async ({ page }) => {
        employeePage = new EmployeePage(page);
        await employeePage.goto();
        await employeePage.waitForLoading();
    });

    test('Kiểm tra lấy dữ liệu từng dòng', async ({ page }) => {
        const rowCount = await employeePage.getRowCount();
        
        if (rowCount > 0) {
            const rows = employeePage.tableRows;
            
            for (let i = 0; i < Math.min(rowCount, 3); i++) {
                const row = rows.nth(i);
                const textContent = await row.textContent();
                expect(textContent).toBeTruthy();
            }
        }
    });

    test('Kiểm tra header map', async ({ page }) => {
        const headerMap = await employeePage.getHeaderMap();
        expect(headerMap.size).toBeGreaterThan(0);
    });
});
