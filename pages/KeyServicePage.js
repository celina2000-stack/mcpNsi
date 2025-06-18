const { expect } = require('@playwright/test');

class KeyServicePage {
  constructor(page) {
    this.page = page;
    this.setupNav = "span.menu-text:has-text('Setup')";
    this.keyServiceSetupNav = "span.menu-text:has-text('Key Service Setup')";
    this.keyServicesNav = "span.menu-text:has-text('Key Services')";
    this.keyPerformanceServiceIndicatorsNav = "span.menu-text:has-text('Key Performance Service Indicators')";
    this.createNewKeyServiceButton = '#CreateNewKeyServiceButton';
    this.keyServiceNameInput = '#KeyService_KeyServices';
    this.keyServiceTypeDropdown = '#configChoiseKeyServiceTypeId';
    this.saveKeyServiceButton = 'button.save-button';
    this.createNewKPSIButton = '#CreateNewKeyPerformanceServiceIndicatorButton';
    this.hospitalTypeDropdown = '#configChoiceIdHospitalTypeId';
    this.keyVersionDropdown = '#keyVersionId';
    this.kpsiAddButton = '.k-grid-add';
    this.kpsiServiceDropdown = "#KeyPerformanceServiceGrid .k-picker[role='combobox']";
    this.kpsiServiceListItem = name => `li.k-list-item:has-text('${name}')`;
    this.displayOrderInput = "td[data-container-for='DisplayOrder'] input[type='text']:not([style*='display: none'])";
    this.gridUpdateButton = 'button.k-grid-update';
    this.closeButton = 'button.close-button';
  }

  async navigateToKeyServices() {
    await this.page.click(this.setupNav);
    await this.page.click(this.keyServiceSetupNav);
    await this.page.click(this.keyServicesNav);
    await this.page.waitForTimeout(3000);
  }

  async createKeyService(serviceName, serviceType) {
    await this.page.click(this.createNewKeyServiceButton);
    await this.page.selectOption(this.keyServiceTypeDropdown, { label: serviceType });
    await this.page.fill(this.keyServiceNameInput, serviceName);
    await this.page.click(this.saveKeyServiceButton);
    await this.page.waitForTimeout(2000);
  }

  async navigateToKPSI() {
    await this.page.click(this.setupNav);
    await this.page.click(this.keyServiceSetupNav);
    await this.page.click(this.keyPerformanceServiceIndicatorsNav);
    await this.page.waitForTimeout(3000);
  }

  async createKPSI(hospitalType, keyVersion) {
    await this.page.click(this.createNewKPSIButton);
    await this.page.selectOption(this.hospitalTypeDropdown, { label: hospitalType });
    await this.page.selectOption(this.keyVersionDropdown, { label: keyVersion });
    await this.page.waitForTimeout(2000);
  }

  async addKeyPerformanceService(serviceName, displayOrder) {
    await this.page.waitForTimeout(2000);   
    await this.page.click(this.kpsiAddButton);
    await this.page.waitForTimeout(2000);
    await this.page.click(this.kpsiServiceDropdown);
    await this.page.waitForTimeout(2000);
    await this.page.click(this.kpsiServiceListItem(serviceName));
    await this.page.waitForTimeout(2000);
    await this.page.click(this.displayOrderInput);
    await this.page.waitForTimeout(2000);
    await this.page.fill(this.displayOrderInput, displayOrder);
    await this.page.click(this.gridUpdateButton);
    await this.page.waitForTimeout(2000);
  }

  async verifyKeyPerformanceServiceListed(serviceName) {
    await expect(this.page.locator(`text=${serviceName}`)).toBeVisible();
  }

  async verifyAllKeyServicesListed(servicesArray) {
    for (const service of servicesArray) {
      await expect(this.page.locator('td.text-bold', { hasText: service.serviceName })).toBeVisible();
    }
  }

  async closeForm() {
    await this.page.click(this.closeButton);
  }

  async navigateToKPSIEntries() {
    await this.page.click("span.menu-text:has-text('Entries')");
    await this.page.click("span.menu-text:has-text('Mss Hospitals')");
    await this.page.click("span.menu-text:has-text('Key Performance Service Indicator Entries')");
    await this.page.waitForTimeout(2000);
  }

  async createKPSIEntry() {
    await this.page.click('#CreateNewKeyPerformanceServiceIndicatorEntryButton');
    await this.page.waitForTimeout(1000);
  }

  async fillKPSIEntryForm(entryData) {
    // Venue
    await this.page.click("(//span[@aria-label='select'])[1]");
    await this.page.click(`li.k-list-item:has-text('${entryData.venue}')`);
    // Hospital Type
    await this.page.click("span[aria-labelledby='configChoiceHospitalTypeId_label']");
    await this.page.click(`li.k-list-item:has-text('${entryData.hospitalType}')`);
    // Key Version
    await this.page.selectOption('#keyVersionId', { label: entryData.keyVersion });
    // Date
    await this.page.fill('#Date', entryData.date);
    // Observer Name
    if (entryData.observerName) {
      await this.page.fill('#KeyPerformanceServiceIndicatorEntry_ObserverName', entryData.observerName);
    }
  }
}

module.exports = { KeyServicePage }; 