const { defineConfig } = require("cypress");

try {
  const { webcrypto } = require("crypto");
  if (!globalThis.crypto) {
    globalThis.crypto = webcrypto;
  }
} catch (_) {
}

const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const { createEsbuildPlugin } = require("@badeball/cypress-cucumber-preprocessor/esbuild");
const { nodeModulesPolyfillPlugin } = require("esbuild-plugins-node-modules-polyfill");

module.exports = defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);

      on(
        "file:preprocessor",
        createBundler({
          plugins: [nodeModulesPolyfillPlugin(), createEsbuildPlugin(config)],
        })
      );

      return config;
    },
    specPattern: "cypress/e2e/cucumber/**/*.feature",
  },
});
