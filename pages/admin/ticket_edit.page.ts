import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export class TicketEditPage extends BasePage {
  // Display fields (read-only)
  readonly matchDescription: Locator;
  readonly stadiumName: Locator;
  readonly sectionName: Locator;
  readonly matchTime: Locator;
  readonly sellDate: Locator;
  readonly oldPrice: Locator;

  // Input fields
  readonly newPriceInput: Locator;
  readonly effectiveDateInput: Locator;
  readonly reasonInput: Locator;

  // Hidden fields
  readonly changedByInput: Locator;

  // Form & Button
  readonly updatePriceForm: Locator;
  readonly submitButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    super(page);

    // Display fields (read-only)
    this.matchDescription = page.locator("#match_description");
    this.stadiumName = page.locator("#stadium_name");
    this.sectionName = page.locator("#section_name");
    this.matchTime = page.locator("#match_time");
    this.sellDate = page.locator("#sell_date");
    this.oldPrice = page.locator("#old_price");

    // Input fields
    this.newPriceInput = page.locator("#newPrice");
    this.effectiveDateInput = page.locator("#effectiveDate");
    this.reasonInput = page.locator("#reason");

    // Hidden fields
    this.changedByInput = page.locator("#changedBy");

    // Form & Button
    this.updatePriceForm = page.locator("#update-price-form");
    this.submitButton = this.updatePriceForm.locator("button[type='submit']");
    this.backButton = page.locator("button").filter({ hasText: "Quay lại" });
  }

  // 👉 Get display field values
  async getMatchDescription(): Promise<string> {
    return await this.matchDescription.inputValue();
  }

  async getStadiumName(): Promise<string> {
    return await this.stadiumName.inputValue();
  }

  async getSectionName(): Promise<string> {
    return await this.sectionName.inputValue();
  }

  async getMatchTime(): Promise<string> {
    return await this.matchTime.inputValue();
  }

  async getSellDate(): Promise<string> {
    return await this.sellDate.inputValue();
  }

  async getOldPrice(): Promise<string> {
    return await this.oldPrice.inputValue();
  }

  // 👉 Fill input fields
  async fillNewPrice(price: string) {
    await this.newPriceInput.fill(price);
  }

  async fillEffectiveDate(date: string) {
    await this.effectiveDateInput.fill(date);
  }

  async fillReason(reason: string) {
    await this.reasonInput.fill(reason);
  }

  // 👉 Get input field values
  async getNewPrice(): Promise<string> {
    return await this.newPriceInput.inputValue();
  }

  async getEffectiveDate(): Promise<string> {
    return await this.effectiveDateInput.inputValue();
  }

  async getReason(): Promise<string> {
    return await this.reasonInput.inputValue();
  }

  // 👉 Submit form
  async submitForm() {
    await this.submitButton.click();
  }

  // 👉 Click back button
  async clickBackButton() {
    await this.backButton.click();
  }

  // 👉 Fill complete form
  async fillEditForm(newPrice: string, effectiveDate: string, reason: string) {
    await this.fillNewPrice(newPrice);
    await this.fillEffectiveDate(effectiveDate);
    await this.fillReason(reason);
  }

  // 👉 Submit form and wait for success
  async submitAndWait() {
    await this.submitForm();
    // Chờ modal/alert đóng hoặc page navigate
    await this.page.waitForTimeout(2000);
  }

  // 👉 Check if form is visible
  async isFormVisible(): Promise<boolean> {
    return await this.updatePriceForm.isVisible();
  }
}
