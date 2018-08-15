describe('Home', () => {
  it('essential elements should all exist for home page', () => {
    cy.visit('http://localhost:8081');
    cy.location('pathname').should('include', '/home');
    cy.contains('This is Page Home');
  });
});
