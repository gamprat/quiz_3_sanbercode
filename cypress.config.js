const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    defaultCommandTimeout: 10000,

    pageLoadTimeout: 40000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
