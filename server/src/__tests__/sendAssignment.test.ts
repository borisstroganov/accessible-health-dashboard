import request from 'supertest';
import { app } from '../index';
import * as UserModel from '../models/user';
import * as TherapistModel from '../models/therapist';
import * as AssignmentModel from '../models/assignment';

const auth = Buffer.from('test@test.com:password').toString('base64');

describe('/sendAssignment endpoint', () => {
    beforeEach(() => {
        jest.spyOn(TherapistModel, 'loginTherapist').mockReturnValueOnce(true);
    });

    it('should return 401 if not authenticated', async () => {
        const response = await request(app).post('/sendAssignment');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Authentication required.' });
    });

    it('should return 400 if invalid request body', async () => {
        const response = await request(app)
            .post('/sendAssignment')
            .set('Authorization', `Basic ${auth}`)
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.message).toContain("must have required property 'userEmail'");
    });

    it('should return 400 if patient does not exist', async () => {
        jest.spyOn(UserModel, 'checkUserExists').mockReturnValueOnce(false);

        const response = await request(app)
            .post('/sendAssignment')
            .set('Authorization', `Basic ${auth}`)
            .send({ userEmail: 'nonexistent@test.com', assignmentTitle: 'title', assignmentText: 'text' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Patient with this email does not exist.');
    });

    it('should return 400 if patient assigned to different therapist', async () => {
        jest.spyOn(UserModel, 'checkUserExists').mockReturnValueOnce(true);
        jest.spyOn(UserModel, 'getUserTherapistEmail').mockReturnValueOnce('other@test.com');

        const response = await request(app)
            .post('/sendAssignment')
            .set('Authorization', `Basic ${auth}`)
            .send({ userEmail: 'patient@test.com', assignmentTitle: 'title', assignmentText: 'text' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Patient assigned to a different therapist.');
    });

    it('should create assignment and return 200 if all checks pass', async () => {
        const userEmail = 'testpatient@test.com';
        const assignmentTitle = 'Test Assignment';
        const assignmentText = 'This is a test assignment.';

        jest.spyOn(UserModel, 'checkUserExists').mockReturnValueOnce(true);
        jest.spyOn(UserModel, 'getUserTherapistEmail').mockReturnValueOnce('test@test.com');
        jest.spyOn(TherapistModel, 'loginTherapist').mockReturnValueOnce(true);

        const createAssignmentSpy = jest.spyOn(AssignmentModel, 'createAssignment').mockReturnValueOnce();

        const response = await request(app)
            .post('/sendAssignment')
            .set('Authorization', `Basic ${auth}`)
            .send({
                userEmail,
                assignmentTitle,
                assignmentText,
            });

        expect(response.status).toBe(200);
        expect(createAssignmentSpy).toHaveBeenCalledWith('testpatient@test.com', 'test@test.com', assignmentTitle, assignmentText);
        expect(response.body).toEqual({
            userEmail: 'testpatient@test.com',
            therapistEmail: 'test@test.com',
            assignmentTitle: 'Test Assignment',
            assignmentText: 'This is a test assignment.',
        });
    });
});
