describe('Add a Post', () => {
  let identity = 'Alsje'
  let password = 'GoodPa$$word123'
  let postInputs = {}

  beforeEach(() => {
    cy.fixture('addPost.json').then(data => {
      postInputs = data
    })

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

    cy.wait('@fetchPosts').then(interception => {
      expect(interception.response.statusCode).to.eq(200)
    })

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

  it('should show an error if no media is uploaded and not make a request', () => {
    cy.fixture('addPost.json').then(data => {
      const postData = data.postWithNoMedia
      cy.intercept('POST', 'http://localhost:3000/post').as('addPost')
      cy.get('[data-testid="caption_input"]').type(postData.caption)
      cy.get('[data-testid="add_button"]').click()
      cy.get('[data-testid="alert_modal"]').should(
        'contain',
        'At least one image is mandatory for all posts'
      )
      cy.get('@addPost.all').should('have.length', 0)
    })
  })

  it('should navigate to and display "Add Shop Post" screen', () => {
    cy.get('[data-testid="post_dropdown"]').click()
    cy.get('div').contains('Item for Sale').click()
    cy.get('[data-testid="price_input"]').should('be.visible')
  })

  it('should show an error if price is invalid and not make a request', () => {
    cy.fixture('addPost.json').then(data => {
      const postData = data.postWithBadPrice
      cy.get('[data-testid="post_dropdown"]').click()
      cy.get('div').contains('Item for Sale').click()
      cy.intercept('POST', 'http://localhost:3000/post').as('addPost')

      cy.get('[data-testid="price_input"]').type(postData.price)
      cy.get('[data-testid="add_button"]').click()
      cy.get('[data-testid="alert_modal"]').should(
        'contain',
        'Incorrect price format: Please use up to 2 decimal places and only one full stop'
      )
      cy.get('@addPost.all').should('have.length', 0)
    })
  })

  // need to access app code to use cy.window
  // it('should successfully add a post and navigate to Profile screen', () => {
  //   cy.fixture('images/image1.png', 'base64').then(image1 => {
  //     // Mock the POST request
  //     cy.intercept('POST', '/http://localhost:3000/post', req => {
  //       req.reply({
  //         statusCode: 201, // Adjust this based on expected success or failure
  //         body: {
  //           media: [
  //             {
  //               uri: 'image1.png',
  //               file: new File([image1], 'image1.png', { type: 'image/png' })
  //             }
  //           ],
  //           title: 'Post Title',
  //           price: '19.99',
  //           caption: 'Exciting new content',
  //           description: 'This is a description'
  //         }
  //       })
  //     }).as('addPost')

  //     // cy.get('[data-testid="caption_input"]').type('Exciting new content')
  //     // cy.get('[data-testid="price_input"]').type('19.99')
  //     cy.get('[data-testid="add_media_test_input"]', { force: true }).type(
  //       'mock-image-uri'
  //     )
  //     cy.get('[data-testid="add_button"]').click()
  //     cy.wait('@addPost')
  //     cy.get('[data-testid="profile_screen"]').should('be.visible')
  //   })
  // })
})
