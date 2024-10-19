describe('Home View Authenticated', () => {
  beforeEach(() => {
    cy.fixture('feedAuthenticated').then(fetchPosts => {
      cy.intercept(
        { method: 'GET', url: 'http://localhost:3000/?limit=10&offset=0' },
        {
          statusCode: 200,
          body: { posts: fetchPosts.posts }
        }
      ).as('fetchPosts')
    })
    cy.visit('http://localhost:8081')
  })

  it('should fetch the first user posts on load', () => {
    cy.wait('@fetchPosts').then(interception => {
      expect(interception.response.statusCode).to.eq(200)
    })
  })
})
