import loginPage from "../../support/loginPage";
import data from "../../fixtures/loginData.json"

describe("TS-001 Verifikasi Akses Halaman Login", () => {
  beforeEach(() => {
    loginPage.interceptFunction("GET", loginPage.intercepts.authLogin, "urlAccess");
    loginPage.visit();
  });

  it("TC-01 Akses halaman login OrangeHRM", () => {
    loginPage.waitResponse("@urlAccess", 200);
    loginPage.verifyUrl(loginPage.endpoints.login);
    loginPage.verifyLoginFormAppears();
  });
});

describe("TS-002 Verifikasi Fungsionalitas Tombol Login", () => {
  beforeEach(() => {
    loginPage.clearCache();
    loginPage.interceptFunction("GET", loginPage.intercepts.ohrmLogo, "loginButton");
    loginPage.visit();
  });

  it("TC-02 Cek fungsi button login", () => {
    loginPage.waitResponse("@loginButton", 200);
    loginPage.verifyLoginButtonAppears();
  });
});

describe("TS-003 Verifikasi Fungsionalitas Halaman Login", () => {
  beforeEach(() => {
    loginPage.clearCache();
    loginPage.interceptFunction("GET", loginPage.intercepts.svgAsset, "emptyUser");
    loginPage.interceptFunction("GET", loginPage.intercepts.ohrmBranding, "emptyPass");
    loginPage.interceptFunction("GET", loginPage.intercepts.bootstrapFont, "emptyInput");
    loginPage.interceptFunction("GET", loginPage.intercepts.nunitoLatinFont, "htmlInject");
    loginPage.interceptFunction("GET", loginPage.intercepts.nunitoRegularFont, "invalidPass");
    loginPage.visit();
    loginPage.verifyLoginFormAppears();
  });

  it("TC-03 Login dengan auth valid", () => {
    loginPage.interceptFunction("GET", loginPage.intercepts.dashboardPage, "messages");
    loginPage.inputUsername(data.validUser);
    loginPage.inputPassword(data.validPass);
    loginPage.clickLogin();
    loginPage.waitResponse("@messages", [200, 304]);
    loginPage.verifyUrl(loginPage.endpoints.dashboard);
  });

  it("TC-04 Login dengan username tidak terdaftar", () => {
    loginPage.interceptFunction("POST", loginPage.intercepts.validateLogin, "userNotFound");
    loginPage.inputUsername(data.invalidUser);
    loginPage.inputPassword(data.validPass);
    loginPage.clickLogin();
    loginPage.waitResponse("@userNotFound", [200, 302]);
    loginPage.verifyInvalidCredentials();
  });

  it("TC-05 Login dengan password salah", () => {
    loginPage.waitResponse("@invalidPass", 200);
    loginPage.inputUsername(data.validUser);
    loginPage.inputPassword(data.invalidPass);
    loginPage.clickLogin();
    loginPage.verifyInvalidCredentials();
  });

  it("TC-06 Login dengan username kosong", () => {
    loginPage.waitResponse("@emptyUser", 200);
    loginPage.emptyUsername();
    loginPage.inputPassword(data.invalidPass);
    loginPage.clickLogin();
    loginPage.verifyRequiredMessage();
  });

  it("TC-07 Login dengan password kosong", () => {
    loginPage.waitResponse("@emptyPass", 200);
    loginPage.inputUsername(data.validUser);
    loginPage.emptyPassword();
    loginPage.clickLogin();
    loginPage.verifyRequiredMessage();
  });

  it("TC-08 Login dengan username dan password kosong", () => {
    loginPage.waitResponse("@emptyInput", 200);
    loginPage.emptyUsername();
    loginPage.emptyPassword();
    loginPage.clickLogin();
    loginPage.verifyRequiredMessage();
  });

  it("TC-09 Login dengan karakter spesial", () => {
    loginPage.interceptFunction("GET", loginPage.intercepts.messagesLogin, "specialChar");
    loginPage.inputUsername(data.specialCharUser);
    loginPage.inputPassword(data.specialCharPass);
    loginPage.clickLogin();
    loginPage.waitResponse("@specialChar", [200, 304]);
    loginPage.verifyInvalidCredentials();
  });

  it("TC-10 Login dengan HTML Injection pada username dan password", () => {
    loginPage.waitResponse("@htmlInject", 200);
    loginPage.inputUsername(data.htmlInjectUser);
    loginPage.inputPassword(data.htmlInjectPass);
    loginPage.clickLogin();
    loginPage.verifyInvalidCredentials();
  });
});
