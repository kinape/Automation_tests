
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("que eu estou logado", () => {
  const user = Cypress.env('user');
  cy.visit("https://ecommerce-playground.lambdatest.io/index.php?route=account/login");
  cy.get('#input-email').type(user.email);
  cy.get('#input-password').type(user.password);
  cy.get('input[value="Login"]').click();
  cy.url().should("include", "account/account");
});

Given("que eu estou na pagina inicial", () => {
  cy.visit("https://ecommerce-playground.lambdatest.io/");
});

When("eu adiciono um produto ao carrinho", () => {
  cy.visit(
    "https://ecommerce-playground.lambdatest.io/index.php?route=product/product&path=25_32&product_id=97"
  );

  cy.get(".button-buynow").click();

  // Aguarda a navegação para a página de checkout
  cy.url().should(
    "include",
    "index.php?route=checkout/checkout"
  );
});

When("eu vou para o checkout", () => {
  cy.get('a[href="https://ecommerce-playground.lambdatest.io/index.php?route=checkout/checkout"]').click({force: true});
});

When("eu preencho o formulário de pagamento com dados válidos", () => {
  const user = Cypress.env('user');
  cy.get('#input-payment-firstname').type(user.firstName);
  cy.get('#input-payment-lastname').type(user.lastName);
  cy.get('#input-payment-address-1').type('Test Address');
  cy.get('#input-payment-city').type('Test City');
  cy.get('#input-payment-postcode').type('12345');
  cy.get('#input-payment-country').select('Brazil');
  cy.get('#input-payment-zone').select('São Paulo');
  cy.get('input[name="agree"]').check({force: true});
  cy.get('#button-save').click();
});

When("eu completo a compra", () => {
  cy.get('#button-confirm').click();
});

Then("eu devo ver uma mensagem de sucesso", () => {
  cy.url().should("include", "success");
  cy.get("h1").should("contain", "Your order has been placed!");
});

Then("eu devo ver uma mensagem de erro", () => {
  cy.contains('Address 1 must be between 3 and 128 characters!').scrollIntoView().should('be.visible')
});

When("eu preencho o formulário de pagamento com um endereço de entrega incompleto", () => {
  const user = Cypress.env('user');
  cy.get('#input-payment-firstname').type(user.firstName);
  cy.get('#input-payment-lastname').type(user.lastName);
  cy.get('#input-payment-city').type('Test City');
  cy.get('#input-payment-postcode').type('12345');
  cy.get('#input-payment-country').select('Brazil');
  cy.get('#input-payment-zone').select('São Paulo');
  cy.get('input[name="agree"]').check({force: true});
  cy.get('#button-save').click();
});
