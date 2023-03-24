import request from 'supertest';
import { app } from '../index';
import * as UserModel from '../models/user';
import * as TherapistModel from '../models/therapist';

const auth = Buffer.from('test@test.com:password').toString('base64');

describe('/retrieveUserTherapist endpoint', () => {
    beforeEach(() => {
        jest.spyOn(UserModel, 'loginUser').mockReturnValueOnce(true);
        jest.spyOn(UserModel, 'getUserTherapistEmail').mockClear();
    });

    it('should return 401 if not authenticated', async () => {
        const response = await request(app).get('/retrieveUserTherapist');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Authentication required.' });
    });

    it('should return empty therapist email and name if not assigned', async () => {
        jest.spyOn(UserModel, 'getUserTherapistEmail').mockReturnValueOnce(undefined);
        const response = await request(app)
            .get('/retrieveUserTherapist')
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ therapistEmail: "", therapistName: "" });
        expect(UserModel.getUserTherapistEmail).toHaveBeenCalledTimes(1);
        expect(UserModel.getUserTherapistEmail).toHaveBeenCalledWith('test@test.com');
    });

    it('should return therapist email and name if assigned', async () => {
        jest.spyOn(UserModel, 'getUserTherapistEmail').mockReturnValueOnce('therapist@test.com');
        jest.spyOn(TherapistModel, 'getTherapistName').mockReturnValueOnce('Dr. Therapist');

        const response = await request(app)
            .get('/retrieveUserTherapist')
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ therapistEmail: "therapist@test.com", therapistName: "Dr. Therapist" });
        expect(UserModel.getUserTherapistEmail).toHaveBeenCalledTimes(1);
        expect(UserModel.getUserTherapistEmail).toHaveBeenCalledWith('test@test.com');
        expect(TherapistModel.getTherapistName).toHaveBeenCalledTimes(1);
        expect(TherapistModel.getTherapistName).toHaveBeenCalledWith('therapist@test.com');
    });
});
