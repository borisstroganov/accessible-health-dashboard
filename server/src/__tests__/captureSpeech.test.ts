import request from 'supertest';
import { app } from '../index';
import * as UserModel from '../models/user';
import * as SpeechRateModel from '../models/speechRate';

const auth = Buffer.from('test@test.com:password').toString('base64');

describe('/captureSpeech endpoint', () => {
    beforeEach(() => {
        jest.spyOn(UserModel, 'loginUser').mockReturnValueOnce(true);
    });

    it('should return 401 if not authenticated', async () => {
        const response = await request(app).post('/captureSpeech').send({ wpm: 100, accuracy: 90 });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Authentication required.' });
    });

    it('should return 400 if request body is invalid', async () => {
        const response = await request(app)
            .post('/captureSpeech')
            .set('Authorization', `Basic ${auth}`)
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: ["must have required property 'wpm'"],
        });
    });

    it('should return 400 if wpm is less than 0', async () => {
        const response = await request(app)
            .post('/captureSpeech')
            .set('Authorization', `Basic ${auth}`)
            .send({ wpm: -10, accuracy: 90 });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: ["must be >= 0"],
        });
    });

    it('should return 400 if wpm is greater than 999', async () => {
        const response = await request(app)
            .post('/captureSpeech')
            .set('Authorization', `Basic ${auth}`)
            .send({ wpm: 1000, accuracy: 90 });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: ["must be <= 999"],
        });
    });

    it('should return 400 if accuracy is less than 0', async () => {
        const response = await request(app)
            .post('/captureSpeech')
            .set('Authorization', `Basic ${auth}`)
            .send({ wpm: 100, accuracy: -10 });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: ["must be >= 0"],
        });
    });

    it('should return 400 if accuracy is greater than 100', async () => {
        const response = await request(app)
            .post('/captureSpeech')
            .set('Authorization', `Basic ${auth}`)
            .send({ wpm: 100, accuracy: 110 });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: ["must be <= 100"],
        });
    });

    it('should return 200 with valid request', async () => {
        jest.spyOn(SpeechRateModel, 'captureSpeech').mockReturnValueOnce(new Date().toISOString());
        const response = await request(app)
            .post('/captureSpeech')
            .set('Authorization', `Basic ${auth}`)
            .send({ wpm: 100, accuracy: 90 });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            email: 'test@test.com',
            wpm: 100,
            accuracy: 90,
            date: expect.any(String),
        });
    });
});
