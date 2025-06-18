const { expect } = require('@playwright/test');

class DesignationPage {
  constructor(page) {
    this.page = page;
    this.setupNav = 'nav >> text=Setup';
    this.hrModuleSetup = 'text=HR Module Setup';
    this.designationLink = 'text=Designation';
    this.createNewButton = 'button >> text=Create New Designation';
    this.cadreGroupDropdown = 'select[name="cadreGroupSetupId"]';
    this.cadreDropdown = 'select[name="cadreSetupId"]';
    this.designationNameInput = 'input[name="designationName"]';
    this.saveButton = 'button.save-button';
  }

  async createnewDesignation(){
    await this.page.click(this.createNewButton);
  }
  async validateRequiredFieldError() {
    await this.page.click(this.saveButton);
    const errorMessage = await this.page.textContent('text="This field is required."');
    return errorMessage;
  }

  async navigateToDesignation() {
    await this.page.click(this.setupNav);
    await this.page.click(this.hrModuleSetup);
    await this.page.click(this.designationLink);
    await this.page.waitForTimeout(3000);
  }

  async createDesignation(cadreGroup, cadre, designationName) {
    await this.page.click(this.createNewButton);
    await this.page.waitForTimeout(3000);
    await this.page.selectOption(this.cadreGroupDropdown, { label: cadreGroup });
    await this.page.selectOption(this.cadreDropdown, { label: cadre });
    await this.page.fill(this.designationNameInput, designationName);
    await this.page.click(this.saveButton);
    await this.page.waitForTimeout(3000);
  }
}

module.exports = { DesignationPage };
