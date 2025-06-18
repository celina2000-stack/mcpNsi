const { expect } = require('@playwright/test');

class CadreSetupPage {
  constructor(page) {
    this.page = page;
    // Navigation selectors
    this.setupNav = 'nav >> text=Setup';
    this.cadreGroupSetupsLink = 'a.menu-link[href="/App/CadreGroupSetups"]';
    this.cadreSetupsLink = 'a.menu-link[href="/App/CadreSetups"]';
    // Cadre Group Setup selectors
    this.createNewCadreGroupButton = '#CreateNewCadreGroupSetupButton';
    this.cadreGroupNameInput = '#CadreGroupSetup_CadreGroup';
    this.saveButton = '.modal.show .save-button';
    // Cadre Setup selectors
    this.createNewCadreSetupButton = '#CreateNewCadreSetupButton';
    this.cadreGroupDropdown = '#cadreGroupSetupId';
    this.cadreNameInput = '#CadreSetup_Cadre';
    this.cadreDescriptionInput = '#CadreSetup_CadreDescription';
    this.cadreSetupSaveButton = '.modal.show .save-button';
  }

  async navigateToCadreGroupSetups() {
    await this.page.click(this.setupNav);
    await this.page.click(this.cadreGroupSetupsLink);
    await this.page.waitForTimeout(2000);
  }

  async createCadreGroup(cadreGroupName) {
    await this.page.click(this.createNewCadreGroupButton);
    await this.page.fill(this.cadreGroupNameInput, cadreGroupName);
    await this.page.click(this.saveButton);
    await this.page.waitForTimeout(2000);
  }

  async navigateToCadreSetups() {
    await this.page.click(this.setupNav);
    await this.page.click(this.cadreSetupsLink);
    await this.page.waitForTimeout(2000);
  }

  async createCadreSetup(cadreGroup, cadreName, cadreDescription) {
    await this.page.click(this.createNewCadreSetupButton);
    await this.page.selectOption(this.cadreGroupDropdown, { label: cadreGroup });
    await this.page.fill(this.cadreNameInput, cadreName);
    if (cadreDescription) {
      await this.page.fill(this.cadreDescriptionInput, cadreDescription);
    }
    await this.page.click(this.cadreSetupSaveButton);
    await this.page.waitForTimeout(2000);
  }
}

module.exports = { CadreSetupPage }; 