import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const url = "https://ecommerce-playground.lambdatest.io/index.php?route=account/login";

Given("que eu estou na página de login", () => {
  cy.visit(url);
});

When("eu insiro credenciais válidas", () => {
  cy.get("#username").type("tomsmith");
  cy.get("#password").type("SuperSecretPassword!");
});

When("eu insiro um usuário válido e senha incorreta", () => {
  cy.get("#username").type("tomsmith");
  cy.get("#password").type("wrongpassword");
});

When("clico no botão de login", () => {
  cy.get('button[type="submit"]').click();
});

Then("eu devo ser redirecionado para a área segura", () => {
  cy.url().should("include", "/secure");
  cy.get("#flash").should("contain", "You logged into a secure area!");
});

Then("eu devo ver uma mensagem de erro contendo {string}", (erro) => {
  cy.get("#flash").should("contain", erro);
});
