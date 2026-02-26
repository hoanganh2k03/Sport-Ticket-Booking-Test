import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";
import { BASE_URL } from "../../utils/config";
export class LoginPage extends BasePage  {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberCheckbox: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator("#username");
    this.passwordInput = page.locator("#password");
    this.rememberCheckbox = page.locator("#remember");
    this.loginButton = page.locator("button[type='submit']");
    this.forgotPasswordLink = page.locator("a[href*='forgot_password']");
  }

  async open() {
    await this.page.goto(`${this.basePagesUrl}`.replace('/admin', '') + `/login_empl.html`); 
    // Hoặc thay bằng URL thật: await this.page.goto("http://localhost:5500/login.html");
  }

  async enterUsername(username: string) {
    await this.usernameInput.fill(username);


  }

  async enterPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async toggleRemember() {
    await this.rememberCheckbox.check();
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  /**
   * Hàm login tổng
   */
  async login(username: string, password: string, remember: boolean = false) {
    await this.enterUsername(username);
    await this.enterPassword(password);

    if (remember) {
      await this.toggleRemember();
    }

    await this.clickLogin();
  }
}
