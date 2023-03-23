import request from 'supertest';
import { app } from '../index';
import * as UserModel from '../models/user';
import * as BloodPressureModel from '../models/bloodPressure';

const auth = Buffer.from('test@test.com:password').toString('base64');

describe('/captureBp endpoint', () => {
    beforeEach(() => {
        jest.spyOn(UserModel, 'loginUser').mockReturnValueOnce(true);
    });

    it('should return 401 if not authenticated', async () => {
        const response = await request(app).post('/captureBp').send({ systolicPressure: 120, diastolicPressure: 80 });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Authentication required.' });
    });

    it('should return 400 if request body is invalid', async () => {
        const response = await request(app)
            .post('/captureBp')
            .set('Authorization', `Basic ${auth}`)
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: [
                "must have required property 'systolicPressure'"
            ],
        });
    });

    it('should return 400 if systolicPressure is invalid', async () => {
        const response = await request(app)
            .post('/captureBp')
            .set('Authorization', `Basic ${auth}`)
            .send({ systolicPressure: -1, diastolicPressure: 80 });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: [
                'must be >= 0',
            ],
        });
    });

    it('should return 400 if diastolicPressure is invalid', async () => {
        const response = await request(app)
            .post('/captureBp')
            .set('Authorization', `Basic ${auth}`)
            .send({ systolicPressure: 120, diastolicPressure: -1 });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: [
                'must be >= 0',
            ],
        });
    });

    it('should return 200 with valid request', async () => {
        jest.spyOn(BloodPressureModel, 'captureBp').mockReturnValueOnce(new Date().toISOString());
        const response = await request(app)
            .post('/captureBp')
            .set('Authorization', `Basic ${auth}`)
            .send({ systolicPressure: 120, diastolicPressure: 80 });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            email: 'test@test.com',
            systolicPressure: 120,
            diastolicPressure: 80,
            date: expect.any(String),
        });
    });
});

