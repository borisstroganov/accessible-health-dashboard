import request from 'supertest';
import { app } from '../index';
import * as TherapistModel from '../models/therapist';
import * as types from '../../../common/types';

const auth = Buffer.from('test@test.com:oldPassword123').toString('base64');


describe('POST /therapistChangePassword', () => {
    const validRequest: types.TherapistChangePasswordRequest = {
        password: 'oldPassword123',
        newPassword: 'Newpassword123',
        confirmPassword: 'Newpassword123',
    };

    it('should return 400 if the request body is invalid', async () => {
        jest.spyOn(TherapistModel, 'loginTherapist').mockReturnValueOnce(true);
        const invalidRequestBody = {
            password: 'oldPassword123',
            newPassword: 'invalidPassword',
            confirmPassword: 'invalidPassword',
        };

        const response = await request(app)
            .post('/therapistChangePassword')
            .send(invalidRequestBody)
            .set('Authorization', `Basic ${auth}`);


        expect(response.status).toBe(400);
        expect(response.body.message).toContain('must match pattern \"^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$\"');
    });

    it('should return 400 if the old password is invalid', async () => {
        jest.spyOn(TherapistModel, 'loginTherapist').mockReturnValueOnce(true);
        const requestWithWrongOldPassword = {
            password: 'oldPassword12',
            newPassword: 'Newpassword123',
            confirmPassword: 'Differentpassword123',
        };

        const response = await request(app)
            .post('/therapistChangePassword')
            .send(requestWithWrongOldPassword)
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid password.');
    });

    it('should return 400 if the new passwords do not match', async () => {
        jest.spyOn(TherapistModel, 'loginTherapist').mockReturnValue(true);
        const requestWithMismatchedPasswords = {
            password: 'oldPassword123',
            newPassword: 'Newpassword123',
            confirmPassword: 'Differentpassword123',
        };

        const response = await request(app)
            .post('/therapistChangePassword')
            .send(requestWithMismatchedPasswords)
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('New passwords do not match.');
    });

    it('should return 400 if the new password is the same as the old password', async () => {
        jest.spyOn(TherapistModel, 'loginTherapist').mockReturnValue(true);
        const requestWithSamePasswords = {
            password: 'oldPassword123',
            newPassword: 'oldPassword123',
            confirmPassword: 'oldPassword123',
        };

        const response = await request(app)
            .post('/therapistChangePassword')
            .send(requestWithSamePasswords)
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('New password cannot be the same as the old password.');
    });

    it('should change the therapist password and return a 200 response', async () => {
        const mockChangeTherapistPassword = jest.spyOn(TherapistModel, 'changeTherapistPassword').mockReturnValueOnce();
        jest.spyOn(TherapistModel, 'loginTherapist').mockReturnValue(true);

        const response = await request(app)
            .post('/therapistChangePassword')
            .send(validRequest)
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(200);
        expect(response.body.email).toBeDefined();
        expect(mockChangeTherapistPassword).toHaveBeenCalledTimes(1);
    });
});
