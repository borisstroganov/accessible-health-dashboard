import request from 'supertest';
import { app } from '../index';
import * as UserModel from '../models/user';
import * as TherapistModel from '../models/therapist';
import * as SpeechModel from '../models/speechRate';

const auth = Buffer.from('test-therapist@test.com:password').toString('base64');

describe('/therapistRetrieveSpeeches endpoint', () => {
    beforeEach(() => {
        jest.spyOn(TherapistModel, 'loginTherapist').mockReturnValueOnce(true);
        jest.spyOn(SpeechModel, 'retrieveAllSpeech').mockClear();
    });

    it('should return 401 if not authenticated', async () => {
        const response = await request(app).get('/therapistRetrieveSpeeches?userEmail=testuser@test.com');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Authentication required.' });
    });

    it('should return 400 if userEmail parameter is not provided', async () => {
        const response = await request(app)
            .get('/therapistRetrieveSpeeches')
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: ['must have required property \'userEmail\''] });
    });

    it('should return 400 if the user is not assigned to the therapist', async () => {
        jest.spyOn(UserModel, 'getUserTherapistEmail').mockReturnValueOnce('other-therapist@test.com');

        const response = await request(app)
            .get('/therapistRetrieveSpeeches?userEmail=testuser@test.com')
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'This user is not assigned to you.' });
        expect(UserModel.getUserTherapistEmail).toHaveBeenCalledTimes(1);
        expect(UserModel.getUserTherapistEmail).toHaveBeenCalledWith('testuser@test.com');
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
            },];
        jest.spyOn(SpeechModel, 'retrieveAllSpeech').mockReturnValueOnce(allSpeech);
        jest.spyOn(UserModel, 'getUserTherapistEmail').mockReturnValueOnce('test-therapist@test.com');

        const response = await request(app)
            .get('/therapistRetrieveSpeeches?userEmail=testuser@test.com')
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
        expect(SpeechModel.retrieveAllSpeech).toHaveBeenCalledWith('testuser@test.com');
    });

    it('should return default values if no speech data exists', async () => {
        jest.spyOn(SpeechModel, 'retrieveAllSpeech').mockReturnValueOnce(undefined);
        jest.spyOn(UserModel, 'getUserTherapistEmail').mockReturnValueOnce('test-therapist@test.com');

        const response = await request(app)
            .get('/therapistRetrieveSpeeches?userEmail=testuser@test.com')
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
        expect(SpeechModel.retrieveAllSpeech).toHaveBeenCalledWith('testuser@test.com');
    });
});

