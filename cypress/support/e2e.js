
// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import { faker } from '@faker-js/faker';

// Alternatively, you can require() commands.js as well:
// require('./commands')

Cypress.on('window:before:load', (win) => {
  win.response = {};
});

beforeEach(() => {
  if (Cypress.spec.name === 'task4.feature') {
    const user = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      telephone: faker.phone.number(),
    };

    cy.request({
      method: 'POST',
      url: 'https://ecommerce-playground.lambdatest.io/index.php?route=account/register',
      form: true,
      body: {
        firstname: user.firstName,
        lastname: user.lastName,
        email: user.email,
        telephone: user.telephone,
        password: user.password,
        confirm: user.password,
        agree: '1',
      },
    });

    Cypress.env('user', user);
  }
});
