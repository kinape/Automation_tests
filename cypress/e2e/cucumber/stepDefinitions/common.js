
import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import ReqresAPI from "../../../support/api/reqres";

When("eu envio uma requisição GET para {string}", (url) => {
  if (url.includes('?page=')) {
    ReqresAPI.listUsers(url).then((res) => {
      cy.window().then((win) => {
        win.response = res;
      });
    });
  } else {
    ReqresAPI.getSingleUser(url).then((res) => {
      cy.window().then((win) => {
        win.response = res;
      });
    });
  }
});

Then("a resposta do status deve ser {int}", (status) => {
  cy.window().its('response').its('status').should('eq', status);
});

When("eu envio uma requisição POST para {string} com o corpo", (url, body) => {
    ReqresAPI.createUser(url, body).then((res) => {
      cy.window().then((win) => {
        win.response = res;
      });
    });
});

Then('eu devo ver uma mensagem de erro contendo "{string}"', (errorMessage) => {
  cy.get('#flash').should('contain', errorMessage);
});
