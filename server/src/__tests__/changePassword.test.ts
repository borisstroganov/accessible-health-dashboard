import request from 'supertest';
import { app } from '../index';
import * as UserModel from '../models/user';
import * as types from '../../../common/types';

describe('POST /changePassword', () => {
    const validRequest: types.ChangePasswordRequest = {
        password: 'oldPassword123',
        newPassword: 'Newpassword123',
        confirmPassword: 'Newpassword123',
    };

    it('should return 400 if the request body is invalid', async () => {
        jest.spyOn(UserModel, 'loginUser').mockReturnValue(true);
        const invalidRequestBody = {
            password: 'oldPassword123',
            newPassword: 'invalidPassword',
            confirmPassword: 'invalidPassword',
        };

        const response = await request(app)
            .post('/changePassword')
            .send(invalidRequestBody)
            .set('Accept', 'application/json')
            .set('Authorization', `Basic ${Buffer.from('user@example.com:oldPassword123').toString('base64')}`)


        expect(response.status).toBe(400);
        expect(response.body.message).toContain('must match pattern \"^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$\"');
    });

    it('should return 400 if the old password is invalid', async () => {
        jest.spyOn(UserModel, 'loginUser').mockReturnValueOnce(true);
        const requestWithWrongOldPassword = {
            password: 'oldPassword12',
            newPassword: 'Newpassword123',
            confirmPassword: 'Differentpassword123',
        };

        const response = await request(app)
            .post('/changePassword')
            .send(requestWithWrongOldPassword)
            .set('Accept', 'application/json')
            .set('Authorization', `Basic ${Buffer.from('user@example.com:oldPassword123').toString('base64')}`)

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('New passwords do not match.');
    });

    it('should return 400 if the new passwords do not match', async () => {
        jest.spyOn(UserModel, 'loginUser').mockReturnValue(true);
        const requestWithMismatchedPasswords = {
            password: 'oldPassword123',
            newPassword: 'Newpassword123',
            confirmPassword: 'Differentpassword123',
        };

        const response = await request(app)
            .post('/changePassword')
            .send(requestWithMismatchedPasswords)
            .set('Accept', 'application/json')
            .set('Authorization', `Basic ${Buffer.from('user@example.com:oldPassword123').toString('base64')}`)

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('New passwords do not match.');
    });

    it('should return 400 if the new password is the same as the old password', async () => {
        jest.spyOn(UserModel, 'loginUser').mockReturnValue(true);
        const requestWithSamePasswords = {
            password: 'oldPassword123',
            newPassword: 'oldPassword123',
            confirmPassword: 'oldPassword123',
        };

        const response = await request(app)
            .post('/changePassword')
            .send(requestWithSamePasswords)
            .set('Accept', 'application/json')
            .set('Authorization', `Basic ${Buffer.from('user@example.com:oldPassword123').toString('base64')}`)

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('New password cannot be the same as the old password.');
    });

    it('should change the user password and return a 200 response', async () => {
        const mockChangeUserPassword = jest.spyOn(UserModel, 'changeUserPassword').mockReturnValueOnce();
        jest.spyOn(UserModel, 'loginUser').mockReturnValue(true);

        const response = await request(app)
            .post('/changePassword')
            .send(validRequest)
            .set('Accept', 'application/json')
            .set('Authorization', `Basic ${Buffer.from('user@example.com:oldPassword123').toString('base64')}`)

        expect(response.status).toBe(200);
        expect(response.body.email).toBeDefined();
        expect(mockChangeUserPassword).toHaveBeenCalledTimes(1);
    });
});
