const request = require("supertest");
const app = require('../app.js');


describe('Get Chat ', () => {
    test('get all chats route working', async () => {
        const loginResponse = await request(app)
            .post('/users/sign-in/')
            .set('Accept', 'application/json')
            .send({
                username: 'admin1',
                password: 'admin1',
            });


        const response = await request(app)
            .get('/chats/')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${loginResponse.body.token}`)

        if (response.body.error)
            console.log(response.body)

        // Check if the status code is 200
        expect(response.status).toBe(200);

        // Check if the response body has a corresponding return
        expect(response.body.allChats).toBeTruthy();
    });

    test('get one involving chat ', async () => {
        const loginResponse = await request(app)
            .post('/users/sign-in/')
            .set('Accept', 'application/json')
            .send({
                username: 'admin1',
                password: 'admin1',
            });

        const response = await request(app)
            .get('/chats/1')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${loginResponse.body.token}`)

        if (response.body.error)
            console.log(response.body)

        // Check if the status code is 200
        expect(response.status).toBe(200);

        // Check if the response body has a corresponding return
        expect(response.body.chat).toBeTruthy();
    });

    test('get rejected for non-involving chat ', async () => {
        const loginResponse = await request(app)
            .post('/users/sign-in/')
            .set('Accept', 'application/json')
            .send({
                username: 'admin1',
                password: 'admin1',
            });

        const response = await request(app)
            .get('/chats/5')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${loginResponse.body.token}`)

        // Check if the status code is 200
        expect(response.status).toBe(200);

        // Check if the response body has a corresponding return
        expect(response.body.chat).not.toBeTruthy();
    });
})

describe('Post new Chat or Message', () => {
    test('post new chat route working', async () => {
        const loginResponse = await request(app)
            .post('/users/sign-in/')
            .set('Accept', 'application/json')
            .send({
                username: 'admin1',
                password: 'admin1',
            });

        const response = await request(app)
            .post('/chats/')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${loginResponse.body.token}`)
            .send({
                userIds: [1, 5],
                isGroupChat: false,
            });

        if (response.body.error)
            console.log(response.body)

        // Check if the status code is 200
        expect(response.status).toBe(200);

        // Check if the response body has a corresponding return
        expect(response.body.chat).toBeTruthy();
    });

    test('post rejected to create duplicate chat', async () => {
        const loginResponse = await request(app)
            .post('/users/sign-in/')
            .set('Accept', 'application/json')
            .send({
                username: 'admin1',
                password: 'admin1',
            });

        const response = await request(app)
            .post('/chats/')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${loginResponse.body.token}`)
            .send({
                userIds: [1, 5],
                isGroupChat: false,
            });

        // Check if the status code is 200
        expect(response.status).toBe(200);

        // Check if the response body has a corresponding return
        expect(response.body.chat).not.toBeTruthy();
    });

    test('post new msg route working', async () => {
        const loginResponse = await request(app)
            .post('/users/sign-in/')
            .set('Accept', 'application/json')
            .send({
                username: 'admin1',
                password: 'admin1',
            });

        const response = await request(app)
            .post('/chats/1')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${loginResponse.body.token}`)
            .send({
                userId: 1,
                text: "test msg1 by admin1",
            });

        if (response.body.error)
            console.log(response.body)

        // Check if the status code is 200
        expect(response.status).toBe(200);

        // Check if the response body has a corresponding return
        expect(response.body.chat).toBeTruthy();
    });

    test('post rejected new msg at unAuthorized chat ', async () => {
        const loginResponse = await request(app)
            .post('/users/sign-in/')
            .set('Accept', 'application/json')
            .send({
                username: 'admin1',
                password: 'admin1',
            });

        const response = await request(app)
            .post('/chats/5')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${loginResponse.body.token}`)
            .send({
                userId: 5,
                text: "test msg at No Access Chat room by admin1",
            });

        // Check if the status code is 200
        expect(response.status).toBe(200);

        // Check if the response body has a corresponding return
        expect(response.body.chat).not.toBeTruthy();
    });

})