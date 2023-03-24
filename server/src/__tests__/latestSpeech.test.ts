import request from 'supertest';
import { app } from '../index';
import * as UserModel from '../models/user';
import * as SpeechModel from '../models/speechRate';

const auth = Buffer.from('test@test.com:password').toString('base64');

describe('/latestSpeech endpoint', () => {
    beforeEach(() => {
        jest.spyOn(UserModel, 'loginUser').mockReturnValueOnce(true);
        jest.spyOn(SpeechModel, 'retrieveSpeech').mockClear();
    });

    it('should return 401 if not authenticated', async () => {
        const response = await request(app).get('/latestSpeech');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Authentication required.' });
    });

    it('should return 200 with valid request and speech data', async () => {
        const speech = { speechId: 'speechId-123', wpm: 120, accuracy: 80, date: new Date().toISOString() };
        jest.spyOn(SpeechModel, 'retrieveSpeech').mockReturnValueOnce(speech);

        const response = await request(app)
            .get('/latestSpeech')
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(speech);
        expect(SpeechModel.retrieveSpeech).toHaveBeenCalledTimes(1);
        expect(SpeechModel.retrieveSpeech).toHaveBeenCalledWith('test@test.com');
    });

    it('should return default values when no speech data is available', async () => {
        jest.spyOn(SpeechModel, 'retrieveSpeech').mockReturnValueOnce(undefined);

        const response = await request(app)
            .get('/latestSpeech')
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            wpm: 0,
            accuracy: 0,
            date: ''
        });
        expect(SpeechModel.retrieveSpeech).toHaveBeenCalledTimes(1);
        expect(SpeechModel.retrieveSpeech).toHaveBeenCalledWith('test@test.com');
    });
});
