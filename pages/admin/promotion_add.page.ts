// src/pages/admin/promotions/addPromotion.page.ts
import { expect, Locator, Page } from "@playwright/test";
import {BasePage} from "./base.page";

export default class AddPromotionPage extends BasePage {
    readonly promoCode: Locator;
    readonly discountType: Locator;
    readonly discountValue: Locator;
    readonly startTime: Locator;
    readonly endTime: Locator;
    readonly description: Locator;
    readonly usageLimit: Locator;
    readonly btnSubmit: Locator;
    readonly btnBulkApply: Locator;
    readonly btnSectionApply: Locator;

    readonly matchBulkSelect: Locator;
    readonly matchSectionSelect: Locator;
    readonly sectionSectionSelect: Locator;
    readonly btnSectionTab: Locator;
    readonly appliedList: Locator;

    constructor(page: Page) {
        super(page);

        this.promoCode = page.locator("#promo_code");
        this.discountType = page.locator("#discount_type");
        this.discountValue = page.locator("#discount_value");
        this.startTime = page.locator("#start_time");
        this.endTime = page.locator("#end_time");
        this.description = page.locator("#description");
        this.usageLimit = page.locator("#usage_limit");

        this.matchBulkSelect = page.locator("#match_bulk");
        this.matchSectionSelect = page.locator("#section_match");
        this.sectionSectionSelect = page.locator("#section_section");
        this.btnSectionTab = page.locator("button >> text= Thêm theo từng khu vực");
        this.btnBulkApply = page.locator("#btnBulkApply");
        this.btnSectionApply = page.locator("#btnApplySection");
        this.btnSubmit = page.locator("button[type='submit']");
        this.appliedList = page.locator("#appliedList");
    }

    /** 
     * Điền form Promotion
     */
    async fillForm(data: {
        promo_code: string;
        discount_type: "percentage" | "amount";
        discount_value: number;
        start_time: string;   // yyyy-MM-ddTHH:mm
        end_time: string;
        usage_limit: number;
        description?: string;
    }) {
        await this.promoCode.fill(data.promo_code);
        await this.discountType.selectOption(data.discount_type);
        await this.discountValue.fill(String(data.discount_value));
        await this.startTime.fill(data.start_time);
        await this.endTime.fill(data.end_time);
        await this.usageLimit.fill(String(data.usage_limit));

        if (data.description) {
            await this.description.fill(data.description);
        }
    }

    /**
     * Chọn Bulk Match → Áp dụng All Section
     */
    async applyBulk(matchText: string) {
        await this.matchBulkSelect.selectOption({ label: matchText });
        await this.btnBulkApply.click();
        await expect(this.appliedList).toContainText(`${matchText} - All Section`);
    }

    /**
     * Chọn từng Section
     */
    async applySection(matchText: string, sectionText: string) {
        await this.matchSectionSelect.selectOption({ label: matchText });
        await this.sectionSectionSelect.selectOption({ label: sectionText });
        await this.btnSectionApply.click();

        await expect(this.appliedList).toContainText(`${matchText} - ${sectionText}`);
    }

    /**
     * Submit form
     */
    async submitPromotion() {
        await this.btnSubmit.click();
    }
}
