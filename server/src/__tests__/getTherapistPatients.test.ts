import request from 'supertest';
import { app } from '../index';
import * as UserModel from '../models/user';
import * as TherapistModel from '../models/therapist';
import * as SpeechModel from '../models/speechRate';

const auth = Buffer.from('test@test.com:password').toString('base64');

describe('/getTherapistPatients endpoint', () => {
    beforeEach(() => {
        jest.spyOn(TherapistModel, 'loginTherapist').mockReturnValueOnce(true);
    });

    it('should return 401 if not authenticated', async () => {
        const response = await request(app).get('/getTherapistPatients');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Authentication required.' });
    });

    it('should return 200 and empty patients array if no patients found', async () => {
        jest.spyOn(UserModel, 'getTherapistUsers').mockReturnValueOnce([]);

        const response = await request(app)
            .get('/getTherapistPatients')
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            patients: [],
        });
    });

    it('should return 200 and patients array if patients found', async () => {
        const speech = {
            speechId: "speechTestId-123",
            wpm: 110,
            accuracy: 85,
            date: new Date().toISOString(),
        }
        jest.spyOn(UserModel, 'getTherapistUsers').mockReturnValueOnce([
            { email: 'patient1@test.com' },
            { email: 'patient2@test.com' },
        ]);
        jest.spyOn(UserModel, 'getUserName').mockImplementation((email: string) => {
            return email === 'patient1@test.com' ? 'Patient 1' : 'Patient 2';
        });
        jest.spyOn(SpeechModel, 'retrieveSpeech').mockReturnValue(speech);

        const response = await request(app)
            .get('/getTherapistPatients')
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            patients: [
                {
                    patient: {
                        userEmail: 'patient1@test.com',
                        userName: 'Patient 1',
                        speech: speech,
                    },
                },
                {
                    patient: {
                        userEmail: 'patient2@test.com',
                        userName: 'Patient 2',
                        speech: speech,
                    },
                },
            ],
        });
    });
});
