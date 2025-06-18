class CadreSalaryPage {
  constructor(page) {
    this.page = page;
    this.setupMenu = page.locator("//a[contains(@class, 'menu-link') and contains(@class, 'menu-toggle')][.//span[contains(@class, 'menu-text') and normalize-space(text())='Setup']]");
    this.hrModuleSetupMenu = page.locator("//a[contains(@class, 'menu-link') and contains(@class, 'menu-toggle')][.//span[contains(@class, 'menu-text') and normalize-space(text())='HR Module Setup']]");
    this.cadreSalaryMenu = page.locator("//a[contains(@class, 'menu-link')][.//span[contains(@class, 'menu-text') and normalize-space(text())='Cadre Salary']]");
    this.createNewButton = page.locator('#CreateNewCadreSalaryButton');
    this.cadreGroupSelect = page.locator('#cadreGroupSetupId');
    this.cadreSelect = page.locator('#cadreSetupId');
    this.designationDropdown = page.locator('#designationId_label');
    this.designationOption = (option) => page.locator(`li[role='option'] .k-list-item-text:has-text('${option}')`);
    this.paymentCheckbox = (row) => page.locator(`#cadreSalaryGrid .k-grid-content tr.k-master-row:nth-child(${row}) input[type='checkbox']`);
    this.saveButton = page.locator('button.save-button');
    this.cadreSalaryTable = page.locator('#cadreSalaryGrid .k-grid-content');
  }

  async navigateToCadreSalary() {
    await this.setupMenu.click();
    await this.hrModuleSetupMenu.click();
    await this.cadreSalaryMenu.click();
    await this.page.waitForTimeout(2000);
  }
  
  async openCadreSalaryForm() {
    await this.createNewButton.click();
  }

  async fillCadreSalaryForm(cadreGroup, cadre, designation) {
    await this.cadreGroupSelect.selectOption({ label: cadreGroup });
    await this.cadreSelect.selectOption({ label: cadre });
    await this.designationDropdown.click();
    await this.designationOption(designation).click();
  }

  async selectPaymentCheckbox(paymentItems) {
    // paymentItems: array of payment item names (e.g., ['Basic Salary', 'Gratuity'])
    for (const paymentName of paymentItems) {
      await this.page.evaluate((name) => {
        const rows = Array.from(document.querySelectorAll('#cadreSalaryGrid .k-grid-content tr'));
        for (const row of rows) {
          const paymentCell = row.querySelector('td:nth-child(3)');
          if (paymentCell && paymentCell.textContent.trim() === name) {
            const checkbox = row.querySelector('input[type="checkbox"]');
            if (checkbox && !checkbox.checked) {
              checkbox.click();
            }
          }
        }
      }, paymentName);
    }
  }

  async save() {
    await this.saveButton.click();
    await this.page.waitForTimeout(2000);
  }

  async verifyCadreSalaryRowExists({ cadreGroup, cadre, designation }, expect) {
    const row = this.page.locator('#CadreSalariesTable tr', {
      hasText: cadreGroup
    }).filter({
      hasText: cadre
    }).filter({
      hasText: designation
    });
    await expect(row).toHaveCount(1);
  }

  async verifyPaymentItemsInGrid(paymentItems, expect) {
    for (const item of paymentItems) {
      const locator = this.page.locator('#PaymentItemGrid td', { hasText: item });
      await expect(locator).toHaveCount(1);
    }
    await this.page.waitForTimeout(2000);
  }

  async navigateToEmployeeDetailsMenu() {
    await this.page.click("//span[contains(@class, 'menu-text') and normalize-space(text())='Entries']");
    await this.page.click("//span[contains(@class, 'menu-text') and normalize-space(text())='HR']");
    await this.page.click("//span[contains(@class, 'menu-text') and normalize-space(text())='Employee Details']");
    await this.page.waitForTimeout(2000);
  }

  async openEmployeeActionMenu(fullName = 'test123 test1') {
    await this.page.click(`//tr[td[contains(text(),'${fullName}')]]//button[contains(@class,'dropdown-toggle') and contains(@class,'btn-brand')]`);
  }

  async editEmployee(fullName = 'test123 test1') {
    await this.page.click(`//tr[td[contains(text(),'${fullName}')]]//a[contains(@class,'dropdown-item') and contains(text(),'Edit')]`);
    await this.page.waitForTimeout(3000);
  }

  async navigateToServiceRecordTab() {
    await this.page.click("//div[contains(@class,'wizard-step')]//h5[contains(@class,'wizard-title') and normalize-space(text())='Service Record']");
    await this.page.waitForTimeout(2000);
  }

  async openServiceRecordCreateForm() {
    await this.page.click( "//button[contains(.,'Create') or contains(@class,'btn') and contains(@class,'create') or contains(@id,'Create') or contains(@title,'Create')]");
    await this.page.waitForTimeout(1000);
  }

  async fillServiceRecordForm({ cadreGroup, cadre, designation }) {
    // Select Cadre Group
    await this.page.selectOption('#cadreGroupId', { label: cadreGroup });
    await this.page.waitForTimeout(2000);
    // Select Cadre
    await this.page.click('#CadreSetupId_label');
    await this.page.click(`li.k-list-item:has-text('${cadre}')`);
    // Select Designation
    await this.page.click('#designationId_label');
    await this.page.click(`li.k-list-item:has-text('${designation}')`);
    await this.page.waitForTimeout(2000);
  }

}

module.exports = { CadreSalaryPage }; 