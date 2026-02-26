import { test, expect, type Page } from '@playwright/test';
import { TicketPage } from '../../../pages/admin/ticket.page';
import { TicketAddPage } from '../../../pages/admin/ticket_add.page';
import {TicketEditPage} from "../../../pages/admin/ticket_edit.page";
import { TicketPriceHistoryPage } from '../../../pages/admin/ticket_pricehistory.page';
test.use({ storageState: 'playwright/.auth/admin.json', });
test.describe('Admin Ticket Page', () => {
    let ticketPage :TicketPage;
    let ticketAddPage :TicketAddPage;
    let ticketEditPage :TicketEditPage;
    test.beforeEach(async ({ page }) => {
        ticketPage = new TicketPage(page);
        await ticketPage.goto();
    });
    test('Kiểm tra hiển thị trang vé', async ({ page }) => {
        await ticketPage.expectPageLoaded();
    });
test('kiểm tra chức năng qua trang', async ({ page }) => {
    await ticketPage.expectPageLoadedPagination();
});
test('kiểm tra chức năng lọc theo môn thể thao', async ({ page }) => {
    await ticketPage.expectApplyFilterTicket("Manchester", "Football");
});
});

test.describe('Admin Ticket Add Flow', () => {
    let ticketPage: TicketPage;
    let ticketAddPage: TicketAddPage;

    test.beforeEach(async ({ page }) => {
        ticketPage = new TicketPage(page);
        ticketAddPage = new TicketAddPage(page);
        
        // Vào trang ticket từ sidebar
        await ticketPage.goto();
        
        // Nhấn nút "Thêm vé"
        await ticketPage.clickAddTicket();
    });

    test('Kiểm tra hiển thị trang Tạo vé sau khi nhấn nút Thêm', async ({ page }) => {
        await expect(ticketAddPage.matchesTable).toBeVisible();
        await expect(ticketAddPage.searchInput).toBeVisible();
    });

    test('Kiểm tra chức năng tìm kiếm trên trang Tạo vé', async ({ page }) => {
        await ticketAddPage.searchMatch('Manchester');
        await page.waitForTimeout(1000);
        await expect(ticketAddPage.tableRows.first()).toBeVisible();
    });

    test('Kiểm tra lọc theo loại trận đấu', async ({ page }) => {
        const firstOption = await ticketAddPage.matchTypeFilter.locator('option').nth(1).getAttribute('value');
        if (firstOption) {
            await ticketAddPage.filterMatch(firstOption);
            await page.waitForTimeout(1000);
        }
    });
/*
    test('Kiểm tra phân trang', async ({ page }) => {
        await ticketAddPage.waitForTableLoaded();
        const hasRows = await ticketAddPage.tableRows.count();
        expect(hasRows).toBeGreaterThan(0);
    });
*/
    test('Kiểm tra click nút Tạo vé trên một dòng', async ({ page }) => {
        await ticketAddPage.waitForTableLoaded();
        const rowCount = await ticketAddPage.tableRows.count();
        
        if (rowCount > 0) {
            await ticketAddPage.clickCreateTicketAt(0);
            
            // Chờ để xem có navigate hay mở dialog
            await page.waitForTimeout(1500);
        }
    });
});

test.describe('Admin Ticket Edit Flow', () => {
    let ticketPage: TicketPage;
    let ticketEditPage: TicketEditPage;

    test.beforeEach(async ({ page }) => {
        ticketPage = new TicketPage(page);
        ticketEditPage = new TicketEditPage(page);
        
        // Vào trang ticket từ sidebar
        await ticketPage.goto();
        
        // Đợi table load xong
        await page.waitForTimeout(2000);
    });

    test('Kiểm tra click vào một dòng để vào trang chỉnh sửa', async ({ page }) => {
        await ticketPage.expectPageLoadedPagination();
        const rowCount = await ticketPage.tableRows.count();
        
        if (rowCount > 0) {
            const row = ticketPage.tableRows.locator("button >> text=Vé đang bán").first();
            
            // Setup listener cho navigation
            
            // Click vào dòng
            await row.click();
            
            // Đợi navigation hoặc page update
            await page.waitForTimeout(1500);
        }
    });
/*
    test('Kiểm tra form chỉnh sửa có các field cần thiết', async ({ page }) => {
        const rowCount = await ticketPage.tableRows.count();
        
        if (rowCount > 0) {
            // Tìm cell nào có link/button để edit (nếu có)
            const row = ticketPage.tableRows.nth(0);
            const cells = row.locator('td');
            
            // Click vào cell cuối cùng hoặc cell nào có action button
            const cellCount = await cells.count();
            if (cellCount > 0) {
                await cells.last().click();
                await page.waitForTimeout(1500);
            }
        }
    });
*/
    test('Kiểm tra điền thông tin vào form chỉnh sửa', async ({ page }) => {
        await ticketPage.expectPageLoadedPagination();
        const rowCount = await ticketPage.tableRows.count();
        
        if (rowCount > 0) {
            const row = ticketPage.tableRows.locator("button >> text=Vé đang bán").nth(1);            
                await row.click();
                await page.waitForTimeout(1500);
                
                // Kiểm tra xem có form xuất hiện không
                const isFormVisible = await ticketEditPage.isFormVisible().catch(() => false);
                if (isFormVisible) {
                    await ticketEditPage.fillNewPrice('150000');
                    expect(await ticketEditPage.getNewPrice()).toBe('150000');
                }
            
        }
    });
});

test.describe('Admin Price History Flow', () => {
    let ticketPage: TicketPage;
    let priceHistoryPage: TicketPriceHistoryPage;

    test.beforeEach(async ({ page }) => {
        ticketPage = new TicketPage(page);
        priceHistoryPage = new TicketPriceHistoryPage(page);
        
        // Vào trang ticket từ sidebar
        await ticketPage.goto();
    });

    test('Kiểm tra nhấn nút Xem Lịch sử Giá', async ({ page }) => {
        // Nhấn nút "Lịch sử giá"
        await ticketPage.clickPriceHistory();
        
        // Đợi page load
        await page.waitForTimeout(1500);
        
        // Kiểm tra table có xuất hiện không
        await expect(priceHistoryPage.priceHistoryTable).toBeVisible();
    });

    test('Kiểm tra tính năng tìm kiếm trên trang Lịch sử giá', async ({ page }) => {
        await ticketPage.clickPriceHistory();
        await page.waitForTimeout(1500);
        
        // Tìm kiếm
        await priceHistoryPage.searchTicket('Anh Thu');
        await page.waitForTimeout(1000);
        
        // Lọc từng dòng và lấy textContent
        const rows = priceHistoryPage.priceHistoryTable.locator('tbody tr');
        const rowCount = await rows.count();
        
        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const textContent = await row.textContent();
            if (textContent) {
                expect(textContent).toContain('Anh Thu');
            }
        }
    });

    test('Kiểm tra hiển thị dữ liệu lịch sử giá', async ({ page }) => {
        await ticketPage.clickPriceHistory();
        await page.waitForTimeout(1500);
        
        const rowCount = await priceHistoryPage.getRowCount().catch(() => 0);
        if (rowCount > 0) {
            const rowData = await priceHistoryPage.getRowData(0).catch(() => []);
            expect(rowData.length).toBeGreaterThan(0);
        }
    });

    test('Kiểm tra nút quay lại', async ({ page }) => {
        await ticketPage.clickPriceHistory();
        await page.waitForTimeout(1500);
        
        // Click back button
        await priceHistoryPage.clickBack();
        await page.waitForTimeout(1000);
    });
});

