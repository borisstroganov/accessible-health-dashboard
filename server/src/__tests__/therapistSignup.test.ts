import request from 'supertest';
import { app } from '../index';
import * as TherapistModel from '../models/therapist';
import * as UserModel from '../models/user';
import * as types from '../../../common/types';

describe('POST /therapistSignup', () => {
    it('should return 400 if the request body is invalid', async () => {
        const invalidRequestBody = {
            email: 'invalid email',
            name: 'abc',
            password: 'invalid password',
        };

        const response = await request(app)
            .post('/therapistSignup')
            .send(invalidRequestBody)
            .set('Accept', 'application/json');

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('must match format "email"');
    });

    it('should return 400 if an account with the email already exists', async () => {
        const existingEmail = 'existing@test.com';
        jest.spyOn(UserModel, 'checkUserExists').mockReturnValueOnce(true);
        jest.spyOn(TherapistModel, 'checkTherapistExists').mockReturnValueOnce(false);

        const requestBody: types.TherapistSignUpRequest = {
            email: existingEmail,
            name: 'test name',
            password: 'Test1234',
        };

        const response = await request(app)
            .post('/therapistSignup')
            .send(requestBody)
            .set('Accept', 'application/json');

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Account with this email already exists');
    });

    it('should return 400 if an account with the email already exists as a user', async () => {
        const existingEmail = 'existing@test.com';
        jest.spyOn(UserModel, 'checkUserExists').mockReturnValueOnce(false);
        jest.spyOn(TherapistModel, 'checkTherapistExists').mockReturnValueOnce(true);

        const requestBody: types.TherapistSignUpRequest = {
            email: existingEmail,
            name: 'test name',
            password: 'Test1234',
        };

        const response = await request(app)
            .post('/therapistSignup')
            .send(requestBody)
            .set('Accept', 'application/json');

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Account with this email already exists');
    });

    it('should create a new therapist and return a 200 response', async () => {
        const requestBody: types.TherapistSignUpRequest = {
            email: 'newtherapist@test.com',
            name: 'test name',
            password: 'Test1234',
        };

        jest.spyOn(UserModel, 'checkUserExists').mockReturnValueOnce(false);
        jest.spyOn(TherapistModel, 'checkTherapistExists').mockReturnValueOnce(false);
        const mockCreateTherapist = jest.spyOn(TherapistModel, 'createTherapist').mockReturnValueOnce();

        const response = await request(app)
            .post('/therapistSignup')
            .send(requestBody)
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body.email).toBe(requestBody.email);
        expect(response.body.name).toBe(requestBody.name);
        expect(mockCreateTherapist).toHaveBeenCalledTimes(1);
        expect(mockCreateTherapist).toHaveBeenCalledWith(requestBody.email, requestBody.name, requestBody.password);
    });
});