const { test, expect } = require('@playwright/test');
const NsiloginPage = require('../pages/NsiloginPage');
const loginData = require('../fixture/nsilogin.fixture.json');
const { VenuePage } = require('../pages/venuePage');
const venueData = require('../fixture/venue.fixture.json');

// You may want to add a Venue listing page object for better assertions, but we'll use a basic assertion for now

test.describe('Venue Tests', () => {
  test.beforeEach(async ({ page }) => {
    const nsiloginPage = new NsiloginPage(page);
    await nsiloginPage.navigate();
    await nsiloginPage.login(loginData.valid.username, loginData.valid.password);
    // Optionally verify login
    expect(await page.url()).toContain('/TenantDashboard');
    await page.waitForTimeout(2000);
    // Verify username on dashboard
    const username = await page.locator('//*[@id="kt_quick_user_toggle"]').textContent(); // Updated selector
    expect(username).toContain('admin');
    await page.waitForTimeout(3000);
  });

  test('Create a new venue with training module and training type', async ({ page }) => {
    const venuePage = new VenuePage(page);
    await venuePage.openVenueForm();
    await venuePage.createVenue();
    await venuePage.fillVenueForm(venueData.withTraining);
    await venuePage.saveVenue();
    await page.waitForTimeout(2000);
    // Basic assertion: check for venue name in the list (improve as needed)
    await expect(page.locator(`text=${venueData.withTraining.name}`)).toBeVisible();

    // Only check if the modules include 'Training'
    if (venueData.withTraining.modules && venueData.withTraining.modules.includes('Training')) {
      const isListed = await venuePage.checkTrainingVenueListed('2081/082 (2024/25)', venueData.withTraining.name);
      expect(isListed).toBeTruthy();
      await venuePage.close();
      await page.click("(//a[@href='/App/TenantDashboard'])[1]");
      await page.waitForTimeout(2000);
    }
    // Only check if the modules include 'CSSP'
    if (venueData.withTraining.modules && venueData.withTraining.modules.includes('CSSP')) {
      const isCsspListed = await venuePage.checkCsspVenueListed('2081/082 (2024/25)', venueData.withTraining.name);
      expect(isCsspListed).toBeTruthy();
    }
  });

  test.only('Validating venue name already exist', async ({ page }) => {
    const venuePage = new VenuePage(page);
    await venuePage.openVenueForm();
    await venuePage.createVenue();
    await venuePage.fillVenueForm(venueData.alreadyExist);
    await venuePage.saveVenue();
    await page.waitForTimeout(4000);
    // Assert error message for duplicate venue name
    await expect(page.locator('text=Venue name or Pan Number already exists.')).toBeVisible();
  });

  
}); 