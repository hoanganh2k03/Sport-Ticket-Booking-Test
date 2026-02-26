import { Page,Locator } from '@playwright/test';
import { BASE_URL } from "../../utils/config";
import {SidebarComponent} from "../../components/sidebar.component";
export class BasePage {
  // 1. Phụ thuộc cốt lõi
  readonly page: Page;
  readonly sidebar:SidebarComponent;
  readonly basePagesUrl: string;

constructor(page: Page) {
    this.page = page;
    this.basePagesUrl = `${BASE_URL}/pages/admin`;
    this.sidebar=new SidebarComponent(page);
}

}