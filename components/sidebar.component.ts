import { Page, Locator } from '@playwright/test';

export class SidebarComponent {
  private page: Page;

  // ==== LOCATORS ====
  sidebar: Locator;
  toggleBtn: Locator;

  // Menu items
  profile: Locator;
  dashboard: Locator;
  tickets: Locator;
  employees: Locator;
  customers: Locator;
  orders: Locator;

  // Sự kiện (collapse)
  eventMenuToggle: Locator;
  eventMenu: Locator;
  leagues: Locator;
  teams: Locator;
  stadiums: Locator;
  matchs: Locator;

  // Báo cáo (collapse)
  reportMenuToggle: Locator;
  reportMenu: Locator;
  revenueReport: Locator;
  ticketStatus: Locator;
  promotion:Locator;
  ticketRefund:Locator;
  transactionHistory:Locator;

  // Footer
  logout: Locator;

  constructor(page: Page) {
    this.page = page;

    this.sidebar = page.locator('#sidebar');
    this.toggleBtn = page.locator('.toggle-btn');

    this.profile = page.locator('a.sidebar-link[href="profile.html"]');
    this.dashboard = page.locator('a.sidebar-link[href="dashboard.html"]');
    this.tickets = page.locator('a.sidebar-link[href="tickets/tickets.html"]');
    this.employees = page.locator('a.sidebar-link[href="employees/employees.html"]');
    this.customers = page.locator('a.sidebar-link[href="customers/customers.html"]');
    this.orders = page.locator('a.sidebar-link[href="orders/orders.html"]');

    // ---- Sự kiện ----
    this.eventMenuToggle = page.locator('[data-bs-target="#eventMenu"]');
    this.eventMenu = page.locator('#eventMenu');
    this.leagues = page.locator('a.sidebar-link[href="events/leagues.html"]');
    this.teams = page.locator('a.sidebar-link[href="events/teams.html"]');
    this.stadiums = page.locator('a.sidebar-link[href="events/stadiums.html"]');
    this.matchs = page.locator('a.sidebar-link[href="events/matchs.html"]');

    // ---- Báo cáo ----
    this.reportMenuToggle = page.locator('[data-bs-target="#reportMenu"]');
    this.reportMenu = page.locator('#reportMenu');
    this.revenueReport = page.locator('a.sidebar-link[href="reports/revenue.html"]');
    this.ticketStatus = page.locator('a.sidebar-link[href="reports/ticket-status.html"]');
    this.promotion = page.locator('a.sidebar-link[href="promotions/promotions.html"]');
    this.ticketRefund = page.locator('a.sidebar-link[href="returns/returns.html"]');
    this.transactionHistory = page.locator('a.sidebar-link[href="payments/payments.html"]');
    // Footer
    this.logout = page.locator('a[href="#logout"]');
  }

  // ==== ACTIONS ====

  async clickProfile() {
    await this.profile.click();
  }

  async clickPromotion() {
    await this.promotion.click();
  }
  async clickTicketRefund() {
    await this.ticketRefund.click();
  } 
  async clickTransactionHistory() {
    await this.transactionHistory.click();
  }
  async clickDashboard() {
    await this.dashboard.click();
  }

  async clickTickets() {
    await this.tickets.click();
  }

  async clickEmployees() {
    await this.employees.click();
  }

  async clickCustomers() {
    await this.customers.click();
  }

  async clickOrders() {
    await this.orders.click();
  }

  // ====== EVENT MENU ======
  async openEventMenu() {
    if (!(await this.eventMenu.isVisible())) {
      await this.eventMenuToggle.click();
    }
  }

  async clickLeagues() {
    await this.openEventMenu();
    await this.leagues.click();
  }

  async clickTeams() {
    await this.openEventMenu();
    await this.teams.click();
  }

  async clickStadiums() {
    await this.openEventMenu();
    await this.stadiums.click();
  }

  async clickMatchs() {
    await this.openEventMenu();
    await this.matchs.click();
  }

  // ====== REPORT MENU ======
  async openReportMenu() {
    if (!(await this.reportMenu.isVisible())) {
      await this.reportMenuToggle.click();
    }
  }

  async clickRevenueReport() {
    await this.openReportMenu();
    await this.revenueReport.click();
  }

  async clickTicketStatus() {
    await this.openReportMenu();
    await this.ticketStatus.click();
  }

  // ====== FOOTER ======
  async logoutClick() {
    await this.logout.click();
  }
}
