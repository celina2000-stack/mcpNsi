const { test, expect } = require('@playwright/test');
const NsiloginPage = require('../pages/NsiloginPage');
const loginData = require('../fixture/nsilogin.fixture.json');
const { LivingSupportPage } = require('../pages/LivingSupportPage');
const livingSupportData = require('../fixture/LivingSupport.fixture.json');

test.describe('Living Support Setup Tests', () => {
  test.beforeEach(async ({ page }) => {
    const nsiloginPage = new NsiloginPage(page);
    await nsiloginPage.navigate();
    await nsiloginPage.login(loginData.valid.username, loginData.valid.password);
    expect(await page.url()).toContain('/TenantDashboard');
    const username = await page.locator('//*[@id="kt_quick_user_toggle"]').textContent();
    expect(username).toContain('admin');
    await page.waitForTimeout(2000);
  });

  test('Create a new living support and add items', async ({ page }) => {
    const livingSupportPage = new LivingSupportPage(page);
    await livingSupportPage.navigateToLivingSupportSetup();
    await livingSupportPage.createLivingSupport(livingSupportData.valid.livingSupportName, livingSupportData.valid.hasItem);
    await livingSupportPage.expandLivingSupportRow(livingSupportData.valid.livingSupportName);
    const itemNames = livingSupportData.templateItems.map(i => i.itemName);
    await livingSupportPage.addMultipleItemsToLivingSupport(itemNames);
    for (const item of itemNames) {
      await livingSupportPage.verifyItemListed(item);
    }
  });

  test('Attempt to add duplicate living support', async ({ page }) => {
    const livingSupportPage = new LivingSupportPage(page);
    await livingSupportPage.navigateToLivingSupportSetup();
    await livingSupportPage.createLivingSupport(livingSupportData.duplicate.livingSupportName, true);
    await expect(page.locator('text=Data Already Exists !!!')).toBeVisible();
  });
  test.only('should verify living support in dropdown, create and verify quarter items', async ({ page }) => {
  const livingSupportPage = new LivingSupportPage(page);
  await livingSupportPage.goto();
  await livingSupportPage.create();
  await livingSupportPage.verifyLivingSupportInDropdown(livingSupportData.valid.livingSupportName);
  await livingSupportPage.createLivingSupport(livingSupportData.valid.livingSupportName);
  await livingSupportPage.expandLivingSupportDetail(livingSupportData.valid.livingSupportName);
  const quarterItems = livingSupportData.templateItems.map(item => item.name);
  await livingSupportPage.verifyQuarterItemsDropdown(quarterItems);
});
}); 