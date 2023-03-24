import request from 'supertest';
import { app } from '../index';
import * as TherapistModel from '../models/therapist';
import * as AssignmentModel from '../models/assignment';
import * as SpeechModel from '../models/speechRate';
import * as UserModel from '../models/user';

const auth = Buffer.from('therapist1@test.com:password').toString('base64');

describe('/getTherapistAssignments endpoint', () => {
    beforeEach(() => {
        jest.spyOn(TherapistModel, 'loginTherapist').mockReturnValueOnce(true);
    });

    it('should return 401 if not authenticated as therapist', async () => {

        const response = await request(app).get('/getTherapistAssignments');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Authentication required.' });
    });

    it('should return an empty assignments array if the therapist has no assignments', async () => {
        jest.spyOn(AssignmentModel, 'getTherapistAssignments').mockReturnValueOnce(undefined);

        const response = await request(app)
            .get('/getTherapistAssignments')
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            assignments: [
                {
                    assignment: {
                        assignmentId: '',
                        userName: '',
                        userEmail: '',
                        assignmentTitle: '',
                        assignmentText: '',
                        status: '',
                    },
                },
            ],
        });
    });

    it('should return an array of assignments if the therapist has assignments', async () => {
        const speech = { wpm: 50, accuracy: 80 }
        jest.spyOn(AssignmentModel, 'getTherapistAssignments').mockReturnValueOnce([{ assignmentId: '123' }]);
        jest.spyOn(AssignmentModel, 'getAssignmentUserEmail').mockReturnValueOnce('test@test.com');
        jest.spyOn(UserModel, 'getUserName').mockReturnValueOnce('Test User');
        jest.spyOn(AssignmentModel, 'getAssignmentTitle').mockReturnValueOnce('Assignment 1');
        jest.spyOn(AssignmentModel, 'getAssignmentText').mockReturnValueOnce('This is assignment 1');
        jest.spyOn(AssignmentModel, 'getAssignmentStatus').mockReturnValueOnce('reviewed');
        jest.spyOn(AssignmentModel, 'getAssignmentSpeechId').mockReturnValueOnce('456');
        jest.spyOn(SpeechModel, 'retrieveSpeechById').mockReturnValue(speech);
        jest.spyOn(AssignmentModel, 'getAssignmentFeedback').mockReturnValue('Good job!');

        const response = await request(app)
            .get('/getTherapistAssignments')
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            assignments: [
                {
                    assignment: {
                        assignmentId: '123',
                        userName: 'Test User',
                        userEmail: 'test@test.com',
                        assignmentTitle: 'Assignment 1',
                        assignmentText: 'This is assignment 1',
                        status: 'reviewed',
                        speech: { wpm: 50, accuracy: 80 },
                        feedbackText: 'Good job!',
                    },
                },
            ],
        });
    });
});
