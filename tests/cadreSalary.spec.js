const { test, expect } = require('@playwright/test');
const NsiloginPage = require('../pages/NsiloginPage');
const loginData = require('../fixture/nsilogin.fixture.json');
const { CadreSalaryPage } = require('../pages/cadreSalaryPage');
const data = require('../fixture/cadreSalary.fixture.json');

test.beforeEach(async ({ page }) => {
  const nsiloginPage = new NsiloginPage(page);
  await nsiloginPage.navigate();
  await nsiloginPage.login(loginData.valid.username, loginData.valid.password);
  // Verify successful navigation to dashboard
  expect(await page.url()).toContain('/TenantDashboard'); // Example assertion

  // Verify username on dashboard
  const username = await page.locator('//*[@id="kt_quick_user_toggle"]').textContent(); // Updated selector
  expect(username).toContain(loginData.valid.username);
  await page.waitForTimeout(4000);
});
test('should create a new cadre salary', async ({ page }) => {
  
  const cadreSalaryPage = new CadreSalaryPage(page);
  await cadreSalaryPage.navigateToCadreSalary();
  await cadreSalaryPage.openCadreSalaryForm();
  await cadreSalaryPage.fillCadreSalaryForm(data.valid.cadreGroup, data.valid.cadre, data.valid.designation);
  await cadreSalaryPage.selectPaymentCheckbox(data.valid.paymentItems);
  await page.waitForTimeout(4000);
  await cadreSalaryPage.save();

  // Use the page object's verification method
  await cadreSalaryPage.verifyCadreSalaryRowExists(data.valid, expect);

  // Optionally, check for a success message
  // await expect(page.locator('.alert-success')).toBeVisible();
});
test('should show error when creating a cadre salary with already existing data', async ({ page }) => {
  const cadreSalaryPage = new CadreSalaryPage(page);
  await cadreSalaryPage.navigateToCadreSalary();
  await cadreSalaryPage.openCadreSalaryForm();
  await cadreSalaryPage.fillCadreSalaryForm(data.alreadyexist.cadreGroup, data.alreadyexist.cadre, data.alreadyexist.designation);
  await cadreSalaryPage.selectPaymentCheckbox(data.valid.paymentItems);
  await cadreSalaryPage.save();

  // Verify the error for duplicate entry
  const errorModal = page.locator('.swal-modal .swal-text');
  await expect(errorModal).toHaveText('Cadre Salary Combination Already Exists');
  await page.waitForTimeout(4000);
});
test('should show required field errors when saving without filling the form', async ({ page }) => {
  const cadreSalaryPage = new CadreSalaryPage(page);
  await cadreSalaryPage.navigateToCadreSalary();
  await cadreSalaryPage.openCadreSalaryForm();
  await cadreSalaryPage.save();
  // Assert required field errors are visible
  await expect(page.locator('#cadreGroupSetupId-error')).toHaveText('This field is required.');
  await expect(page.locator('#cadreSetupId-error')).toHaveText('This field is required.');
  // Optionally, add more assertions for other required fields if needed
});
test.only('verify payment item in HR', async ({ page }) => {
  const cadreSalaryPage = new CadreSalaryPage(page);
  // Step-by-step navigation to Service Record form for the employee in fixture
  await cadreSalaryPage.navigateToEmployeeDetailsMenu();
  await cadreSalaryPage.openEmployeeActionMenu(data.valid.employeeFullName);
  await cadreSalaryPage.editEmployee(data.valid.employeeFullName);
  await page.waitForTimeout(4000);
  await cadreSalaryPage.navigateToServiceRecordTab();
  await cadreSalaryPage.openServiceRecordCreateForm();
  // Fill the Service Record form with valid data
  await cadreSalaryPage.fillServiceRecordForm({
    cadreGroup: data.valid.cadreGroup,
    cadre: data.valid.cadre,
    designation: data.valid.designation
  });
  // Verify all payment items from the fixture are present in the Payment Items grid
  await cadreSalaryPage.verifyPaymentItemsInGrid(data.valid.paymentItems, expect);
}); 