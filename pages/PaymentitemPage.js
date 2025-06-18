const { expect } = require('@playwright/test');

exports.PaymentItemPage = class PaymentItemPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.createNewPaymentItemButton = 'text=Create new payment item';
    this.paymentItemNameInput = '#PaymentItem_PaymentItems';
    this.paymentTypeDropdown = '#paymentTypeId';
    this.calculatedFromDropdown = '#calculatedFromId';
    this.displayOrderInput = '#PaymentItem_DisplayOrder';
    this.saveButton = '.save-button';
    this.errorMessage = 'text=This field is required.';
    this.paymentItemsHeader = 'th:has-text("Payment Items")';
    this.paymentItemsCells = 'table tbody tr td:nth-child(3)';
  }

  async navigateToPaymentItems() {
    await this.page.waitForTimeout(5000); 
    await this.page.click('text=Setup');
    await this.page.click('text=HR Module Setup');
    await this.page.click('text=Payment Items');
    await this.page.waitForTimeout(5000);
  }

  async createPaymentItem(paymentItemName, paymentTypeOption, calculatedFromOption, displayOrder) {
    await this.page.click(this.createNewPaymentItemButton);
    await this.page.waitForTimeout(3000);
    await this.page.fill(this.paymentItemNameInput, paymentItemName);
    await this.page.selectOption(this.paymentTypeDropdown, { label: paymentTypeOption });
    await this.page.selectOption(this.calculatedFromDropdown, { label: calculatedFromOption });
    await this.page.fill(this.displayOrderInput, displayOrder);
    await this.page.waitForTimeout(3000);
    await this.page.click(this.saveButton);
    await this.page.waitForTimeout(3000);
  }
  async clickCreateNewPaymentItem() {
    await this.page.click(this.createNewPaymentItemButton);
  }
  async clickSaveButton() {
    await this.page.click(this.saveButton);
  }
  async verifyErrorMessages() {
    await expect(this.page.locator(this.errorMessage)).toHaveCount(3); // Three required fields
    await expect(this.page.locator(this.errorMessage).nth(0)).toBeVisible(); // Payment Item Name
    await expect(this.page.locator(this.errorMessage).nth(1)).toBeVisible(); // Payment Type
    await expect(this.page.locator(this.errorMessage).nth(2)).toBeVisible(); // Calculated From
  }

  async sortAndVerifyPaymentItems() {
    // Click on the "Payment Items" header to sort
    await this.page.click(this.paymentItemsHeader);
    await this.page.waitForTimeout(6000); // Wait for sorting to complete

    // Get all payment item names from the table
    const paymentItemNames = await this.page.$$eval(this.paymentItemsCells, cells =>
      cells.map(cell => cell.textContent.trim())
    );

    // Verify the payment items are sorted in ascending order
    const sortedNames = [...paymentItemNames].sort();
    expect(paymentItemNames).toEqual(sortedNames);

    // Return the sorted payment items
    return paymentItemNames;
  }
};