describe('Dashboard', () => {
  it('should show loading while loading posts and show not post', () => {
    cy.visit('http://localhost:8081/dashboard');
    cy.contains('Loading posts ...');
  });
  it('should render posts after loading', () => {
    const posts = [
      { id: 1, title: 'title1', body: 'body1' },
      { id: 2, title: 'title2', body: 'body2' },
    ];
    cy.server();
    cy.route({
      url: 'https://jsonplaceholder.typicode.com/posts',
      method: 'GET',
      response: posts,
    }).as('loadPosts');
    cy.visit('http://localhost:8081/dashboard');
    posts.forEach(post => {
      cy.contains(post.title);
      cy.contains(post.body);
    });
  });
  it('should show no post if no post returns', () => {
    cy.server();
    cy.route({
      url: 'https://jsonplaceholder.typicode.com/posts',
      method: 'GET',
      response: [],
    });
    cy.visit('http://localhost:8081/dashboard');
    cy.contains('There\'s no post yet');
  });
  it('should show error while loading fails', () => {
    cy.server();
    cy.route({
      url: 'https://jsonplaceholder.typicode.com/posts',
      method: 'GET',
      status: 500,
      response: '',
    });
    cy.visit('http://localhost:8081/dashboard');
    cy.contains('There\'s something wrong!');
  });
});
