const { test, expect } = require('@playwright/test');
const NsiloginPage = require('../pages/NsiloginPage');
const loginData = require('../fixture/nsilogin.fixture.json');

test.describe('NSI Login Tests', () => {
  let nsiloginPage;

  test.beforeEach(async ({ page }) => {
    nsiloginPage = new NsiloginPage(page);
    await nsiloginPage.navigate();
  });

  test.only('Valid login and verify username on dashboard', async ({ page }) => {
    await nsiloginPage.login(loginData.valid.username, loginData.valid.password);
    // Verify successful navigation to dashboard
    expect(await page.url()).toContain('/TenantDashboard'); // Example assertion

    // Verify username on dashboard
    const username = await page.locator('//*[@id="kt_quick_user_toggle"]').textContent(); // Updated selector
    expect(username).toContain('admin');
  });

  test('Invalid username and valid password', async ({ page }) => {
    await nsiloginPage.login(loginData.invalid[1].username, loginData.invalid[1].password);
    // Add assertions for login failure
    const errorMessage = await page.locator('text=Invalid user name or password').textContent();
    expect(errorMessage).toContain('Invalid user name or password');
  });

  test('Valid username and invalid password', async ({ page }) => {
    await nsiloginPage.login(loginData.invalid[0].username, loginData.invalid[0].password);
    // Add assertions for login failure
    const errorMessage = await page.locator('text=Invalid user name or password').textContent();
    expect(errorMessage).toContain('Invalid user name or password');
  });

  test('Both username and password invalid', async ({ page }) => {
    await nsiloginPage.login(loginData.invalid[2].username, loginData.invalid[2].password);
    // Add assertions for login failure
    const errorMessage = await page.locator('text=Invalid user name or password').textContent();
    expect(errorMessage).toContain('Invalid user name or password');
  });

  test('Empty username and password', async ({ page }) => {
    await nsiloginPage.login(loginData.empty.username, loginData.empty.password);
    // Add assertions for login failure
    // Verify error message for empty username
    await nsiloginPage.login('', loginData.valid.password);
    const usernameError = await page.locator('text=This field is required.').textContent();
    expect(usernameError).toContain('This field is required.');

    // Verify error message for empty password
    await nsiloginPage.login(loginData.valid.username, '');
    const passwordError = await page.locator('text=This field is required.').textContent();
    expect(passwordError).toContain('This field is required.');
  });
});
