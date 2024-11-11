describe('Home View', () => {
  beforeEach(() => {
    cy.fixture('feed').then(feedData => {
      const firstTenPosts = feedData.posts.slice(0, 10)
      const nextTenPosts = feedData.posts.slice(10, 20)
      const lastTenPosts = feedData.posts.slice(20, 30)

      cy.intercept(
        { method: 'GET', url: 'http://localhost:3000/?limit=10&offset=0' },
        {
          statusCode: 200,
          body: { posts: firstTenPosts }
        }
      ).as('fetchFirstBatch')

      cy.intercept(
        { method: 'GET', url: 'http://localhost:3000/?limit=10&offset=10' },
        {
          statusCode: 200,
          body: { posts: nextTenPosts }
        }
      ).as('fetchSecondBatch')

      cy.intercept(
        { method: 'GET', url: 'http://localhost:3000/?limit=10&offset=20' },
        {
          statusCode: 200,
          body: { posts: lastTenPosts }
        }
      ).as('fetchThirdBatch')
    })

    cy.on('window:before:load', win => {
      win.console.log = cy.stub().as('consoleLog')
    })

    cy.visit('http://localhost:8081')
  })

  it('should have header with login button when unauthenticated', () => {
    cy.get('[data-testid="button_icon"]').should('be.visible')
  })

  it('should fetch the first 10 user posts on load', () => {
    cy.wait('@fetchFirstBatch').then(interception => {
      expect(interception.response.statusCode).to.eq(200)
      expect(interception.response.body.posts).to.have.length(10)
    })
  })

  it('should fetch the next 10 posts on scroll', () => {
    cy.wait('@fetchFirstBatch')

    cy.get('[data-testid="scrollable-feed"]').scrollTo('bottom', {
      duration: 5000
    })
    cy.get('[data-testid="scrollable-feed"]').trigger('scroll')

    cy.wait('@fetchSecondBatch', { timeout: 10000 }).then(interception => {
      cy.log('Second batch fetched')
      expect(interception.response.statusCode).to.eq(200)
      expect(interception.response.body.posts).to.have.length(10)
    })
  })

  it('should fetch the final 10 posts after scrolling twice', () => {
    cy.wait('@fetchFirstBatch')

    cy.get('[data-testid="scrollable-feed"]').scrollTo('bottom', {
      duration: 5000
    })
    cy.get('[data-testid="scrollable-feed"]').trigger('scroll')
    cy.get('[data-testid="scrollable-feed"]').scrollTo('bottom', {
      duration: 5000
    })
    cy.get('[data-testid="scrollable-feed"]').trigger('scroll')

    cy.wait('@fetchThirdBatch', { timeout: 10000 }).then(interception => {
      expect(interception.response.statusCode).to.eq(200)
      expect(interception.response.body.posts).to.have.length(10)
    })
  })
})
