const request = require("supertest");
const app = require('../app.js');


describe('User-SignUp-SignIn-SignOut-Test', () => {
    test('sign up route working', async () => {
        const response = await request(app)
            .post('/users/sign-up/')
            .set('Accept', 'application/json')
            .send({
                username: 'user100',
                password: 'user100',
                confirmPassword: 'user100',
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


        // Check if the response body has a corresponding return
        expect(response.body.message).toBe("logging out, token deleted");
    });
});

describe('Get User Profile', () => {
    test('get all profile route working', async () => {
        const loginResponse = await request(app)
            .post('/users/sign-in/')
            .set('Accept', 'application/json')
            .send({
                username: 'admin1',
                password: 'admin1',
            });


        const response = await request(app)
            .get('/users/profile/')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${loginResponse.body.token}`)

        if (response.body.error)
            console.log(response.body)

        // Check if the status code is 200
        expect(response.status).toBe(200);

        // Check if the response body has a corresponding return
        expect(response.body.allUsers).toBeTruthy();
    });

    test('get one specific profile working', async () => {
        const loginResponse = await request(app)
            .post('/users/sign-in/')
            .set('Accept', 'application/json')
            .send({
                username: 'admin1',
                password: 'admin1',
            });

        const response = await request(app)
            .get('/users/profile/admin1')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${loginResponse.body.token}`)

        if (response.body.error)
            console.log(response.body)

        // Check if the status code is 200
        expect(response.status).toBe(200);

        // Check if the response body has a corresponding return
        expect(response.body.queryUser).toBeTruthy();
    });


    test('update one specific profile working', async () => {
        const loginResponse = await request(app)
            .post('/users/sign-in/')
            .set('Accept', 'application/json')
            .send({
                username: 'admin2',
                password: 'admin2',
            });

        const response = await request(app)
            .put('/users/profile/admin2')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${loginResponse.body.token}`)
            .send({
                username: 'admin2',
                firstName: 'Admin2',
                lastName: 'edited',
                email: 'admin@example.com',
            });

        if (response.body.error)
            console.log(response.body)

        // Check if the status code is 200
        expect(response.status).toBe(200);

        // Check if the response body has a corresponding return
        expect(response.body.updatedUser).toBeTruthy();
    });

    test('update rejected at other"s profile', async () => {
        const loginResponse = await request(app)
            .post('/users/sign-in/')
            .set('Accept', 'application/json')
            .send({
                username: 'admin2',
                password: 'admin2',
            });

        const response = await request(app)
            .put('/users/profile/admin1')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${loginResponse.body.token}`)
            .send({
                username: 'admin1',
                firstName: 'Admin1',
                lastName: 'edited',
                email: 'admin@example.com',
            });

        if (response.body.error)
            console.log(response.body)

        // Check if the status code is 200
        expect(response.status).toBe(200);

        // Check if the response body has a corresponding return
        expect(response.body.updatedUser).not.toBeTruthy();
    });
})