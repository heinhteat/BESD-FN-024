const { expect } = require('chai');
const http = require('http');

const BASE_URL = 'http://localhost:3000';


function request(method, path, data = null) {

    return new Promise((resolve, reject) => {

        const url = new URL(BASE_URL + path);

        const body =
            data ? JSON.stringify(data) : null;


        const options = {

            hostname: url.hostname,

            port: url.port,

            path: url.pathname,

            method: method,

            headers: {
                'Content-Type': 'application/json'
            }

        };


        const req = http.request(
            options,
            (res) => {

                let responseData = '';

                res.on(
                    'data',
                    chunk => {
                        responseData += chunk;
                    }
                );


                res.on(
                    'end',
                    () => {

                        let body = {};

                        try {
                            body =
                                JSON.parse(responseData);
                        } catch (e) {
                            body = responseData;
                        }

                        resolve({
                            status: res.statusCode,
                            body: body
                        });

                    }
                );

            }
        );


        req.on('error', reject);


        if (body) {
            req.write(body);
        }


        req.end();

    });
}


describe('User API Integration Tests', () => {


    // IT-1
    it('IT-1: Retrieve all users', async () => {

        const response =
            await request('GET', '/users');

        expect(response.status).to.equal(200);

        expect(response.body).to.be.an('array');

        expect(response.body.length).to.equal(3);

        response.body.forEach(user => {

            expect(user)
                .to.not.have.property('userPassword');

        });

    });


    // IT-2
    it('IT-2: Successful registration', async () => {

        const email =
            `test${Date.now()}@gmail.com`;


        const newUser = {

            userEmail: email,

            userPassword: 'password123',

            userFirstName: 'Test',

            userLastName: 'Student',

            userTel: '0812345678',

            dateOfBirth: '2000-01-01'

        };


        const response =
            await request(
                'POST',
                '/users',
                newUser
            );


        expect(response.status).to.equal(201);

        expect(response.body.message)
            .to.equal('Created');


        const users =
            await request('GET', '/users');


        expect(users.body.length).to.equal(4);

    });


    // IT-3
    it('IT-3: Duplicate email registration fails', async () => {

        const duplicateUser = {

            userEmail: 'daranporn@gmail.com',

            userPassword: 'password123',

            userFirstName: 'Duplicate',

            userLastName: 'User',

            userTel: '0812345678',

            dateOfBirth: '2000-01-01'

        };


        const response =
            await request(
                'POST',
                '/users',
                duplicateUser
            );


        expect([400, 409])
            .to.include(response.status);


        expect(response.body.error)
            .to.contain('Email already exists');

    });


    // IT-4
    it('IT-4: Incomplete data fails', async () => {

        const incompleteUser = {

            userEmail: 'onlyemail@gmail.com'

        };


        const response =
            await request(
                'POST',
                '/users',
                incompleteUser
            );


        expect(response.status).to.equal(400);


        expect(response.body.error)
            .to.contain('Missing mandatory fields');

    });

});