const { test, expect } = require('@playwright/test');
const NsiloginPage = require('../pages/NsiloginPage');
const loginData = require('../fixture/nsilogin.fixture.json');
const { ServicePage } = require('../pages/ServicePage');
const serviceData = require('../fixture/Service.fixture.json');

test.describe('Service/Key Service Tests', () => {
  test.beforeEach(async ({ page }) => {
    const nsiloginPage = new NsiloginPage(page);
    await nsiloginPage.navigate();
    await nsiloginPage.login(loginData.valid.username, loginData.valid.password);
    expect(await page.url()).toContain('/TenantDashboard');
    const username = await page.locator('//*[@id="kt_quick_user_toggle"]').textContent();
    expect(username).toContain('admin');
    await page.waitForTimeout(5000);
  });

  test.only('Create a new service and add to Key Service grid', async ({ page }) => {
    const servicePage = new ServicePage(page);
    // Create new service
    // await servicePage.navigateToHospitalServices();
    // await servicePage.createService(serviceData.valid.serviceName);
    // // Create new form template
    // await servicePage.navigateToFormTemplate();
    // await page.waitForTimeout(5000);
    // await servicePage.createFormTemplate(serviceData.valid.programType, serviceData.valid.hmisVersion);
    // await page.waitForTimeout(3000);
    // await page.click(servicePage.keyServiceAddButton);
    // await page.click(servicePage.keyServiceDropdown);
    // // Check dropdown contains the recently added service only once
    // await expect(page.locator('#HospitalServiceId_listbox li.k-list-item:has-text("' + serviceData.valid.serviceName + '")')).toBeVisible();
    // // Add all key services from the array
    // for (const service of serviceData.templateServices) {
    //   await page.waitForTimeout(5000);
    //   await servicePage.addKeyService(service.serviceName, service.displayOrder);
    //   await page.waitForTimeout(5000);
    //   await servicePage.verifyServiceListed(service.serviceName);
    // }
    // await servicePage.closeForm();
    await servicePage.navigateToHmisEntry();
    await page.waitForTimeout(3000);
    await servicePage.createHmisEntry();
    await servicePage.fillHmisEntryForm(serviceData);
    await page.waitForTimeout(4000);
    await servicePage.verifyHmisEntryServices(serviceData.templateServices);
  });

  test('Attempt to add duplicate service', async ({ page }) => {
    const servicePage = new ServicePage(page);
    await servicePage.navigateToHospitalServices();
    await servicePage.createService(serviceData.duplicate.serviceName);
    // Verify error message for duplicate service
    await expect(page.locator('text=Service Already Exists')).toBeVisible();
  });
}); 