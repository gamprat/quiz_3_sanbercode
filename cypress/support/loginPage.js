class LoginPage {
  url = "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login";

  visit() {
    cy.visit(this.url, {
      timeout: 60000,
      failOnStatusCode: false,
    });
  }

  clearCache() {
    cy.wrap(
      Cypress.automation("remote:debugger:protocol", {
        command: "Network.clearBrowserCache",
      }),
    );
  }

  interceptFunction(method, url, alias) {
    cy.intercept(method, url).as(alias);
  }

  intercepts = {
    authLogin: "**/auth/login",
    dashboardPage: "**/api/v2/dashboard/employees/locations",
    validateLogin: "**/auth/validate",
    messagesLogin: "**/core/i18n/messages",
    ohrmLogo: "**/images/ohrm_logo.png",
    svgAsset: "**/img/blob.svg",
    ohrmBranding: "**/images/ohrm_branding.png?v=1763650546848",
    bootstrapFont: "**/fonts/bootstrap-icons.woff2",
    nunitoLatinFont: "**/fonts/nunito-sans-v6-latin-ext_latin-800.woff2",
    nunitoRegularFont: "**/fonts/nunito-sans-v6-latin-ext_latin-regular.woff2",
  };

  waitResponse(alias, statusCode = 200) {
    if (Array.isArray(statusCode)) {
      cy.wait(alias).its("response.statusCode").should("be.oneOf", statusCode);
    } else {
      cy.wait(alias).its("response.statusCode").should("eq", statusCode);
    }
  }

  get usernameInput() {
    return cy.get('input[name="username"]');
  }

  get passwordInput() {
    return cy.get('input[name="password"]');
  }

  get loginForm() {
    return cy.get(".orangehrm-login-form");
  }

  get loginButton() {
    return cy.get(".orangehrm-login-button");
  }

  get alertMessage() {
    return cy.get(".oxd-alert");
  }

  get errorMessage() {
    return cy.get(".oxd-input-field-error-message");
  }

  endpoints = {
    login: "/auth/login",
    dashboard: "/dashboard",
  };

  verifyUrl(endpoint) {
    cy.url().should("include", endpoint);
  }

  verifyLoginFormAppears() {
    this.loginForm.should("be.visible", { timeout: 30000 });
  }

  verifyLoginButtonAppears() {
    this.loginButton.should("be.visible").and("have.css", "cursor", "pointer");
  }

  verifyRequiredMessage() {
    this.errorMessage.should("be.visible").and("contain", "Required");
  }

  verifyInvalidCredentials() {
    this.alertMessage.should("be.visible").and("contain", "Invalid credentials");
  }

  inputUsername(username) {
    this.usernameInput.type(username);
  }

  inputPassword(password) {
    this.passwordInput.type(password);
  }

  emptyUsername() {
    this.usernameInput.clear();
  }

  emptyPassword() {
    this.passwordInput.clear();
  }

  clickLogin() {
    this.loginButton.click();
  }
}

export default new LoginPage();
