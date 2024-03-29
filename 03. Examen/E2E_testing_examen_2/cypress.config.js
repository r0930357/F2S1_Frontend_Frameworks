import {defineConfig} from 'cypress'
import vitePreprocessor from 'cypress-vite'

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            on('file:preprocessor', vitePreprocessor())
        },
        baseUrl: 'http://localhost:5173',
    },

    env: {
        testAccount: 'r0930357@thomasmore.student.be',
        testFirstName: 'Tom',
        testLastName: 'Belmans',
        testUserId: '89bd9d8d-69a6-474e-8f46-7cc8796ed151'
    },

    component: {
        devServer: {
            framework: 'react',
            bundler: 'vite',
        },
    },
})
