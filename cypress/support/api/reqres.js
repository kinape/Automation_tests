class ReqresAPI {
      listUsers(url) {
        return cy.request({
          method: 'GET',
          url: `https://reqres.in/api${url}`,
          headers: {
            'x-api-key': 'reqres-free-v1',
          },
        });
      }

      createUser(url, body) {
        return cy.request({
          method: 'POST',
          url: `https://reqres.in/api${url}`,
          body: JSON.parse(body),
          headers: {
            'x-api-key': 'reqres-free-v1',
          },
        });
      }

      getSingleUser(url) {
        return cy.request({
          method: 'GET',
          url: `https://reqres.in/api${url}`,
          headers: {
            'x-api-key': 'reqres-free-v1',
          },
        });
      }

      updateUser(url, body) {
        return cy.request({
          method: 'PUT',
          url: `https://reqres.in/api${url}`,
          body: JSON.parse(body),
          headers: {
            'x-api-key': 'reqres-free-v1',
          },
        });
      }

      deleteUser(url) {
        return cy.request({
          method: 'DELETE',
          url: `https://reqres.in/api${url}`,
          headers: {
            'x-api-key': 'reqres-free-v1',
          },
        });
      }

      getUserExpectingError(url) {
        return cy.request({
          method: 'GET',
          url: `https://reqres.in/api${url}`,
          failOnStatusCode: false,
          headers: {
            'x-api-key': 'reqres-free-v1',
          },
        });
      }

      loginExpectingError(body) {
        return cy.request({
          method: 'POST',
          url: 'https://reqres.in/api/login',
          body: JSON.parse(body),
          failOnStatusCode: false,
          headers: {
            'x-api-key': 'reqres-free-v1',
          },
        });
      }

      postWithEmptyBodyExpectingError(url) {
        return cy.request({
          method: 'POST',
          url: `https://reqres.in/api${url}`,
          failOnStatusCode: false,
          headers: {
            'x-api-key': 'reqres-free-v1',
          },
        });
      }

      postMalformedBodyExpectingError(url, body) {
        return cy.request({
          method: 'POST',
          url: `https://reqres.in/api${url}`,
          body: body, // Enviando o corpo como está, sem parse
          failOnStatusCode: false,
          headers: {
            'x-api-key': 'reqres-free-v1',
            'Content-Type': 'application/json',
          },
        });
      }
    }

    export default new ReqresAPI();
