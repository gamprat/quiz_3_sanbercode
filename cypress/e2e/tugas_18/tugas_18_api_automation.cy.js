describe("Tugas 18 - Platzi Fake API Automation", () => {
  const baseUrl = "https://api.escuelajs.co/api";
  const apiHeaders = {
    "Content-type": "application/json",
  };

  // Auth
  it("POST - Login Successful", () => {
    cy.request({
      method: "POST",
      url: `${baseUrl}/v1/auth/login`,
      headers: apiHeaders, 
      body: {
        "email": "john@mail.com",
        "password": "changeme"
      },
      failedOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property("access_token");
      expect(response.body).to.have.property("refresh_token");
    });
  });

  // Users
  it("GET - List Users", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/v1/users`,
      headers: apiHeaders,
      failedOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.be.greaterThan(0);
      expect(response.body).to.not.be.null;
    });
  });

  it("GET - Single User", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/v1/users/1`,
      headers: apiHeaders,
      failedOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.id).to.eq(1);
      expect(response.body).to.have.property("email");
      expect(response.body).to.have.property("role");
    });
  });

  it("POST - Create User", () => {
    cy.request({
      method: "POST",
      url: `${baseUrl}/v1/users/`,
      headers: apiHeaders,
      body: {
        name: "Nicolas",
        email: "nico@gmail.com",
        password: "1234",
        avatar: "https://picsum.photos/800",
      },
      failedOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.name).to.eq("Nicolas");
    });
  });

  // Categories
  it("GET - List Categories", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/v1/categories`,
      headers: apiHeaders,
      failedOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.not.be.null;
      expect(response.body).to.be.an("array");
      expect(response.body[0]).to.have.property("image");
    });
  });

  it("GET - Single Category", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/v1/categories/1`,
      headers: apiHeaders,
      failedOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.not.be.null;
    });
  });

  // Products
  it("GET - List Products", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/v1/products`,
      headers: apiHeaders,
      failedOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.not.be.null;
      expect(response.body).to.be.an("array");
      expect(response.body[0].price).to.be.a("number");
    });
  });

  it("GET - Single Product", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/v1/products/3`,
      headers: apiHeaders,
      failedOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.not.be.null;
    });
  });

  it("GET - Related Products", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/v1/products/3/related`,
      headers: apiHeaders,
      failedOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.not.be.null;
      expect(response.body).to.be.an("array");
    });
  });

  it("GET - Filter Product by Price", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/v1/products/?price=100`,
      headers: apiHeaders,
      failedOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.not.be.null;
      expect(response.body).to.be.an("array");
    });
  });

  //Locations
  it("GET - List Locations", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/v1/locations`,
      headers: apiHeaders,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
      if (response.body.length > 0) {
        expect(response.body[0]).to.have.property("id");
        expect(response.body[0]).to.have.property("name");
      }
    });
  });

  it("GET - List Locations with Limit", () => {
    const limit = 10;
    cy.request({
      method: "GET",
      url: `${baseUrl}/v1/locations`,
      qs: { size: limit },
      headers: apiHeaders,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
      if (response.body.length > 0) {
        expect(response.body[0]).to.have.property("id");
        expect(response.body[0]).to.have.property("name");
        expect(response.body).to.be.an("array");
        expect(response.body.length).to.be.at.most(limit);
      }
    });
  });  
});
