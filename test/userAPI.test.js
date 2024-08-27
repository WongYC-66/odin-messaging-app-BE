const request = require("supertest");
const app = require('../app.js');


describe('User-SignUp-SignIn-SignOut-Test', () => {
    test('sign up route working', async () => {
        const response = await request(app)
            .post('/users/sign-up/')
            .set('Accept', 'application/json')
            .send({
                username: 'user4',
                password: 'user4',
                confirmPassword: 'user4',
                firstName: 'Kelly',
                lastName: 'Jugder',
            });

        if (response.body.error)
            console.log(response.body)

        // Check if the status code is 200
        expect(response.status).toBe(200);

        // Check if the response body has a token
        expect(response.body.token).toBeTruthy();
    });

    test('sign in route working', async () => {
        const response = await request(app)
            .post('/users/sign-in/')
            .set('Accept', 'application/json')
            .send({
                username: 'admin1',
                password: 'admin1',
            });

        if (response.body.error)
            console.log(response.body)

        // Check if the status code is 200
        expect(response.status).toBe(200);

        // Check if the response body has a token
        expect(response.body.token).toBeTruthy();
    });

    test('sign out route working', async () => {
        const response = await request(app)
            .get('/users/sign-out/');

        if (response.body.error)
            console.log(response.body)

        // Check if the status code is 200
        expect(response.status).toBe(200);

        // Check if the response body has a token
        expect(response.body.message).toBe("logging out, token deleted");
    });
});