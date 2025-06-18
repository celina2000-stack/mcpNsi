const { expect } = require('@playwright/test');
const { time } = require('console');

class VenuePage {
  constructor(page) {
    this.page = page;
    // Main navigation/menu locators
    this.setupMenu = "//span[contains(@class, 'menu-text') and normalize-space(text())='Setup']";
    this.venueMenu = "//span[contains(@class, 'menu-text') and normalize-space(text())='Venue']";
    this.createVenueButton = "//button[@id='CreateNewVenueButton']";
    this.venueNameInput = "//input[@id='Venue_Name']";
    this.provinceSelect = "//select[@id='provinceId']";
    this.districtDropdownButton = "//span[contains(@class,'k-picker') and @aria-labelledby='districtId_label']//span[@role='button']";
    this.districtList = district => `//ul[@id='districtId_listbox']/li[span[text()='${district}']]`;
    this.addressInput = "//input[@id='Venue_Description']";
    this.statusSelect = "//select[@id='configChoice_IsActive']";
    this.contactNoInput = "//input[@id='Venue_ContactNo']";
    this.difficultyDropdownButton = "//label[normalize-space(text())='Difficulty factor']/following-sibling::span[contains(@class,'k-picker')]//span[@role='button']";
    this.difficultyOption = value => "//ul[@id='difficultyFactorId_listbox']/li[span[contains(@class,'k-list-item-text') and text()='" + value + "']]";
    this.bonusDropdownButton = "//label[normalize-space(text())='Bonus level']/following-sibling::span[contains(@class,'k-picker')]//span[@role='button']";
    this.bonusOption = value => "//ul[@id='bonusLevelId_listbox']/li[span[contains(@class,'k-list-item-text') and text()='" + value + "']]";
    this.emailInput = "//input[@id='Venue_EmailAddress']";
    this.affiliationCheckbox = "//input[@id='Venue_AffiliationCheckbox']";
    this.addAffiliationButton = "//button[contains(@class,'k-grid-add') and contains(.,'Program Affiliation Date')]";
    this.affiliationStartDateInput = "//input[@id='AffiliationStartDate']";
    this.affiliationEndDate = "(//td[@role='gridcell'])[3]";
    this.affiliationEndDateInput = "//input[@id='AffiliationEndDate']";
    this.affiliationAddButton = "//button[contains(@class,'k-grid-details') and span[text()='Add']]";
    this.moduleInput = "(//div[@id='configChoiceModule_taglist'])[1]";
    this.moduleOption = module => `//ul[@id='configChoiceModule_listbox']/li[span[text()='${module}']]`;
    this.trainingTypeDropdown = "//div[@id='trainingTypeId_taglist']/ancestor::span[contains(@class,'k-multiselect')]";
    this.trainingTypeOption = type => `//ul[@id='trainingTypeId_listbox']/li[span[text()='${type}']]`;
    this.sanctionBedsInput = "//input[@id='Venue_NoOfSanctionBeds']";
    this.availableBedsInput = "//input[@id='Venue_NoOfAvailableBeds']";
    this.saveAffiliationButton = "//button[@id='btnSavePopUp']";
    this.saveVenueButton = "//button[contains(@class,'save-button') and span[text()='Save']]";
  }

  async openVenueForm() {
    await this.page.click(this.setupMenu);
    await this.page.click(this.venueMenu);
    await this.page.waitForTimeout(2000);
  }
  async createVenue(){
    await this.page.waitForTimeout(2000);
    await this.page.click(this.createVenueButton);
    await this.page.waitForTimeout(2000);
  }

  async fillVenueForm({
    name,
    province,
    district,
    address,
    status,
    contactNo,
    difficultyFactor,
    bonusLevel,
    email,
    isAffiliated,
    affiliationDates = [],
    modules = [],
    trainingType = null,
    sanctionBeds = '',
    availableBeds = ''
  }) {
    await this.page.fill(this.venueNameInput, name);
    await this.page.selectOption(this.provinceSelect, { label: province });
    await this.page.click(this.districtDropdownButton);
    await this.page.click(this.districtList(district));
    await this.page.fill(this.addressInput, address);
    await this.page.selectOption(this.statusSelect, { label: status });
    await this.page.fill(this.contactNoInput, contactNo);
    await this.page.click(this.difficultyDropdownButton);
    await this.page.click(this.difficultyOption(difficultyFactor));
    await this.page.click(this.bonusDropdownButton);
    await this.page.click(this.bonusOption(bonusLevel));
    await this.page.fill(this.emailInput, email);
    if (isAffiliated) {
      await this.page.click(this.affiliationCheckbox);
      for (const { start, end } of affiliationDates) {
        await this.page.click(this.addAffiliationButton);
        await this.page.fill(this.affiliationStartDateInput, start);
        await this.page.click(this.affiliationEndDate);
        await this.page.waitForTimeout(2000);
        await this.page.fill(this.affiliationEndDateInput, end);
        await this.page.click(this.affiliationAddButton);
        // Module selection
        
        for (const module of modules) {
            await this.page.waitForTimeout(2000);
            await this.page.click(this.moduleInput);
            await this.page.waitForTimeout(2000);
            await this.page.click(this.moduleOption(module));
        }
        if (modules.includes('Training') && trainingType) {
          await this.page.click(this.trainingTypeDropdown);
          await this.page.click(this.trainingTypeOption(trainingType));
        }
        await this.page.fill(this.sanctionBedsInput, sanctionBeds);
        await this.page.fill(this.availableBedsInput, availableBeds);
        await this.page.click(this.saveAffiliationButton);
      }
    }
  }

  async saveVenue() {
    await this.page.click(this.saveVenueButton);
  }

  async checkTrainingVenueListed(fiscalYear, venueName) {
    // Go to Entries > Training > Training Living Support
    await this.page.waitForTimeout(2000);
    await this.page.click("//span[contains(@class, 'menu-text') and normalize-space(text())='Entries']");
    await this.page.click("//span[contains(@class, 'menu-text') and normalize-space(text())='Training']");
    await this.page.click("//span[contains(@class, 'menu-text') and normalize-space(text())='Training Living Support']");
    await this.page.waitForTimeout(2000);
    // Click Create
    await this.page.click("//button[@id='CreateNewQuarterSupportsButton']");
    // Select fiscal year
    await this.page.click("//select[@id='FiscalYearId']");
    await this.page.selectOption("//select[@id='FiscalYearId']", { label: fiscalYear });
    // Open venue dropdown
    await this.page.click("//label[normalize-space(text())='Venue']/following-sibling::span[contains(@class,'k-picker')]//span[@role='button']");
    // Wait for dropdown to render
    await this.page.waitForTimeout(500);
    // Check if venue is present in the dropdown list
    const venueOption = await this.page.$(`//ul[@id='TrainingSiteId_listbox']/li[span[text()='${venueName}']]`);
    return !!venueOption;
  }
  async close(){
    await this.page.click("(//button[normalize-space()='Close'])[1]");
  }

  async checkCsspVenueListed(fiscalYear, venueName) {
    // Go to Entries > CSSP > Living Support
    await this.page.waitForTimeout(2000);
    await this.page.click("//span[contains(@class, 'menu-text') and normalize-space(text())='Entries']");
    await this.page.click("//span[contains(@class, 'menu-text') and normalize-space(text())='CSSP']");
    await this.page.click("//span[contains(@class, 'menu-text') and normalize-space(text())='Living Support']");
    await this.page.waitForTimeout(2000);
    // Click Create
    await this.page.click("//button[@id='CreateNewQuarterSupportsButton']");
    // Select fiscal year
    await this.page.click("//select[@id='FiscalYearId']");
    await this.page.selectOption("//select[@id='FiscalYearId']", { label: fiscalYear });
    // Open venue dropdown
    await this.page.click("//label[normalize-space(text())='Venue']/following-sibling::span[contains(@class,'k-picker')]//span[@role='button']");
    await this.page.waitForTimeout(500);
    // Check if venue is present in the dropdown list
    const venueOption = await this.page.$(`//ul[@id='TrainingSiteId_listbox']/li[span[text()='${venueName}']]`);
    return !!venueOption;
  }
}

module.exports = { VenuePage }; 