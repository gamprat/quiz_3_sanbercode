describe("TS-001 Verifikasi Akses Halaman Login", () => {
  beforeEach(() => {
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
      {
        timeout: 60000,
        failOnStatusCode: false,
      },
    );
  });

  it("TC-01 Akses halaman login OrangeHRM", () => {
    cy.url().should("include", "/auth/login");
    cy.get(".orangehrm-login-form", { timeout: 30000 }).should("be.visible");
  });
});

describe("TS-002 Verifikasi Fungsionalitas Tombol Login", () => {
  beforeEach(() => {
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
      {
        timeout: 60000,
        failOnStatusCode: false,
      },
    );
  });

  it("TC-02 Cek fungsi button login", () => {
    cy.get(".orangehrm-login-button")
      .should("be.visible")
      .and("have.css", "cursor", "pointer");
  });
});

describe("TS-003 Verifikasi Fungsionalitas Halaman Login", () => {
  beforeEach(() => {
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
    cy.get('input[name="username"]').type("Admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get(".orangehrm-login-button").click();
    cy.url().should("include", "/dashboard");
  });

  it("TC-04 Login dengan username tidak terdaftar", () => {
    cy.get('input[name="username"]').type("Admin1");
    cy.get('input[name="password"]').type("admin123");
    cy.get(".orangehrm-login-button").click();
    cy.get(".oxd-alert")
      .should("be.visible")
      .and("contain", "Invalid credentials");
  });

  it("TC-05 Login dengan password salah", () => {
    cy.get('input[name="username"]').type("Admin");
    cy.get('input[name="password"]').type("admin1234");
    cy.get(".orangehrm-login-button").click();
    cy.get(".oxd-alert")
      .should("be.visible")
      .and("contain", "Invalid credentials");
  });

  it("TC-06 Login dengan username kosong", () => {
    cy.get('input[name="username"]').clear();
    cy.get('input[name="password"]').type("admin1234");
    cy.get(".orangehrm-login-button").click();
    cy.get(".oxd-input-field-error-message")
      .should("be.visible")
      .and("contain", "Required");
  });

  it("TC-07 Login dengan password kosong", () => {
    cy.get('input[name="username"]').type("Admin");
    cy.get('input[name="password"]').clear();
    cy.get(".orangehrm-login-button").click();
    cy.get(".oxd-input-field-error-message")
      .should("be.visible")
      .and("contain", "Required");
  });

  it("TC-08 Login dengan username dan password kosong", () => {
    cy.get('input[name="username"]').clear();
    cy.get('input[name="password"]').clear();
    cy.get(".orangehrm-login-button").click();
    cy.get(".oxd-input-field-error-message")
      .should("be.visible")
      .and("contain", "Required");
  });

  it("TC-09 Login dengan karakter spesial", () => {
    cy.get('input[name="username"]').type("<()***#>");
    cy.get('input[name="password"]').type("%#%");
    cy.get(".orangehrm-login-button").click();
    cy.get(".oxd-alert")
      .should("be.visible")
      .and("contain", "Invalid credentials");
  });

  it("TC-10 Login dengan HTML Injection pada username dan password", () => {
    cy.get('input[name="username"]').type("<h1>user</h1>");
    cy.get('input[name="password"]').type("<h1>user</h1>");
    cy.get(".orangehrm-login-button").click();
    cy.get(".oxd-alert")
      .should("be.visible")
      .and("contain", "Invalid credentials");
  });
});
