const { expect } = require('@playwright/test');

class ServicePage {
  constructor(page) {
    this.page = page;
    // Navigation selectors
    this.setupNav = "span.menu-text:has-text('Setup')";
    this.hmisSetupNav = "span.menu-text:has-text('HMIS Setup')";
    this.hospitalServicesNav = "span.menu-text:has-text('Hospital Services')";
    this.hmisFormTemplateNav = "span.menu-text:has-text('HMIS Form Template')";
    this.createNewServiceButton = '#CreateNewHospitalServiceButton';
    this.serviceNameInput = '#HospitalService_HospitalKeyService';
    this.saveServiceButton = 'button.save-button';
    this.createNewTemplateButton = '#CreateNewHospitalKeyPerformanceServiceIndicatorButton';
    this.programTypeDropdown = '#configChoiceHospitalTypeId';
    this.hmisVersionDropdown = '#hmisVersionId';
    this.keyServiceAddButton = 'button.k-grid-add';
    this.keyServiceDropdown = "#KeyPerformanceServiceGrid .k-picker[role='combobox']";
    this.keyServiceListItem = name => `li.k-list-item:has-text('${name}')`;
    this.displayOrderInput = "input[name='DisplayOrder'][type='text']";
    this.gridUpdateButton = 'button.k-grid-update';
    this.closeButton = 'button.close-button';
  }

  async navigateToHospitalServices() {
    await this.page.click(this.setupNav);
    await this.page.click(this.hmisSetupNav);
    await this.page.click(this.hospitalServicesNav);
    await this.page.waitForTimeout(2000);
  }

  async createService(serviceName) {
    await this.page.click(this.createNewServiceButton);
    await this.page.fill(this.serviceNameInput, serviceName);
    await this.page.click(this.saveServiceButton);
    await this.page.waitForTimeout(2000);
  }

  async navigateToFormTemplate() {
    await this.page.click(this.setupNav);
    await this.page.click(this.hmisSetupNav);
    await this.page.click(this.hmisFormTemplateNav);
    await this.page.waitForTimeout(2000);
  }

  async createFormTemplate(programType, hmisVersion) {
    await this.page.click(this.createNewTemplateButton);
    await this.page.selectOption(this.programTypeDropdown, { label: programType });
    await this.page.selectOption(this.hmisVersionDropdown, { label: hmisVersion });
    await this.page.waitForTimeout(1000);
  }

  async addKeyService(serviceName, displayOrder) {
    await this.page.click(this.keyServiceAddButton);
    await this.page.click(this.keyServiceDropdown);
    await this.page.click(this.keyServiceListItem(serviceName));
    await this.page.click("(//input[@data-validate='false'])[1]");  
    await this.page.fill(this.displayOrderInput, displayOrder);
    await this.page.click(this.gridUpdateButton);
    await this.page.waitForTimeout(1000);
  }

  async isServiceListed(serviceName) {
    // Returns true if the service is already listed in the grid
    return await this.page.locator(`text=${serviceName}`).isVisible();
  }

  async addMultipleKeyServices(servicesArray) {
    for (const service of servicesArray) {
      await this.addKeyService(service.serviceName, service.displayOrder);
    }
  }

  async closeForm() {
    await this.page.click(this.closeButton);
  }

  async verifyServiceListed(serviceName) {
    await expect(this.page.locator(`text=${serviceName}`)).toBeVisible();
  }
  async navigateToHmisEntry() {
    await this.page.click("span.menu-text:has-text('Entries')");
    await this.page.click("span.menu-text:has-text('CSSP')");
    await this.page.click("span.menu-text:has-text('HMIS Entry')");
    
  }
  async createHmisEntry() {
    await this.page.click('#CreateNewHospitalServiceEntryButton');
  }
  async fillHmisEntryForm(fixtureData) {
    const page = this.page;
    const hmisData = fixtureData.hmisEntry;
    
    await page.selectOption('#fiscalYearId', { label: hmisData.fiscalYear });
    await page.click("span[aria-labelledby='provinceId_label']");
    await page.click(`li.k-list-item:has-text('${hmisData.province}')`);
    await page.click("span[aria-labelledby='venueId_label']");
    await page.click(`li.k-list-item:has-text('${hmisData.venue}')`);
    await page.selectOption('#configChoiceDataTypeId', { label: hmisData.dataType });
    await page.click("span[aria-labelledby='configChoiceProgramTypeId_label'], span[aria-controls='configChoiceProgramTypeId_listbox']");
    await page.click(`li.k-list-item:has-text('${hmisData.programType}')`);
    await page.selectOption('#hmisVersionId', { label: hmisData.hmisVersion });
    await page.click("span[aria-labelledby='HospitalServiceEntry_ReportingPeriodId_label']");
    await page.click(`li.k-list-item:has-text('${hmisData.reportingPeriod}')`);
  }

  

  async verifyHmisEntryServices(services) {
    for (const service of services) {
      await expect(this.page.locator('#HospitalServiceEntryGrid td.text-bold', { hasText: service.serviceName })).toBeVisible();
    }
  }

  async setupServiceAndTemplate(serviceData) {
    // Create new service
    await this.navigateToHospitalServices();
    await this.createService(serviceData.valid.serviceName);
    
    // Create new form template
    await this.navigateToFormTemplate();
    await this.page.waitForTimeout(5000);
    await this.createFormTemplate(serviceData.valid.programType, serviceData.valid.hmisVersion);
    await this.page.waitForTimeout(3000);
  }

  async addAndVerifyKeyServices(serviceData) {
    await this.page.click(this.keyServiceAddButton);
    await this.page.click(this.keyServiceDropdown);
    
    // Check dropdown contains the recently added service
    await expect(this.page.locator('#HospitalServiceId_listbox li.k-list-item:has-text("' + serviceData.valid.serviceName + '")')).toBeVisible();
    
    // Add all key services from the array
    for (const service of serviceData.templateServices) {
      await this.page.waitForTimeout(5000);
      await this.addKeyService(service.serviceName, service.displayOrder);
      await this.page.waitForTimeout(5000);
      await this.verifyServiceListed(service.serviceName);
    }
    await this.closeForm();
  }
}

module.exports = { ServicePage }; 