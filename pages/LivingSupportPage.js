const { expect } = require('@playwright/test');

class LivingSupportPage {
  constructor(page) {
    this.page = page;
    // Navigation selectors
    this.setupNav = "span.menu-text:has-text('Setup')";
    this.livingSupportSetupNav = "span.menu-text:has-text('Living Support Setup')";
    this.livingSupportSubNav = "a.menu-link[href='/App/QuarterSupportSetups']";
    this.createNewLivingSupportButton = '#CreateNewQuarterSupportSetupsButton';
    this.livingSupportGridAddButton = '#QuarterSupportSetupGrid .k-grid-add';
    this.livingSupportNameInput = 'input#LivingSupport';
    this.hasItemCheckbox = '#IsItem';
    this.gridUpdateButton = 'button.k-grid-update';
    this.expandRowButton = rowName => `tr:has(td:has-text('${rowName}')) .k-hierarchy-cell .k-icon.k-i-expand`;
    this.itemGridAddButton = 'tr.k-detail-row .QuarterSupportSetupsItemGrid .k-grid-add, .QuarterSupportSetupsItemGrid .k-grid-add';
    this.itemNameInput = 'input#ItemName';
  }

  async navigateToLivingSupportSetup() {
    await this.page.click(this.setupNav);
    await this.page.click(this.livingSupportSetupNav);
    await this.page.click(this.livingSupportSubNav);
    await this.page.waitForTimeout(2000);
  }

  async createLivingSupport(name, hasItem = true) {
    await this.page.click(this.createNewLivingSupportButton);
    await this.page.click(this.livingSupportGridAddButton);
    await this.page.fill(this.livingSupportNameInput, name);
    if (hasItem) {
      await this.page.click(this.hasItemCheckbox);
    }
    await this.page.click(this.gridUpdateButton);
    await this.page.waitForTimeout(1000);
  }

  async expandLivingSupportRow(name) {
    await this.page.click(this.expandRowButton(name));
    await this.page.waitForTimeout(1000);
  }

  async addItemToLivingSupport(itemName) {
    await this.page.click(this.itemGridAddButton);
    await this.page.fill(this.itemNameInput, itemName);
    await this.page.click(this.gridUpdateButton);
    await this.page.waitForTimeout(1000);
  }

  async addMultipleItemsToLivingSupport(itemNames) {
    for (const item of itemNames) {
      await this.addItemToLivingSupport(item);
    }
  }

  async verifyItemListed(itemName) {
    await expect(this.page.locator(`.QuarterSupportSetupsItemGrid td:has-text('${itemName}')`)).toBeVisible();
  }
  async goto() {
    await this.page.goto('https://mnev2qa.exolutus.com/App/QuarterSupports');
    await this.page.waitForTimeout(3000);
  }
  async create() {
    await this.page.click('button#CreateNewQuarterSupportsButton');
  }
  async verifyLivingSupportInDropdown(livingSupportName) {
    
    await this.page.waitForSelector('#FiscalYearId');
    // Select fiscal year and venue to enable the detail grid
    await this.page.selectOption('#FiscalYearId', { label: '2081/082 (2024/25)' });
    await this.page.click('label[for="trainingSiteId"] ~ span .k-input-button');
    await this.page.click('ul[role="listbox"] >> text=Seti Provincial Hospital');
    await this.page.waitForTimeout(2000);
    // Add a detail row to access the Living Support dropdown
    await this.page.click('#QuarterSupportDetailGrid .k-grid-add');
    await this.page.waitForTimeout(2000);
    // Open the Living Support dropdown
    await this.page.click('#QuarterSupportDetailGrid tr td:nth-child(3) .k-input-button');
    await this.page.waitForTimeout(2000);
    // Get all options
    const options = await this.page.$$eval('ul[role="listbox"] li[role="option"]', els => els.map(e => e.textContent.trim()));
    if (!options.includes(livingSupportName)) {
      throw new Error(`Living support "${livingSupportName}" not found in dropdown options: ${options.join(', ')}`);
    }
    // Close the dropdown (optional)
    await this.page.keyboard.press('Escape');
    
  }

   async createLivingSupport(livingSupportName) {
    await this.page.click('#QuarterSupportDetailGrid tr td:nth-child(2) .k-input-button');
    await this.page.waitForTimeout(2000);
    await this.page.click('ul[role="listbox"] >> text=AA');
    await this.page.click('#QuarterSupportDetailGrid tr td:nth-child(3) .k-input-button');
    await this.page.waitForTimeout(2000);
    await this.page.click(`ul[role="listbox"] >> text=${livingSupportName}`);
    await this.page.click('#QuarterSupportDetailGrid tr td:nth-child(5) .k-input-button');
    await this.page.waitForTimeout(2000);
    await this.page.click('ul[role="listbox"] >> text=Q1');
    await this.page.click('#QuarterSupportDetailGrid tr td:nth-child(4)');
    await this.page.waitForTimeout(2000);
    await this.page.fill('#QuarterSupportDetailGrid tr td input[name="Cost"]', '1000');
    await this.page.waitForTimeout(2000);
    await this.page.click('#QuarterSupportDetailGrid tr td .k-grid-update');
    await this.page.waitForTimeout(2000);
  }
   async expandLivingSupportDetail(livingSupportName) {
    const row = await this.page.locator('#QuarterSupportDetailGrid tr.k-master-row', { hasText: livingSupportName });
    await row.locator('td.k-hierarchy-cell a.k-icon').click();
  }

  async verifyQuarterItemsDropdown(expectedItems) {
    await this.page.click('.QuarterSupportDetailItemGrid .k-grid-add');
    await this.page.click('.QuarterSupportDetailItemGrid tr.k-grid-edit-row td:nth-child(3) .k-input-button');
    await this.page.waitForTimeout(2000);
    const options = await this.page.$$eval('ul[role="listbox"] li[role="option"]', els => els.map(e => e.textContent.trim()));
    for (const item of expectedItems) {
      if (!options.includes(item)) {
        throw new Error(`Quarter item "${item}" not found in dropdown options: ${options.join(', ')}`);
      }
    }
  }
  
}

module.exports = { LivingSupportPage }; 