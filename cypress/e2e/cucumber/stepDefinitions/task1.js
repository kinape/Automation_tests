
import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import ReqresAPI from "../../../support/api/reqres";

// Steps para task1.feature

Then("o corpo da resposta deve ter a propriedade {string} com o valor {int}", (property, value) => {
  cy.window().its('response').its('body').should('have.property', property, value);
});

Then("o corpo da resposta deve ter a propriedade {string} com o valor {string}", (property, value) => {
  cy.window().its('response').its('body').should('have.property', property, value);
});

Then("o corpo da resposta deve ter a propriedade {string} que é um array não vazio", (property) => {
  cy.window().then((win) => {
    expect(win.response.body).to.have.property(property);
    expect(win.response.body[property]).to.be.an('array').and.not.be.empty;
  });
});

Then("o corpo da resposta deve ter a propriedade {string}", (property) => {
  cy.window().its('response').its('body').should('have.property', property);
});

Then("a propriedade {string} do objeto {string} deve ser {int}", (prop, obj, value) => {
  cy.window().its('response').its('body').its(obj).should('have.property', prop, value);
});

When("eu envio uma requisição PUT para {string} com o corpo", (url, body) => {
  ReqresAPI.updateUser(url, body).then((res) => {
    cy.window().then((win) => {
      win.response = res;
    });
  });
});

When("eu envio uma requisição DELETE para {string}", (url) => {
  ReqresAPI.deleteUser(url).then((res) => {
    cy.window().then((win) => {
      win.response = res;
    });
  });
});

When("eu tento enviar uma requisição para um usuário inexistente em {string}", (url) => {
  ReqresAPI.getUserExpectingError(url).then((res) => {
    cy.window().then((win) => {
      win.response = res;
    });
  });
});
