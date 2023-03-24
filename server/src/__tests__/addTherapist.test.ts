import request from 'supertest';
import { app } from '../index';
import * as UserModel from '../models/user';
import * as TherapistModel from '../models/therapist';

const auth = Buffer.from('test@test.com:password').toString('base64');

describe('/addTherapist endpoint', () => {
    beforeEach(() => {
        jest.spyOn(UserModel, 'loginUser').mockReturnValueOnce(true);
    });

    it('should return 401 if not authenticated', async () => {
        const response = await request(app).post('/addTherapist').send({ therapistEmail: 'therapist@test.com' });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Authentication required.' });
    });

    it('should return 400 with invalid request body', async () => {
        const response = await request(app)
            .post('/addTherapist')
            .set('Authorization', `Basic ${auth}`)
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: ["must have required property 'therapistEmail'"] });
    });

    it('should return 400 if therapist does not exist', async () => {
        jest.spyOn(TherapistModel, 'checkTherapistExists').mockReturnValueOnce(false);

        const response = await request(app)
            .post('/addTherapist')
            .set('Authorization', `Basic ${auth}`)
            .send({ therapistEmail: 'therapist@test.com' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Therapist with this email does not exist.' });
    });

    it('should return 400 if therapist is already assigned', async () => {
        jest.spyOn(TherapistModel, 'checkTherapistExists').mockReturnValueOnce(true);
        jest.spyOn(UserModel, 'getUserTherapistEmail').mockReturnValueOnce('therapist@test.com');

        const response = await request(app)
            .post('/addTherapist')
            .set('Authorization', `Basic ${auth}`)
            .send({ therapistEmail: 'therapist@test.com' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Therapist already assigned.' });
    });

    it('should add therapist and return 200 with valid request', async () => {
        jest.spyOn(TherapistModel, 'checkTherapistExists').mockReturnValueOnce(true);
        jest.spyOn(UserModel, 'getUserTherapistEmail').mockReturnValueOnce(undefined);
        jest.spyOn(UserModel, 'addTherapist').mockReturnValue();

        const response = await request(app)
            .post('/addTherapist')
            .set('Authorization', `Basic ${auth}`)
            .send({ therapistEmail: 'therapist@test.com' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            email: 'test@test.com',
            therapistEmail: 'therapist@test.com',
        });
        expect(UserModel.addTherapist).toHaveBeenCalledTimes(1);
        expect(UserModel.addTherapist).toHaveBeenCalledWith('test@test.com', 'therapist@test.com');
    });
});
