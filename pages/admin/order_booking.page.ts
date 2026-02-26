import { expect, Locator, Page } from "@playwright/test";
import {BasePage} from "./base.page";
export class OrderBookingPage extends BasePage{

    // --- Header ---
    readonly btnHome: Locator;

    // --- Filters ---
    readonly searchInput: Locator;
    readonly leagueFilter: Locator;
    readonly matchCards: Locator;

    // --- Booking Form ---
    readonly customerInput: Locator;
    readonly matchDetailBox: Locator;
    readonly sectionsBox: Locator;

    readonly subtotalPrice: Locator;
    readonly discountAmount: Locator;
    readonly totalPrice: Locator;

    readonly paymentMethod: Locator;
    readonly confirmBtn: Locator;

    constructor(page: Page) {
        super(page);
        // Header
        this.btnHome = page.locator('#home-btn');
        // Filters
        this.searchInput = page.locator('#search-input');
        this.leagueFilter = page.locator('#league-filter');
        this.matchCards = page.locator('.match-card');

        // Booking form
        this.customerInput = page.locator('#customer-input');
        this.matchDetailBox = page.locator('#match-detail');
        this.sectionsBox = page.locator('#sections');

        this.subtotalPrice = page.locator('#subtotal-price');
        this.discountAmount = page.locator('#discount-amount');
        this.totalPrice = page.locator('#total-price');

        this.paymentMethod = page.locator('#payment-method');
        this.confirmBtn = page.locator('#confirm-btn');
    }

    // Navigate
    async goto() {
        await this.page.goto('/pages/admin/orders/order_customer.html');
    }

    // Search match by keyword
    async searchMatch(keyword: string) {
        await this.searchInput.fill(keyword);
    }

    // Filter by league
    async filterByLeague(leagueName: string) {
        await this.leagueFilter.selectOption({ label: leagueName });
    }

    // Click match card by match_id (DOM: data-id="xxx")
    async selectMatch(matchId: number) {
        const card = this.page.locator(`.match-card[data-id="${matchId}"]`);
        await expect(card).toBeVisible();
        await card.click();
        await expect(this.matchDetailBox).toBeVisible();
    }

    // Select section (checkbox)
    async selectSection(sectionId: number) {
        const checkbox = this.page.locator(`#sec-${sectionId}`);
        await checkbox.check();
    }

    // Set quantity for section
    async setQuantity(sectionId: number, qty: number) {
        const qtyInput = this.page.locator(`#qty-${sectionId}`);
        await expect(qtyInput).toBeVisible();
        await qtyInput.fill(String(qty));
    }

    // Select promotion for section
    async selectPromo(sectionId: number, promoId: string) {
        const promoSelect = this.page.locator(`#promo-${sectionId}`);
        await expect(promoSelect).toBeVisible();
        await promoSelect.selectOption(promoId);
    }

    // Fill customer ID or phone
    async fillCustomer(customerId: string) {
        await this.customerInput.fill(customerId);
    }

    // Select payment method
    async choosePayment(method: 'cash' | 'transfer') {
        await this.paymentMethod.selectOption(method);
    }

    // Click confirm booking
    async confirmBooking() {
        await this.confirmBtn.click();
    }

    // Get total price
    async getTotal(): Promise<number> {
        const totalTxt = await this.totalPrice.innerText();
        return parseFloat(totalTxt);
    }

    // Assertion – total > 0
    async expectTotalGreaterThanZero() {
        const total = await this.getTotal();
        expect(total).toBeGreaterThan(0);
    }

    // Assertion – booking form should show match
    async expectMatchDetailVisible() {
        await expect(this.matchDetailBox).toBeVisible();
    }
}
