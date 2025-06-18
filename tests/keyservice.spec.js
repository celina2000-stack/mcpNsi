const { test, expect } = require('@playwright/test');
const NsiloginPage = require('../pages/NsiloginPage');
const loginData = require('../fixture/nsilogin.fixture.json');
const { KeyServicePage } = require('../pages/KeyServicePage');
const keyServiceData = require('../fixture/KeyService.fixture.json');

test.describe('Key Service Setup & KPSI Tests', () => {
  test.beforeEach(async ({ page }) => {
    const nsiloginPage = new NsiloginPage(page);
    await nsiloginPage.navigate();
    await nsiloginPage.login(loginData.valid.username, loginData.valid.password);
    expect(await page.url()).toContain('/TenantDashboard');
    const username = await page.locator('//*[@id="kt_quick_user_toggle"]').textContent();
    expect(username).toContain('admin');
    await page.waitForTimeout(3000);
  });

  test('Create a new key service and add to KPSI grid', async ({ page }) => {
    const keyServicePage = new KeyServicePage(page);
    // Create new key service
    await keyServicePage.navigateToKeyServices();
    await keyServicePage.createKeyService(keyServiceData.valid.serviceName, keyServiceData.valid.serviceType);
    // Go to KPSI
    await keyServicePage.navigateToKPSI();
    await keyServicePage.createKPSI(keyServiceData.kpsiEntry.hospitalType, keyServiceData.kpsiEntry.keyVersion);
    // Open the key performance service dropdown to check if the service is available
    await page.click(keyServicePage.kpsiAddButton);
    await page.click(keyServicePage.kpsiServiceDropdown);
    await expect(page.locator(`#KeyServiceId_listbox li.k-list-item:has-text('${keyServiceData.valid.serviceName}')`)).toBeVisible();
    // Add all key services from the array
    for (const service of keyServiceData.templateServices) {
      await keyServicePage.addKeyPerformanceService(service.serviceName, service.displayOrder);
      await keyServicePage.verifyKeyPerformanceServiceListed(service.serviceName);
    }
    await keyServicePage.closeForm();

    // Now create and verify Key Performance Service Indicator Entry
    await keyServicePage.navigateToKPSIEntries();
    await page.waitForTimeout(2000);
    await keyServicePage.createKPSIEntry();
    await page.waitForTimeout(2000);
    await keyServicePage.fillKPSIEntryForm(keyServiceData.entriesEntry);
    
    await page.waitForTimeout(3000);
    await keyServicePage.verifyAllKeyServicesListed(keyServiceData.templateServices);
    await page.click('#btnSubmitKeyServiceEntry');
  });

  test('Attempt to add duplicate key service', async ({ page }) => {
    const keyServicePage = new KeyServicePage(page);
    // Navigate to Key Services using page object method
    await keyServicePage.navigateToKeyServices();
    // Use the page object method to create a key service with a duplicate name
    await keyServicePage.createKeyService(keyServiceData.duplicate.serviceName, keyServiceData.valid.serviceType);
    // Assert error message is visible
    await expect(page.locator('text=Please Enter Unique Service Name !!!')).toBeVisible();
  });

  test('Required field validation on Key Services creation', async ({ page }) => {
    const keyServicePage = new KeyServicePage(page);
    // Navigate to Key Services
    await keyServicePage.navigateToKeyServices();
    // Click create new key service
    await page.click('#CreateNewKeyServiceButton');
    // Click save without filling any fields
    await page.click('button.save-button');
    // Assert required field errors are visible
    await expect(page.locator('#configChoiseKeyServiceTypeId-error')).toHaveText('This field is required.');
    await expect(page.locator('#KeyService_KeyServices-error')).toHaveText('This field is required.');
  });

  test.only('Key Services are sorted in ascending order when column header is clicked', async ({ page }) => {
    const keyServicePage = new KeyServicePage(page);
    // Navigate to Key Services
    await keyServicePage.navigateToKeyServices();
    // Click the Key Services column header to sort ascending
    await page.click('th:has-text("Key Services")');
    await page.waitForTimeout(1000);
    // Extract the visible key service names from the first page
    const serviceNames = await page.$$eval('#KeyServicesTable td:nth-child(3)', tds => tds.map(td => td.textContent.trim()));
    // Check that the names are in ascending order
    const sorted = [...serviceNames].sort((a, b) => a.localeCompare(b));
    expect(serviceNames).toEqual(sorted);
  });
}); 