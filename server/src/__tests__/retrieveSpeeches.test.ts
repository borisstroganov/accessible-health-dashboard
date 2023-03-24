import request from 'supertest';
import { app } from '../index';
import * as UserModel from '../models/user';
import * as SpeechModel from '../models/speechRate';

const auth = Buffer.from('test@test.com:password').toString('base64');

describe('/retrieveSpeeches endpoint', () => {
    beforeEach(() => {
        jest.spyOn(UserModel, 'loginUser').mockReturnValueOnce(true);
        jest.spyOn(SpeechModel, 'retrieveAllSpeech').mockClear();
    });

    it('should return 401 if not authenticated', async () => {
        const response = await request(app).get('/retrieveSpeeches');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Authentication required.' });
    });

    it('should return all speech data if exists', async () => {
        const allSpeech = [
            {
                wpm: 100,
                accuracy: 80,
                date: new Date().toISOString(),
            }, {
                wpm: 90,
                accuracy: 85,
                date: new Date().toISOString(),
            },
        ];
        jest.spyOn(SpeechModel, 'retrieveAllSpeech').mockReturnValueOnce(allSpeech);

        const response = await request(app)
            .get('/retrieveSpeeches')
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            speeches: allSpeech.map(item => ({
                speechCapture: {
                    wpm: item.wpm,
                    accuracy: item.accuracy,
                    date: item.date,
                },
            })),
        });
        expect(SpeechModel.retrieveAllSpeech).toHaveBeenCalledTimes(1);
        expect(SpeechModel.retrieveAllSpeech).toHaveBeenCalledWith('test@test.com');
    });

    it('should return default values if no speech data exists', async () => {
        jest.spyOn(SpeechModel, 'retrieveAllSpeech').mockReturnValueOnce(undefined);

        const response = await request(app)
            .get('/retrieveSpeeches')
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            speeches: [{
                speechCapture: {
                    wpm: 0,
                    accuracy: 0,
                    date: '',
                },
            }],
        });

        expect(SpeechModel.retrieveAllSpeech).toHaveBeenCalledTimes(1);
        expect(SpeechModel.retrieveAllSpeech).toHaveBeenCalledWith('test@test.com');
    });
});
