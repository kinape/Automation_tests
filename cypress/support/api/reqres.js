class ReqresAPI {
  baseUrl() {
    return Cypress.env('API_BASE_URL') || 'http://localhost:3000/api';
  }

  listUsers(url) {
    return cy.request({
      method: 'GET',
      url: `${this.baseUrl()}${url}`,
    });
  }

  createUser(url, body) {
    return cy.request({
      method: 'POST',
      url: `${this.baseUrl()}${url}`,
      body: JSON.parse(body),
    });
  }

  getSingleUser(url) {
    return cy.request({
      method: 'GET',
      url: `${this.baseUrl()}${url}`,
    });
  }

  updateUser(url, body) {
    return cy.request({
      method: 'PUT',
      url: `${this.baseUrl()}${url}`,
      body: JSON.parse(body),
    });
  }

  deleteUser(url) {
    return cy.request({
      method: 'DELETE',
      url: `${this.baseUrl()}${url}`,
    });
  }

  getUserExpectingError(url) {
    return cy.request({
      method: 'GET',
      url: `${this.baseUrl()}${url}`,
      failOnStatusCode: false,
    });
  }

  loginExpectingError(body) {
    return cy.request({
      method: 'POST',
      url: `${this.baseUrl()}/login`,
      body: JSON.parse(body),
      failOnStatusCode: false,
    });
  }

  postWithEmptyBodyExpectingError(url) {
    return cy.request({
      method: 'POST',
      url: `${this.baseUrl()}${url}`,
      failOnStatusCode: false,
    });
  }

  postMalformedBodyExpectingError(url, body) {
    return cy.request({
      method: 'POST',
      url: `${this.baseUrl()}${url}`,
      body: body, // Envia o corpo como está, sem parse
      failOnStatusCode: false,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export default new ReqresAPI();

