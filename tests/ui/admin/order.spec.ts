import { test, expect, type Page } from '@playwright/test';
import OrdersPage from '../../../pages/admin/order.page';
import { OrderBookingPage } from '../../../pages/admin/order_booking.page';
import { OrderQrCodePage } from '../../../pages/admin/order_qrcode.page';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin Order Management Page', () => {
    let ordersPage: OrdersPage;

    test.beforeEach(async ({ page }) => {
        ordersPage = new OrdersPage(page);
        await ordersPage.goto();
    });

    test('Kiểm tra hiển thị trang quản lý đơn hàng', async ({ page }) => {
        await expect(ordersPage.tableBody).toBeVisible();
        await expect(ordersPage.btnAddOrder).toBeVisible();
        await expect(ordersPage.btnFilter).toBeVisible();
    });

    test('Kiểm tra lọc theo trạng thái', async ({ page }) => {
        await ordersPage.filterStatus.selectOption('pending');
        await ordersPage.btnFilter.click();
        await page.waitForTimeout(1000);
        await expect(ordersPage.tableBody).toBeVisible();
    });

    test('Kiểm tra lọc theo phương thức thanh toán', async ({ page }) => {
        await ordersPage.filterMethod.selectOption('online');
        await ordersPage.btnFilter.click();
        await page.waitForTimeout(1000);
        await expect(ordersPage.tableBody).toBeVisible();
    });

    test('Kiểm tra reset bộ lọc', async ({ page }) => {
        await ordersPage.filterKeyword.fill('test');
        await ordersPage.btnReset.click();
        await page.waitForTimeout(1000);
        await expect(ordersPage.filterKeyword).toHaveValue('');
    });

    test('Kiểm tra xem chi tiết đơn hàng', async ({ page }) => {
        const firstRow = ordersPage.tableBody.locator('tr').first();
        const orderIdCell = firstRow.locator('td').first();
        const orderId = await orderIdCell.innerText();

        if (orderId) {
            await ordersPage.openOrderDetail(orderId);
            await expect(ordersPage.modalDetail).toBeVisible();
        }
    });
});

test.describe('Order Booking Page - From Order Page', () => {
    let ordersPage: OrdersPage;
    let bookingPage: OrderBookingPage;

    test.beforeEach(async ({ page }) => {
        ordersPage = new OrdersPage(page);
        bookingPage = new OrderBookingPage(page);
        await ordersPage.goto();
    });

    test('Mở modal thêm rồi bấm Next để vào trang đặt vé', async ({ page }) => {
        await ordersPage.btnAddOrder.click();
        await page.waitForTimeout(500);
        await expect(ordersPage.modalAddOrder).toBeVisible();
        const name =await ordersPage.customerDatalist.locator('option').first().getAttribute('value').catch(() => '') ?? '';
        await ordersPage.customerInput.fill(name);
        // Bấm Next để chuyển sang trang đặt vé
        await ordersPage.btnNextOrder.click();
        await page.waitForTimeout(1000);

        // Booking page có thể load trong cùng tab hoặc modal; kiểm tra field chính
        await expect(bookingPage.customerInput).toBeVisible();
    });

    test('Nhập khách hàng và chọn phương thức trên trang đặt vé', async ({ page }) => {
        await ordersPage.btnAddOrder.click();
        await page.waitForTimeout(500);
        const name =await ordersPage.customerDatalist.locator('option').first().getAttribute('value').catch(() => '') ?? '';
        await ordersPage.customerInput.fill(name);
        const data_id=await ordersPage.customerDatalist.locator('option').first().getAttribute('data-id').catch(() => '') ?? '';
        await ordersPage.btnNextOrder.click();
        await page.waitForTimeout(1000);
        await bookingPage.matchCards.first().click();
        await expect(bookingPage.customerInput).toHaveValue(data_id);
        await bookingPage.choosePayment('cash');
        
    });

    test('Chọn trận, khu vực, số lượng và xem tổng', async ({ page }) => {
        await ordersPage.btnAddOrder.click();
        await page.waitForTimeout(500);
        const name = await ordersPage.customerDatalist.locator('option').first().getAttribute('value').catch(() => '') ?? '';
        await ordersPage.customerInput.fill(name);
        const data_id = await ordersPage.customerDatalist.locator('option').first().getAttribute('data-id').catch(() => '') ?? '';
        await ordersPage.btnNextOrder.click();
        await page.waitForTimeout(1000);

        await bookingPage.selectMatch(2).catch(() => {});
        await bookingPage.selectSection(5).catch(() => {});
       const text = await bookingPage.sectionsBox.locator('> div').first().locator('.form-check-label').innerText();
       const match = text.match(/\((\d+\.\d+) VND\)/);
       const price = match ? match[1] : null; 
       await expect(bookingPage.subtotalPrice).toHaveText(price ?? '');

    });
});

test.describe('Order QR Code Page - From Booking Flow', () => {
    let ordersPage: OrdersPage;
    let bookingPage: OrderBookingPage;
    let qrCodePage: OrderQrCodePage;

    test.beforeEach(async ({ page }) => {
        ordersPage = new OrdersPage(page);
        bookingPage = new OrderBookingPage(page);
        qrCodePage = new OrderQrCodePage(page);
        await ordersPage.goto();
    });

    test('Đặt vé từ Order page và hiển thị trang QR code', async ({ page }) => {
        // Open Add Order modal -> Next -> Booking page
        await ordersPage.btnAddOrder.click();
        await page.waitForTimeout(500);
        await ordersPage.btnNextOrder.click();
        await page.waitForTimeout(1000);

        // Fill booking minimal info
        const name = await ordersPage.customerDatalist.locator('option').first().getAttribute('value').catch(() => '') ?? '';
        await ordersPage.customerInput.fill(name);
        await ordersPage.btnNextOrder.click();
        await page.waitForTimeout(500);
        const matchCards = await bookingPage.matchCards.count().catch(() => 0);
        if (matchCards > 0) {
            await bookingPage.matchCards.first().click().catch(() => {});
            await page.waitForTimeout(300);
            await bookingPage.selectSection(5).catch(() => {});
            await bookingPage.setQuantity(5, 1).catch(() => {});
        }

        try { await bookingPage.choosePayment('cash'); } catch (e) {}
        // Confirm booking
        await bookingPage.confirmBooking().catch(() => {});
        await page.waitForTimeout(1000);

        // Check QR page or order id presence 
            // Validate QR page elements
            await expect(qrCodePage.orderId).toBeVisible();
            const orderIdText = (await qrCodePage.orderId.innerText()).trim();
            expect(orderIdText.length).toBeGreaterThan(0);
            await expect(qrCodePage.printBtn).toBeVisible();
            await expect(qrCodePage.homeBtn).toBeVisible();
            const tickets = await qrCodePage.getTicketCount();
            expect(tickets).toBeGreaterThan(0);
        
    });
});
