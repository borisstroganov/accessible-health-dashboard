import request from 'supertest';
import { app } from '../index';
import * as TherapistModel from '../models/therapist';
import * as UserModel from '../models/user';
import * as InvitationModel from '../models/invitation';

const auth = Buffer.from('therapist1@test.com:password').toString('base64');

describe('/getTherapistInvitations endpoint', () => {
    beforeEach(() => {
        jest.spyOn(TherapistModel, 'loginTherapist').mockReturnValueOnce(true);
    });

    it('should return 401 if not authenticated', async () => {
        const response = await request(app).get('/getTherapistInvitations');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Authentication required.' });
    });

    it('should return empty users array if no invitations found', async () => {
        jest.spyOn(InvitationModel, 'getTherapistInvitations').mockReturnValueOnce(undefined);

        const response = await request(app)
            .get('/getTherapistInvitations')
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            users: [
                {
                    user: {
                        userEmail: '',
                        userName: '',
                    },
                },
            ],
        });
    });

    it('should return users array if invitations found', async () => {
        jest.spyOn(InvitationModel, 'getTherapistInvitations').mockReturnValueOnce([{ userEmail: 'user1@test.com' }]);
        jest.spyOn(UserModel, 'getUserName').mockReturnValue('John Doe');

        const response = await request(app)
            .get('/getTherapistInvitations')
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            users: [
                {
                    user: {
                        userEmail: 'user1@test.com',
                        userName: 'John Doe',
                    },
                },
            ],
        });
    });
});
