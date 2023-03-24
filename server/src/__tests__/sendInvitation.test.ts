import request from 'supertest';
import { app } from '../index';
import * as UserModel from '../models/user';
import * as TherapistModel from '../models/therapist';
import * as InvitationModel from '../models/invitation';

const auth = Buffer.from('test@test.com:password').toString('base64');

describe('/sendInvitation endpoint', () => {
    beforeEach(() => {
        jest.spyOn(TherapistModel, 'loginTherapist').mockReturnValueOnce(true);
    });

    it('should return 401 if not authenticated', async () => {
        const response = await request(app).post('/sendInvitation');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Authentication required.' });
    });

    it('should return 400 if invalid request body', async () => {
        const response = await request(app)
            .post('/sendInvitation')
            .set('Authorization', `Basic ${auth}`)
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.message).toContain("must have required property 'userEmail'");
    });

    it('should return 400 if patient does not exist', async () => {
        jest.spyOn(UserModel, 'checkUserExists').mockReturnValueOnce(false);

        const response = await request(app)
            .post('/sendInvitation')
            .set('Authorization', `Basic ${auth}`)
            .send({ userEmail: 'nonexistent@test.com' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Patient with this email does not exist.');
    });

    it('should return 400 if invitation already sent to patient', async () => {
        jest.spyOn(UserModel, 'checkUserExists').mockReturnValueOnce(true);
        jest.spyOn(InvitationModel, 'checkInvitation').mockReturnValueOnce(true);

        const response = await request(app)
            .post('/sendInvitation')
            .set('Authorization', `Basic ${auth}`)
            .send({ userEmail: 'patient@test.com' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('An invitation has already been sent to this patient.');
    });

    it('should return 400 if patient already has a therapist', async () => {
        jest.spyOn(UserModel, 'checkUserExists').mockReturnValueOnce(true);
        jest.spyOn(InvitationModel, 'checkInvitation').mockReturnValueOnce(false);
        jest.spyOn(UserModel, 'getUserTherapistEmail').mockReturnValueOnce('therapist@test.com');

        const response = await request(app)
            .post('/sendInvitation')
            .set('Authorization', `Basic ${auth}`)
            .send({ userEmail: 'patient@test.com' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('A therapist is already assigned to this patient.');
    });

    it('should return 200 if invitation sent successfully', async () => {
        jest.spyOn(UserModel, 'checkUserExists').mockReturnValueOnce(true);
        jest.spyOn(InvitationModel, 'checkInvitation').mockReturnValueOnce(false);
        jest.spyOn(UserModel, 'getUserTherapistEmail').mockReturnValueOnce(undefined);
        jest.spyOn(InvitationModel, 'createInvitation').mockReturnValueOnce();

        const response = await request(app)
            .post('/sendInvitation')
            .set('Authorization', `Basic ${auth}`)
            .send({ userEmail: 'patient@test.com' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            userEmail: 'patient@test.com',
            therapistEmail: 'test@test.com',
        });
    });
});
