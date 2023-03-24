import request from 'supertest';
import { app } from '../index';
import * as UserModel from '../models/user';
import * as TherapistModel from '../models/therapist';
import * as AssignmentModel from '../models/assignment';

const auth = Buffer.from('test@test.com:password').toString('base64');

describe('/getUserAssignments endpoint', () => {
    beforeEach(() => {
        jest.spyOn(UserModel, 'loginUser').mockReturnValueOnce(true);
    });

    it('should return 401 if not authenticated', async () => {
        const response = await request(app).get('/getUserAssignments');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Authentication required.' });
    });

    it('should return an empty assignments array if the user has no assignments', async () => {
        jest.spyOn(AssignmentModel, 'getUserAssignments').mockReturnValueOnce(undefined);

        const response = await request(app)
            .get('/getUserAssignments')
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            assignments: [
                {
                    assignment: {
                        assignmentId: '',
                        therapistName: '',
                        therapistEmail: '',
                        assignmentTitle: '',
                        assignmentText: '',
                        status: '',
                    },
                },
            ],
        });
    });

    it('should return an array of assignments if the user has assignments', async () => {
        jest.spyOn(AssignmentModel, 'getUserAssignments').mockReturnValueOnce([{ assignmentId: '123' }]);
        jest.spyOn(AssignmentModel, 'getAssignmentTherapistEmail').mockReturnValueOnce('therapist1@test.com');
        jest.spyOn(TherapistModel, 'getTherapistName').mockReturnValueOnce('Dr Therapist');
        jest.spyOn(AssignmentModel, 'getAssignmentTitle').mockReturnValueOnce('Assignment 1');
        jest.spyOn(AssignmentModel, 'getAssignmentText').mockReturnValueOnce('This is assignment 1');
        jest.spyOn(AssignmentModel, 'getAssignmentStatus').mockReturnValueOnce('todo');

        const response = await request(app)
            .get('/getUserAssignments')
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            assignments: [
                {
                    assignment: {
                        assignmentId: '123',
                        therapistName: 'Dr Therapist',
                        therapistEmail: 'therapist1@test.com',
                        assignmentTitle: 'Assignment 1',
                        assignmentText: 'This is assignment 1',
                        status: 'todo',
                        speech: { wpm: 0, accuracy: 0 },
                        feedbackText: '',
                    },
                },
            ],
        });
    });
});
