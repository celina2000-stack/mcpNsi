const { test, expect } = require('@playwright/test');
const NsiloginPage = require('../pages/NsiloginPage');
const loginData = require('../fixture/nsilogin.fixture.json');
const { CadreSetupPage } = require('../pages/CadreSetupPage');
const cadreSetupData = require('../fixture/CadreSetup.fixture.json');

test.describe('Cadre Setup Tests', () => {
  test.beforeEach(async ({ page }) => {
    const nsiloginPage = new NsiloginPage(page);
    await nsiloginPage.navigate();
    await nsiloginPage.login(loginData.valid.username, loginData.valid.password);
    expect(await page.url()).toContain('/TenantDashboard');
    const username = await page.locator('//*[@id="kt_quick_user_toggle"]').textContent();
    expect(username).toContain('admin');
    await page.waitForTimeout(2000);
  });

  test('Create a new cadre group and verify in cadre setup', async ({ page }) => {
    const cadreSetupPage = new CadreSetupPage(page);
    // Create Cadre Group
    await cadreSetupPage.navigateToCadreGroupSetups();
    await page.waitForTimeout(2000);
    await cadreSetupPage.createCadreGroup(cadreSetupData.cadreGroup.name);
    // Navigate to Cadre Setups and open create form
    await cadreSetupPage.navigateToCadreSetups();
    await page.waitForTimeout(2000);
    await page.click(cadreSetupPage.createNewCadreSetupButton);
    await page.waitForTimeout(4000);
    // Verify the created cadre group is available in the dropdown
    const options = await page.$$eval(
      `${cadreSetupPage.cadreGroupDropdown} option`,
      opts => opts.map(o => o.textContent)
    );
    expect(options).toContain(cadreSetupData.cadreGroup.name);
    // Now create Cadre Setup
    await page.selectOption(cadreSetupPage.cadreGroupDropdown, { label: cadreSetupData.cadreSetup.cadreGroup });
    await page.fill(cadreSetupPage.cadreNameInput, cadreSetupData.cadreSetup.cadreName);
    await page.fill(cadreSetupPage.cadreDescriptionInput, cadreSetupData.cadreSetup.cadreDescription);
    await page.click(cadreSetupPage.cadreSetupSaveButton);
    await page.waitForTimeout(2000);
    
  });

  test.only('Validate required field error for cadre name', async ({ page }) => {
    const cadreSetupPage = new CadreSetupPage(page);
    await cadreSetupPage.navigateToCadreSetups();
    await page.click(cadreSetupPage.createNewCadreSetupButton);
    await page.selectOption(cadreSetupPage.cadreGroupDropdown, { label: cadreSetupData.cadreGroup.name });
    await page.fill(cadreSetupPage.cadreNameInput, '');
    await page.click(cadreSetupPage.cadreSetupSaveButton);
    const errorMessage = await page.textContent('text="This field is required."');
    expect(errorMessage).toBe('This field is required.');
  });
}); 