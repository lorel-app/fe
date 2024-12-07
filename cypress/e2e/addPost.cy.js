describe('Login', () => {
  let identity = 'Alsje'
  let password = 'GoodPa$$word123'

  beforeEach(() => {
    cy.fixture('feed').then(fetchPosts => {
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

  it('should load unauthenticated posts feed', () => {
    cy.wait('@fetchPosts').then(interception => {
      expect(interception.response.statusCode).to.eq(200)
    })
  })

  it('should log in a user and go to add post screen', () => {
    cy.fixture('me.json').then(me => {
      cy.intercept('POST', 'http://localhost:3000/auth/login', req => {
        expect(req.body).to.deep.equal({
          identity: identity.toLowerCase(),
          password
        })
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            message: 'Logged in successfully',
            accessToken: 'myFakeAccessToken',
            refreshToken: 'myFakeRefreshToken',
            user: me
          }
        })
      }).as('login')

      cy.fixture('feedAuthenticated').then(fetchPostsAuthenticated => {
        cy.intercept(
          {
            method: 'GET',
            url: 'http://localhost:3000/?limit=10&offset=0'
          },
          {
            statusCode: 200,
            body: { posts: fetchPostsAuthenticated.posts }
          }
        ).as('fetchAuthenticatedPosts')
      })

      cy.get('[data-testid="button_icon"]').first().should('be.visible').click()
      cy.get('input[placeholder="Username or Email"]').type(identity)
      cy.get('input[placeholder="Password"]').type(password)
      cy.get('[data-testid="authenticate_button"]').should('be.visible').click()

      cy.wait('@login').then(interception => {
        expect(interception.response.statusCode).to.eq(200)
        expect(interception.response.body).to.have.property('accessToken')
        expect(interception.response.body).to.have.property('refreshToken')
        expect(interception.response.body.message).to.eq(
          'Logged in successfully'
        )
        expect(interception.response.body.user).to.deep.equal(me)
      })

      cy.wait('@fetchAuthenticatedPosts').then(interception => {
        expect(interception.response.statusCode).to.eq(200)
        expect(interception.response.body.posts).to.have.length.greaterThan(0)
      })

      cy.get('[aria-label="add"]').click({ force: true, multiple: true })
      cy.intercept('GET', 'http://localhost:3000/tag').as('fetchTags')
      cy.get('[data-testid="add_screen"]').should('be.visible')
    })
  })
})
