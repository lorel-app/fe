import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.js',
    baseUrl: process.env.EXPO_PUBLIC_APP_URL || 'http://localhost:8081',
    viewportWidth: 393,
    viewportHeight: 852,
    defaultCommandTimeout: 30000, // timeout for cy.get()
    pageLoadTimeout: 120000, // timout for cy.visit()
    retries: {
      runMode: 2,
      openMode: 0
    }
  }
})
