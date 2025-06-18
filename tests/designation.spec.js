const { test, expect } = require('@playwright/test');
const NsiloginPage = require('../pages/NsiloginPage');
const loginData = require('../fixture/nsilogin.fixture.json');
const { DesignationPage } = require('../pages/DesignationPage');
const designationData = require('../fixture/Designation.fixture.json');

test.describe('Designation Tests', () => {
  test.beforeEach(async ({ page }) => {
    const nsiloginPage = new NsiloginPage(page);
    await nsiloginPage.navigate();
    await nsiloginPage.login(loginData.valid.username, loginData.valid.password);
    // Verify successful navigation to dashboard
    expect(await page.url()).toContain('/TenantDashboard'); // Example assertion

    // Verify username on dashboard
    const username = await page.locator('//*[@id="kt_quick_user_toggle"]').textContent(); // Updated selector
    expect(username).toContain('admin');
    await page.waitForTimeout(3000);
  });

  test('Create a new designation with valid data', async ({ page }) => {
    const designationPage = new DesignationPage(page);

    // Navigate to Designation page
    await designationPage.navigateToDesignation();

    // Create a new designation using valid data
    await designationPage.createDesignation(
      designationData.valid.cadreGroup,
      designationData.valid.cadre,
      designationData.valid.designationName
    );

    // Verify the designation is created
    await expect(page.locator('text=' + designationData.valid.designationName)).toBeVisible();
  });

  test('Attempt to create a designation with already existing data', async ({ page }) => {
    const designationPage = new DesignationPage(page);

    // Navigate to Designation page
    await designationPage.navigateToDesignation();

    // Attempt to create a designation using already existing data
    await designationPage.createDesignation(
      designationData.valid.cadreGroup,
      designationData.valid.cadre,
      designationData.valid.designationName
    );

    // Verify the error message for duplicate designation
    const errorMessage = page.locator('text=Designation Already Exists');
    await expect(errorMessage).toBeVisible();
  });

  test.only('Validate required field error for designation name', async ({ page }) => {
    const designationPage = new DesignationPage(page);

    // Navigate to Designation page
    await designationPage.navigateToDesignation();
    await designationPage.createnewDesignation();
    await page.waitForTimeout(3000);

    // Attempt to save a designation with an empty name
    const errorMessage = await designationPage.validateRequiredFieldError();

    // Verify the error message
    expect(errorMessage).toBe('This field is required.');
  });

});
