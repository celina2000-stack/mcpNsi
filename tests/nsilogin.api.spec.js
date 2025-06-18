const { test, expect, request } = require('@playwright/test');
const loginData = require('../fixture/nsilogin.fixture.json');

const LOGIN_URL = 'https://mnev2qa.exolutus.com/Account/Login';
const DASHBOARD_URL = 'https://mnev2qa.exolutus.com/App/TenantDashboard';

async function getAntiForgeryToken(apiRequestContext) {
  const response = await apiRequestContext.get(LOGIN_URL);
  const html = await response.text();
  const match = html.match(/<input[^>]*name="__RequestVerificationToken"[^>]*value="([^"]+)"/);
  return match ? match[1] : null;
}

test.describe('NSI Login API Tests', () => {
  let apiRequestContext;

  test.beforeAll(async ({ playwright }) => {
    apiRequestContext = await request.newContext();
  });

  test.afterAll(async () => {
    await apiRequestContext.dispose();
  });

  test('Valid login returns dashboard', async () => {
    const token = await getAntiForgeryToken(apiRequestContext);
    expect(token).toBeTruthy();
    const response = await apiRequestContext.post(LOGIN_URL, {
      form: {
        __RequestVerificationToken: token,
        usernameOrEmailAddress: loginData.valid.username,
        password: loginData.valid.password,
        rememberMe: 'true',
        returnUrl: '/App',
        returnUrlHash: '',
        ss: ''
      }
    });
    // Should redirect (302) or 200 with dashboard content
    expect([200, 302]).toContain(response.status());
    // Try to access dashboard with cookies
    const cookies = await apiRequestContext.storageState();
    const dashboardContext = await request.newContext({ storageState: cookies });
    const dashboardRes = await dashboardContext.get(DASHBOARD_URL);
    const dashboardHtml = await dashboardRes.text();
    expect(dashboardHtml).toContain('Dashboard');
    await dashboardContext.dispose();
  });

  test('Invalid username and valid password', async () => {
    const token = await getAntiForgeryToken(apiRequestContext);
    expect(token).toBeTruthy();
    const response = await apiRequestContext.post(LOGIN_URL, {
      form: {
        __RequestVerificationToken: token,
        usernameOrEmailAddress: loginData.invalid[1].username,
        password: loginData.invalid[1].password,
        rememberMe: 'true',
        returnUrl: '/App',
        returnUrlHash: '',
        ss: ''
      }
    });
    const html = await response.text();
    expect(html).toContain('Invalid user name or password');
  });

  test('Valid username and invalid password', async () => {
    const token = await getAntiForgeryToken(apiRequestContext);
    expect(token).toBeTruthy();
    const response = await apiRequestContext.post(LOGIN_URL, {
      form: {
        __RequestVerificationToken: token,
        usernameOrEmailAddress: loginData.invalid[0].username,
        password: loginData.invalid[0].password,
        rememberMe: 'true',
        returnUrl: '/App',
        returnUrlHash: '',
        ss: ''
      }
    });
    const html = await response.text();
    expect(html).toContain('Invalid user name or password');
  });

  test('Both username and password invalid', async () => {
    const token = await getAntiForgeryToken(apiRequestContext);
    expect(token).toBeTruthy();
    const response = await apiRequestContext.post(LOGIN_URL, {
      form: {
        __RequestVerificationToken: token,
        usernameOrEmailAddress: loginData.invalid[2].username,
        password: loginData.invalid[2].password,
        rememberMe: 'true',
        returnUrl: '/App',
        returnUrlHash: '',
        ss: ''
      }
    });
    const html = await response.text();
    expect(html).toContain('Invalid user name or password');
  });

  test('Empty username and password', async () => {
    const token = await getAntiForgeryToken(apiRequestContext);
    expect(token).toBeTruthy();
    const response = await apiRequestContext.post(LOGIN_URL, {
      form: {
        __RequestVerificationToken: token,
        usernameOrEmailAddress: '',
        password: '',
        rememberMe: 'true',
        returnUrl: '/App',
        returnUrlHash: '',
        ss: ''
      }
    });
    const html = await response.text();
    expect(html).toContain('The UsernameOrEmailAddress field is required.');
  });
}); 