const request = require("supertest");
const app = require('../app.js');

describe('Main Route Test', () => {
    test("index route working", done => {
        request(app)
            .get("/")
            .expect(200, done)
    });

    test("error 404 route working", done => {
        request(app)
            .get("/abc/abc")
            .expect(404, done)
    });
})
