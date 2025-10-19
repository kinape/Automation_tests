
import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import ReqresAPI from "../../../support/api/reqres";

// Novos steps para esta suíte
Then("o header {string} da resposta deve conter {string}", (header, value) => {
  cy.window().its('response').its('headers').its(header).should('include', value);
});

Then("o header {string} da resposta deve ser {string}", (header, value) => {
  cy.window().its('response').its('headers').its(header).should('equal', value);
});

When("eu tento enviar uma requisição POST para {string} com corpo vazio", (url) => {
  ReqresAPI.postWithEmptyBodyExpectingError(url).then((res) => {
    cy.window().then((win) => {
      win.response = res;
    });
  });
});

When("eu tento enviar uma requisição POST para {string} com o corpo malformado", (url, body) => {
  ReqresAPI.postMalformedBodyExpectingError(url, body).then((res) => {
    cy.window().then((win) => {
      win.response = res;
    });
  });
});


Then("o corpo da resposta deve conter a mensagem de erro {string}", (errorMessage) => {
  cy.window().its('response').its('body').its('error').should('equal', errorMessage);
});

When("eu envio uma requisição POST para o login com o corpo", (body) => {
  ReqresAPI.loginExpectingError(body).then((res) => {
    cy.window().then((win) => {
      win.response = res;
    });
  });
});

