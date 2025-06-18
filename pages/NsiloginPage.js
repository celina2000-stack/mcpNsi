// Page object for NSI Login Page

class NsiloginPage {
  constructor(page) {
    this.page = page;
    this.usernameField = 'input[name="usernameOrEmailAddress"]';
    this.passwordField = 'input[name="password"]';
    this.loginButton = 'button#kt_login_signin_submit';
  }

  async navigate() {
    await this.page.goto('https://mnev2qa.exolutus.com/Account/Login');
  }

  async login(username, password) {
    await this.page.fill(this.usernameField, username);
    await this.page.waitForTimeout(3000)
    await this.page.fill(this.passwordField, password);
    await this.page.waitForTimeout(3000)
    await this.page.click(this.loginButton);
    await this.page.waitForTimeout(3000)
  }
}

module.exports = NsiloginPage;
