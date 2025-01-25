const request = require('supertest');
const app = require('../app'); // Import the app instance here
const testCases = require('./testCases.json'); // Import the JSON file containing test cases

describe('Authentication Tests', () => {

    // Dynamically generate tests for the register route
    describe('POST /auth/register', () => {
        testCases.register.forEach(({ username, password, expectedStatus, expectedLocation, expectedText }) => {
            it(`should handle registration for username: ${username}`, async () => {
                const response = await request(app)
                    .post('/auth/register')
                    .send({ username, password });

                

                if (expectedLocation) {
                    expect(response.header.location).toBe(expectedLocation);
                }

                if (expectedText) {
                    expect(response.text).toContain(expectedText);
                }
            });
        });
    });

    // Dynamically generate tests for the login route
    describe('POST /auth/login', () => {
        testCases.login.forEach(({ username, password, expectedStatus, expectedLocation, expectedText }) => {
            it(`should handle login for username: ${username}`, async () => {
                const response = await request(app)
                    .post('/auth/login')
                    .send({ username, password });

                

                if (expectedLocation) {
                    expect(response.header.location).toBe(expectedLocation);
                }

                if (expectedText) {
                    expect(response.text).toContain(expectedText);
                }
            });
        });
    });

});
