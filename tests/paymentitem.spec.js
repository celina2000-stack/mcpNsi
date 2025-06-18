
const { test, expect } = require('@playwright/test');
const NsiloginPage = require('../pages/NsiloginPage');
const loginData = require('../fixture/nsilogin.fixture.json');
const { PaymentItemPage } = require('../pages/PaymentitemPage');
const paymentItemData = require('../fixture/Paymentitem.fixture.json');

test.describe('Payment Item Tests', () => {
  test.beforeEach(async ({ page }) => {
    const nsiloginPage = new NsiloginPage(page);
    await nsiloginPage.navigate();
    await nsiloginPage.login(loginData.valid.username, loginData.valid.password);
    // Verify successful navigation to dashboard
    expect(await page.url()).toContain('/TenantDashboard'); // Example assertion

    // Verify username on dashboard
    const username = await page.locator('//*[@id="kt_quick_user_toggle"]').textContent(); // Updated selector
    expect(username).toContain('admin');
  });

  test('Create a new payment item', async ({ page }) => {
    const paymentItemPage = new PaymentItemPage(page);

    // Navigate to Payment Items
    await paymentItemPage.navigateToPaymentItems();

    // Create a new payment item
    await paymentItemPage.createPaymentItem(
      paymentItemData.paymentItemName,
      paymentItemData.paymentTypeOption,
      paymentItemData.calculatedFromOption,
      paymentItemData.displayOrder
    );

    // Verify the payment item is created
    await expect(page.locator('text=' + paymentItemData.paymentItemName)).toBeVisible();
  });

  test('Verify error messages for empty field', async ({ page }) => {
    const paymentItemPage = new PaymentItemPage(page);

    await paymentItemPage.navigateToPaymentItems();
    await paymentItemPage.clickCreateNewPaymentItem();
    await page.waitForTimeout(3000);
    await paymentItemPage.clickSaveButton();
    await page.waitForTimeout(3000)
    await paymentItemPage.verifyErrorMessages();
  });
  test('Verify error message for duplicate payment item', async ({ page }) => {
    const paymentItemPage = new PaymentItemPage(page);
  
    // Navigate to Payment Items
    await paymentItemPage.navigateToPaymentItems();
  
   
    await paymentItemPage.createPaymentItem(
      paymentItemData.paymentItemName, // Use the same name as an existing payment item
      paymentItemData.paymentTypeOption,
      paymentItemData.calculatedFromOption,
      paymentItemData.displayOrder
    );
  
    // Verify the error message
    await expect(page.locator('text=Payment Item Already Exists')).toBeVisible();
  });
  test.only('Verify and display payment items in ascending order', async ({ page }) => {
    const paymentItemPage = new PaymentItemPage(page);
  
    // Navigate to Payment Items
    await paymentItemPage.navigateToPaymentItems();
  
    // Call the function to sort and verify payment items
    const sortedPaymentItems = await paymentItemPage.sortAndVerifyPaymentItems();
  
    // Display the sorted payment items
    console.log('Payment Items in Ascending Order:', sortedPaymentItems);
  });
});

  

  