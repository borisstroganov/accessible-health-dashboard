import request from 'supertest';
import { app } from '../index';
import * as UserModel from '../models/user';
import * as TherapistModel from '../models/therapist';
import * as InvitationModel from '../models/invitation';

const auth = Buffer.from('test@test.com:password').toString('base64');

describe('/getUserInvitations endpoint', () => {
    beforeEach(() => {
        jest.spyOn(UserModel, 'loginUser').mockReturnValueOnce(true);
    });

    it('should return 401 if not authenticated', async () => {
        const response = await request(app).get('/getUserInvitations');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Authentication required.' });
    });

    it('should return empty therapists array if no invitations found', async () => {
        jest.spyOn(InvitationModel, 'getUserInvitations').mockReturnValueOnce(undefined);

        const response = await request(app)
            .get('/getUserInvitations')
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            therapists: [
                {
                    therapist: {
                        therapistEmail: '',
                        therapistName: '',
                    },
                },
            ],
        });
    });

    it('should return therapists array if invitations found', async () => {
        jest.spyOn(InvitationModel, 'getUserInvitations').mockReturnValueOnce([{ therapistEmail: 'therapist1@test.com' }]);
        jest.spyOn(TherapistModel, 'getTherapistName').mockReturnValue('Dr. Therapist');

        const response = await request(app)
            .get('/getUserInvitations')
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            therapists: [
                {
                    therapist: {
                        therapistEmail: 'therapist1@test.com',
                        therapistName: 'Dr. Therapist',
                    },
                },
            ],
        });
    });
});
