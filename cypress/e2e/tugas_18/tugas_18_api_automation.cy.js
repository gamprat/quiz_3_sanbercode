describe("Tugas 18 - Reqres.in API Automation", () => {
  const baseUrl = "https://reqres.in/api";
  const apiHeaders = {
    "x-api-key": "YOUR_API_KEY_HERE",
    "Content-type": "application/json",
  };

  // Auth
  it("POST - Register Successful", () => {
    cy.request({
      method: "POST",
      url: `${baseUrl}/register`,
      headers: apiHeaders,
      body: {
        email: "eve.holt@reqres.in",
        password: "pistol",
      },
      failedOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("token");
    });
  });

  it("POST - Login Successful", () => {
    cy.request({
      method: "POST",
      url: `${baseUrl}/login`,
      headers: apiHeaders,
      body: {
        email: "eve.holt@reqres.in",
        password: "cityslicka",
      },
      failedOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("token");
    });
  });

  // Users
  it("GET - List Users", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/users`,
      headers: apiHeaders,
      failedOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.not.be.null;
      expect(response.body).to.have.property("data");
    });
  });

  it("GET - List Users Page 2", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/users?page=2`,
      headers: apiHeaders,
      failedOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.not.be.null;
      expect(response.body).to.have.property("data");
    });
  });

  it("GET - Single User", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/users/2`,
      headers: apiHeaders,
      failedOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data.id).to.eq(2);
    });
  });

  it("POST - Create User", () => {
    cy.request({
      method: "POST",
      url: `${baseUrl}/users`,
      headers: apiHeaders,
      body: {
        name: "User Testing",
        job: "QA Engineer",
      },
      failedOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.name).to.eq("User Testing");
    });
  });

  it("PATCH - Update User", () => {
    cy.request({
      method: "PATCH",
      url: `${baseUrl}/users/2`,
      headers: apiHeaders,
      body: {
        job: "Junior QA Engineer",
      },
      failedOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.job).to.eq("Junior QA Engineer");
    });
  });

  it("DELETE - Delete User", () => {
    cy.request({
      method: "DELETE",
      url: `${baseUrl}/users/2`,
      headers: apiHeaders,
      failedOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(204);
    });
  });

  // Resources
  it("GET - List Resources", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/unknown`,
      headers: apiHeaders,
      failedOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.not.be.null;
      expect(response.body).to.have.property("data");
    });
  });

  it("GET - Single Resource", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/unknown/2`,
      headers: apiHeaders,
      failedOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.not.be.null;
      expect(response.body).to.have.property("data");
    });
  });
});
