import React from 'react';

describe('Happy path', () => {
  it('to the login', () => {
    cy.visit('localhost:3000/')
    cy.url().should('include', 'localhost:3000')
  })

  it('to the register', () => {
    cy.get("button[name='1']")
        .click()
    cy.url().should('include', 'register')
  })
})