import request from 'supertest';
import { app } from '../index';
import * as UserModel from '../models/user';
import * as TherapistModel from '../models/therapist';

const auth = Buffer.from('therapist@test.com:password').toString('base64');

describe('/removePatient endpoint', () => {
    beforeEach(() => {
        jest.spyOn(TherapistModel, 'loginTherapist').mockReturnValueOnce(true);
    });

    it('should return 401 if not authenticated', async () => {
        const response = await request(app).patch('/removePatient').send({ userEmail: 'patient@test.com' });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Authentication required.' });
    });

    it('should return 400 with invalid request body', async () => {
        const response = await request(app)
            .patch('/removePatient')
            .set('Authorization', `Basic ${auth}`)
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: ["must have required property 'userEmail'"] });
    });

    it('should return 400 if patient is not assigned to therapist', async () => {
        jest.spyOn(UserModel, 'getUserTherapistEmail').mockReturnValueOnce('othertherapist@test.com');

        const response = await request(app)
            .patch('/removePatient')
            .set('Authorization', `Basic ${auth}`)
            .send({ userEmail: 'patient@test.com' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Patient has not been assigned to you.' });
    });

    it('should remove patient and return 200 with valid request', async () => {
        jest.spyOn(UserModel, 'getUserTherapistEmail').mockReturnValueOnce('therapist@test.com');
        jest.spyOn(UserModel, 'removeTherapist').mockReturnValue();

        const response = await request(app)
            .patch('/removePatient')
            .set('Authorization', `Basic ${auth}`)
            .send({ userEmail: 'patient@test.com' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            email: 'therapist@test.com',
        });
        expect(UserModel.removeTherapist).toHaveBeenCalledTimes(1);
        expect(UserModel.removeTherapist).toHaveBeenCalledWith('patient@test.com');
    });
});
