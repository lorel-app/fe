// describe('Authenticated Home View', () => {
//   beforeEach(() => {
//     cy.fixture('feedAuthenticated').then(feedData => {
//       cy.intercept(
//         { method: 'GET', url: 'http://localhost:3000/?limit=10&offset=0' },
//         {
//           statusCode: 200,
//           body: feedData
//         }
//       ).as('fetchPosts')
//     })
//     cy.visit('http://localhost:8081')
//   })

//   it('should fetch the user posts', () => {
//     cy.wait('@fetchPosts').then(interception => {
//       expect(interception.response.statusCode).to.eq(200)
//       expect(interception.response.body.posts).to.have.length(10)
//     })
//   })

//   it('should display the button for logout when authenticated', () => {
//     // Assuming ButtonIcon for login has 'account-circle' icon name.
//     // You can use the iconName prop, class, or a test attribute to target it.
//     // cy.get('body').should('exist')
//     // Example if `ButtonIcon` has a data-testid (this is recommended

//     cy.get('[data-testid="fucking_hello"]').should('be.visible')
//     //cy.getByTestId('logout-button-icon').should('be.visible')
//   })

//   // it('should display the ButtonIcon for logout when authenticated', () => {
//   // Mock authentication context to simulate logged-in state
//   // cy.window().then(win => {
//   //   win.localStorage.setItem(
//   //     'auth',
//   //     JSON.stringify({ isAuthenticated: true })
//   //   )
//   // })

//   // Reload the page to reflect the authenticated state
//   // cy.reload()
// })
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

    cy.visit('http://localhost:8081')
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
