
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { faker } from '@faker-js/faker';

const user = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  telephone: faker.phone.number()
}

Given("que eu estou na página de cadastro", () => {
  cy.visit("https://ecommerce-playground.lambdatest.io/index.php?route=account/register");
});

When("eu preencho o formulário de cadastro com dados válidos", () => {
  cy.get('#input-firstname').type(user.firstName);
  cy.get('#input-lastname').type(user.lastName);
  cy.get('#input-email').type(user.email);
  cy.get('#input-telephone').type(user.telephone);
  cy.get('#input-password').type(user.password);
  cy.get('#input-confirm').type(user.password);
  cy.get('input[name="agree"]').check({force: true});
});

When("eu clico no botão de cadastro", () => {
  cy.get('input[value="Continue"]').click();
});

Then("eu devo ser redirecionado para a página de sucesso de cadastro", () => {
  cy.url().should("include", "success");
  cy.get("h1").should("contain", "Your Account Has Been Created!");
});

Given("que eu estou na página de login", () => {
  cy.visit("https://ecommerce-playground.lambdatest.io/index.php?route=account/login");
});

When("eu preencho o email e a senha com os dados do usuário cadastrado", () => {
  cy.get('#input-email').type(user.email);
  cy.get('#input-password').type(user.password);
});

When("eu clico no botão de login", () => {
  cy.get('input[value="Login"]').click();
});

Then("eu devo ser redirecionado para a minha conta", () => {
  cy.url().should("include", "account/account");
  cy.get("h2").should("contain", "My Account");
});

Then("eu devo ver uma mensagem de erro de login", () => {
  cy.get(".alert-danger").should("be.visible");
});

When("eu deixo os campos obrigatórios em branco", () => {
  // Não preenche nada
});

Then("eu devo ver mensagens de erro para campos obrigatórios", () => {
  cy.get('input[value="Continue"]').click();
  cy.get('#account > div:nth-child(3) .text-danger').should('contain', 'First Name must be between 1 and 32 characters!');
  cy.get('#account > div:nth-child(4) .text-danger').should('contain', 'Last Name must be between 1 and 32 characters!');
  cy.get('#account > div:nth-child(5) .text-danger').should('contain', 'E-Mail Address does not appear to be valid!');
  cy.get('#account > div:nth-child(6) .text-danger').should('contain', 'Telephone must be between 3 and 32 characters!');
  cy.get('fieldset:nth-child(2) .form-group:nth-child(2) .text-danger').should('contain', 'Password must be between 4 and 20 characters!');
  cy.get('div.alert-danger').should('contain', 'Warning: You must agree to the Privacy Policy!');
});

When("eu preencho o email com um email invalido e a senha com uma senha invalida", (email, password) => {
  cy.get('#input-email').type(faker.internet.email());
  cy.get('#input-password').type(faker.internet.password());
});
