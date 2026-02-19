describe("TS-001 Verifikasi Akses Halaman Login", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/auth/login").as("urlAccess");

    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
      {
        timeout: 60000,
        failOnStatusCode: false,
      },
    );
  });

  it("TC-01 Akses halaman login OrangeHRM", () => {
    cy.wait("@urlAccess")
      .its("response.statusCode")
      .should("eq", 200);
    cy.url().should("include", "/auth/login");
    cy.get(".orangehrm-login-form", { timeout: 30000 }).should("be.visible");
  });
});

describe("TS-002 Verifikasi Fungsionalitas Tombol Login", () => {
  beforeEach(() => {
    cy.wrap(
      Cypress.automation("remote:debugger:protocol", {
        command: "Network.clearBrowserCache",
      }),
    );

    cy.intercept("GET", "**/images/ohrm_logo.png").as("loginButton");
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
      {
        timeout: 60000,
        failOnStatusCode: false,
      },
    );
  });

  it("TC-02 Cek fungsi button login", () => {
    cy.wait("@loginButton").its("response.statusCode").should("eq", 200);
    cy.get(".orangehrm-login-button")
      .should("be.visible")
      .and("have.css", "cursor", "pointer");
  });
});

describe("TS-003 Verifikasi Fungsionalitas Halaman Login", () => {
  beforeEach(() => {
    cy.wrap(
      Cypress.automation("remote:debugger:protocol", {
        command: "Network.clearBrowserCache",
      }),
    );

    cy.intercept("GET", "**/img/blob.svg").as("emptyUser");
    cy.intercept("GET", "**/images/ohrm_branding.png?v=1763650546848").as(
      "emptyPass",
    );
    cy.intercept("GET", "**/fonts/bootstrap-icons.woff2").as("emptyInput");
    cy.intercept("GET", "**/fonts/nunito-sans-v6-latin-ext_latin-800.woff2").as(
      "htmlInject",
    );
    cy.intercept("GET", "**/fonts/nunito-sans-v6-latin-ext_latin-regular.woff2").as("invalidPass");

    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
      {
        timeout: 60000,
        failOnStatusCode: false,
      },
    );

    cy.get(".orangehrm-login-form", { timeout: 30000 }).should("be.visible");
  });

  it("TC-03 Login dengan auth valid", () => {
    cy.intercept("GET", "**/api/v2/dashboard/employees/locations").as(
      "messages",
    );
    cy.get('input[name="username"]').type("Admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get(".orangehrm-login-button").click();
    cy.wait("@messages")
      .its("response.statusCode")
      .should("be.oneOf", [200, 304]);
    cy.url().should("include", "/dashboard");
  });

  it("TC-04 Login dengan username tidak terdaftar", () => {
    cy.intercept("POST", "**/auth/validate").as("userNotFound");
    cy.get('input[name="username"]').type("Admin1");
    cy.get('input[name="password"]').type("admin123");
    cy.get(".orangehrm-login-button").click();
    cy.wait("@userNotFound")
      .its("response.statusCode")
      .should("be.oneOf", [200, 302]);
    cy.get(".oxd-alert")
      .should("be.visible")
      .and("contain", "Invalid credentials");
  });

  it("TC-05 Login dengan password salah", () => {
    cy.wait("@invalidPass").its("response.statusCode").should("eq", 200);
    cy.get('input[name="username"]').type("Admin");
    cy.get('input[name="password"]').type("admin1234");
    cy.get(".orangehrm-login-button").click();
    
    cy.get(".oxd-alert")
      .should("be.visible")
      .and("contain", "Invalid credentials");
  });

  it("TC-06 Login dengan username kosong", () => {
    cy.wait("@emptyUser").its("response.statusCode").should("eq", 200);
    cy.get('input[name="username"]').clear();
    cy.get('input[name="password"]').type("admin1234");
    cy.get(".orangehrm-login-button").click();
    cy.get(".oxd-input-field-error-message")
      .should("be.visible")
      .and("contain", "Required");
  });

  it("TC-07 Login dengan password kosong", () => {
    cy.wait("@emptyPass").its("response.statusCode").should("eq", 200);
    cy.get('input[name="username"]').type("Admin");
    cy.get('input[name="password"]').clear();
    cy.get(".orangehrm-login-button").click();
    cy.get(".oxd-input-field-error-message")
      .should("be.visible")
      .and("contain", "Required");
  });

  it("TC-08 Login dengan username dan password kosong", () => {
    cy.wait("@emptyInput").its("response.statusCode").should("eq", 200);
    cy.get('input[name="username"]').clear();
    cy.get('input[name="password"]').clear();
    cy.get(".orangehrm-login-button").click();
    cy.get(".oxd-input-field-error-message")
      .should("be.visible")
      .and("contain", "Required");
  });

  it("TC-09 Login dengan karakter spesial", () => {
    cy.intercept("GET", "**/core/i18n/messages").as("specialChar");
    cy.get('input[name="username"]').type("<()***#>");
    cy.get('input[name="password"]').type("%#%");
    cy.get(".orangehrm-login-button").click();
    cy.wait("@specialChar")
      .its("response.statusCode")
      .should("be.oneOf", [200, 304]);
    cy.get(".oxd-alert")
      .should("be.visible")
      .and("contain", "Invalid credentials");
  });

  it("TC-10 Login dengan HTML Injection pada username dan password", () => {
    cy.wait("@htmlInject").its("response.statusCode").should("eq", 200);
    cy.get('input[name="username"]').type("<h1>user</h1>");
    cy.get('input[name="password"]').type("<h1>user</h1>");
    cy.get(".orangehrm-login-button").click();
    cy.get(".oxd-alert")
      .should("be.visible")
      .and("contain", "Invalid credentials");
  });
});