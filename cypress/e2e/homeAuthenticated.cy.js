describe('Home View Authenticated', () => {
  beforeEach(() => {
    cy.window().then(win => {
      win.localStorage.setItem('accessToken', 'myFakeAccessToken')
      win.localStorage.setItem('refreshToken', 'myFakeRefreshToken')
    })

    cy.fixture('me').then(me => {
      cy.intercept('GET', '/me', {
        statusCode: 200,
        body: me
      }).as('getMe')
    })

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
    cy.wait('@getMe')
  })

  it('should find logged in user and fetch the authenticated posts on open', () => {
    cy.wait('@fetchPosts').then(interception => {
      expect(interception.response.statusCode).to.eq(200)
    })
    // check specific posts or properties in authenticated feed
  })

  it('should have header with logout button when unauthenticated', () => {
    cy.get('[data-testid="button_icon"]').should('be.visible')
  })
})
