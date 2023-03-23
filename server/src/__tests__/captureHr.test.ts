import request from 'supertest';
import { app } from '../index';
import * as UserModel from '../models/user';
import * as HeartRateModel from '../models/heartRate';

const auth = Buffer.from('test@test.com:password').toString('base64');

describe('/captureHr endpoint', () => {
    beforeEach(() => {
        jest.spyOn(UserModel, 'loginUser').mockReturnValueOnce(true);
    });

    it('should return 401 if not authenticated', async () => {
        const response = await request(app).post('/captureHr').send({ hr: 80 });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Authentication required.' });
    });

    it('should return 400 if request body is invalid', async () => {
        const response = await request(app)
            .post('/captureHr')
            .set('Authorization', `Basic ${auth}`)
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: ['must have required property \'hr\''],
        });
    });

    it('should return 200 with valid request', async () => {
        jest.spyOn(HeartRateModel, 'captureHr').mockReturnValueOnce(new Date().toISOString());
        const response = await request(app)
            .post('/captureHr')
            .set('Authorization', `Basic ${auth}`)
            .send({ hr: 80 });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            email: 'test@test.com',
            hr: 80,
            date: expect.any(String),
        });
    });
});
