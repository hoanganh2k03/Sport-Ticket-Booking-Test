import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./base.page";

export class PromotionEditPage extends BasePage {
  readonly endTimeInput: Locator;
  readonly usageLimitInput: Locator;
  readonly descriptionInput: Locator;
  readonly bulkMatchSelect: Locator;
  readonly sectionMatchSelect: Locator;
  readonly sectionSectionSelect: Locator;
  readonly btnBulkApply: Locator;
  readonly btnApplySection: Locator;
  readonly updateButton: Locator;
  readonly appliedList: Locator;
  readonly discountValueInput: Locator;
  readonly btnSectionTab: Locator;
  constructor(page: Page) {
    super(page);

    this.endTimeInput = page.locator('#end_time');
    this.usageLimitInput = page.locator('#usage_limit');
    this.descriptionInput = page.locator('#description');
    this.bulkMatchSelect = page.locator('#bulk_match');
    this.sectionMatchSelect = page.locator('#section_match');
    this.sectionSectionSelect = page.locator('#section_section');
    this.btnBulkApply = page.locator('#btnBulkApply');
    this.btnApplySection = page.locator('#btnApplySection');
    this.updateButton = page.locator('#btnUpdate');
    this.appliedList = page.locator('#appliedList');
    this.discountValueInput = page.locator('input#discount_value');
    this.btnSectionTab = page.locator("button >> text= Theo khu vực");
  }

  async fillEndTime(value: string) {
    await this.endTimeInput.fill(value);
  }

  async fillUsageLimit(value: string) {
    await this.usageLimitInput.fill(value);
  }

  async fillDescription(value: string) {
    await this.descriptionInput.fill(value);
  }

  async selectBulkMatch(matchId: string) {
    await this.bulkMatchSelect.selectOption(matchId);
  }

  async clickBulkApply() {
    await this.btnBulkApply.click();
  }

  async selectSectionMatch(matchId: string) {
    await this.sectionMatchSelect.selectOption(matchId);
  }

  async selectSection(sectionName: string) {
    await this.sectionSectionSelect.selectOption(sectionName);
  }

  async clickApplySection() {
    await this.btnApplySection.click();
  }

  async verifyAppliedItemContains(text: string) {
    await expect(this.appliedList).toContainText(text);
  }
  async fillDiscountValue(value: string) {
    await this.discountValueInput.fill(value);
  }
  async clickUpdate() {
    await this.updateButton.click();
  }
  async clickSectionTab() {
    await this.btnSectionTab.click();
  }

  async editPromotion({ endTime, usageLimit, description }: { endTime: string; usageLimit: string; description: string; }) {
    if (endTime) await this.fillEndTime(endTime);
    if (usageLimit) await this.fillUsageLimit(usageLimit);
    if (description) await this.fillDescription(description);
  }
}
