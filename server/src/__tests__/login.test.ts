import request from 'supertest';
import { app } from '../index';
import * as UserModel from '../models/user';


describe('POST /login', () => {
    it('should respond with 200 if credentials are valid', async () => {
        jest.spyOn(UserModel, 'loginUser').mockReturnValueOnce(true);
        jest.spyOn(UserModel, 'getUserName').mockReturnValueOnce("John Doe");

        const response = await request(app)
            .post('/login')
            .send({
                email: 'user@example.com',
                password: 'password123'
            });

        expect(response.status).toBe(200);
        expect(response.body.email).toBe('user@example.com');
        expect(response.body.name).toBe('John Doe');
    });

    it('should respond with 400 if email is missing', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                password: 'password123'
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain("must have required property 'email'");
    });

    it('should respond with 400 if email is invalid', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: 'not-an-email',
                password: 'password123'
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain("must match format \"email\"");
    });

    it('should respond with 400 if password is missing', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: 'user@example.com'
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('must have required property \'password\'');
    });

    it('should respond with 400 if email or password is incorrect', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: 'user@example.com',
                password: 'wrong-password'
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid email or password.');
    });
});
