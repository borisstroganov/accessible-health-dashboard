import request from 'supertest';
import { app } from '../index';
import * as UserModel from '../models/user';

const auth = Buffer.from('test@test.com:password').toString('base64');

describe('/removeTherapist endpoint', () => {
    beforeEach(() => {
        jest.spyOn(UserModel, 'loginUser').mockReturnValueOnce(true);
    });

    it('should return 401 if not authenticated', async () => {
        const response = await request(app).patch('/removeTherapist');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Authentication required.' });
    });

    it('should return 400 if therapist has not been assigned', async () => {
        jest.spyOn(UserModel, 'getUserTherapistEmail').mockReturnValueOnce(undefined);

        const response = await request(app)
            .patch('/removeTherapist')
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Therapist has not yet been assigned to this account.' });
    });

    it('should remove therapist and return 200 with valid request', async () => {
        jest.spyOn(UserModel, 'getUserTherapistEmail').mockReturnValueOnce('therapist@test.com');
        jest.spyOn(UserModel, 'removeTherapist').mockReturnValue();

        const response = await request(app)
            .patch('/removeTherapist')
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ email: 'test@test.com' });
        expect(UserModel.removeTherapist).toHaveBeenCalledTimes(1);
        expect(UserModel.removeTherapist).toHaveBeenCalledWith('test@test.com');
    });
});
