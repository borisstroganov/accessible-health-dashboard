import request from 'supertest';
import { app } from '../index';
import * as TherapistModel from '../models/therapist';
import * as UserModel from '../models/user';
import * as InvitationModel from '../models/invitation';

const auth = Buffer.from('test@test.com:password').toString('base64');

describe('/acceptInvitation endpoint', () => {
    beforeEach(() => {
        jest.spyOn(UserModel, 'loginUser').mockReturnValueOnce(true);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return 400 with invalid request body', async () => {
        const response = await request(app)
            .post('/acceptInvitation')
            .send({})
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: ["must have required property 'therapistEmail'"] });
    });

    it('should return 400 if therapist does not exist', async () => {
        jest.spyOn(TherapistModel, 'checkTherapistExists').mockReturnValueOnce(false);

        const response = await request(app)
            .post('/acceptInvitation')
            .send({ therapistEmail: 'therapist@test.com' })
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Therapist with this email does not exist.' });
    });

    it('should return 400 if no invitation pending from therapist', async () => {
        jest.spyOn(TherapistModel, 'checkTherapistExists').mockReturnValueOnce(true);
        jest.spyOn(InvitationModel, 'checkInvitation').mockReturnValueOnce(false);

        const response = await request(app)
            .post('/acceptInvitation')
            .send({ therapistEmail: 'therapist@test.com' })
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'No invitation pending from this therapist.' });
    });

    it('should return 400 if therapist already assigned', async () => {
        jest.spyOn(TherapistModel, 'checkTherapistExists').mockReturnValueOnce(true);
        jest.spyOn(InvitationModel, 'checkInvitation').mockReturnValueOnce(true);
        jest.spyOn(UserModel, 'getUserTherapistEmail').mockReturnValueOnce('therapist@test.com');

        const response = await request(app)
            .post('/acceptInvitation')
            .send({ therapistEmail: 'therapist@test.com' })
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'A therapist has already been assigned to this account.' });
    });

    it('should add therapist and return 200 with valid request', async () => {
        jest.spyOn(TherapistModel, 'checkTherapistExists').mockReturnValueOnce(true);
        jest.spyOn(InvitationModel, 'checkInvitation').mockReturnValueOnce(true);
        jest.spyOn(UserModel, 'getUserTherapistEmail').mockReturnValueOnce(undefined);
        jest.spyOn(InvitationModel, 'deleteInvitation').mockReturnValue();
        jest.spyOn(UserModel, 'addTherapist').mockReturnValue();
        jest.spyOn(TherapistModel, 'getTherapistName').mockReturnValue('Test Therapist');

        const response = await request(app)
            .post('/acceptInvitation')
            .send({ therapistEmail: 'therapist@test.com' })
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            therapistEmail: 'therapist@test.com',
            therapistName: 'Test Therapist'
        });

        expect(UserModel.addTherapist).toHaveBeenCalledTimes(1);
        expect(UserModel.addTherapist).toHaveBeenCalledWith('test@test.com', 'therapist@test.com');
        expect(InvitationModel.deleteInvitation).toHaveBeenCalledTimes(1);
    });
});
