import request from 'supertest';
import { app } from '../index';
import * as UserModel from '../models/user';
import * as TherapistModel from '../models/therapist';
import * as AssignmentModel from '../models/assignment';

const auth = Buffer.from('therapist@test.com:password').toString('base64');

describe('/reviewAssignment endpoint', () => {

    it('should return 401 if not authenticated', async () => {
        const response = await request(app).post('/reviewAssignment');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Authentication required.' });
    });

    it('should return 403 if the user is not a therapist', async () => {
        jest.spyOn(TherapistModel, 'loginTherapist').mockReturnValueOnce(false);
        const response = await request(app)
            .post('/reviewAssignment')
            .set('Authorization', `Basic ${auth}`)
            .send({
                assignmentId: '123',
                feedbackText: 'Good job!'
            });

        expect(response.status).toBe(403);
        expect(response.body).toEqual({ message: 'Therapist permissions required.' });
    });

    it('should return 400 if the request body is missing required fields', async () => {
        jest.spyOn(TherapistModel, 'loginTherapist').mockReturnValueOnce(true);
        const response = await request(app)
            .post('/reviewAssignment')
            .set('Authorization', `Basic ${auth}`)
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: ["must have required property 'assignmentId'"]
        });
    });

    it('should return 400 if the assignment ID does not exist', async () => {
        jest.spyOn(TherapistModel, 'loginTherapist').mockReturnValueOnce(true);
        jest.spyOn(AssignmentModel, 'checkAssignment').mockReturnValueOnce(false);

        const response = await request(app)
            .post('/reviewAssignment')
            .set('Authorization', `Basic ${auth}`)
            .send({
                assignmentId: '123',
                feedbackText: 'Good job!'
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Assignment with the following ID does not exist.' });
    });

    it('should return 400 if the assignment is assigned to a different therapist', async () => {
        jest.spyOn(TherapistModel, 'loginTherapist').mockReturnValueOnce(true);
        jest.spyOn(AssignmentModel, 'checkAssignment').mockReturnValueOnce(true);
        jest.spyOn(AssignmentModel, 'getAssignmentTherapistEmail').mockReturnValueOnce('anothertherapist@test.com');
    
        const response = await request(app)
            .post('/reviewAssignment')
            .set('Authorization', `Basic ${auth}`)
            .send({
                assignmentId: '123',
                feedbackText: 'Good job!'
            });
    
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Assignment assigned to a different therapist.' });
    });
    

    it('should return 400 if the assignment has not yet been completed', async () => {
        jest.spyOn(TherapistModel, 'loginTherapist').mockReturnValueOnce(true);
        jest.spyOn(AssignmentModel, 'checkAssignment').mockReturnValueOnce(true);
        jest.spyOn(AssignmentModel, 'getAssignmentTherapistEmail').mockReturnValueOnce('therapist@test.com');
        jest.spyOn(AssignmentModel, 'getAssignmentStatus').mockReturnValue('created');
    
        const response = await request(app)
            .post('/reviewAssignment')
            .set('Authorization', `Basic ${auth}`)
            .send({
                assignmentId: '123',
                feedbackText: 'Good job!'
            });
    
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Assignment has not yet been completed.' });
    });

    it('should return 400 if the assignment has already been reviewed', async () => {
        jest.spyOn(TherapistModel, 'loginTherapist').mockReturnValueOnce(true);
        jest.spyOn(AssignmentModel, 'checkAssignment').mockReturnValueOnce(true);
        jest.spyOn(AssignmentModel, 'getAssignmentTherapistEmail').mockReturnValueOnce('therapist@test.com');
        jest.spyOn(AssignmentModel, 'getAssignmentStatus').mockReturnValue('reviewed');
    
        const response = await request(app)
            .post('/reviewAssignment')
            .set('Authorization', `Basic ${auth}`)
            .send({
                assignmentId: '123',
                feedbackText: 'Good job!'
            });
    
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Assignment has already been reviewed.' });
    });
    

    it('should successfully review the assignment', async () => {
        jest.spyOn(TherapistModel, 'loginTherapist').mockReturnValueOnce(true);
        jest.spyOn(AssignmentModel, 'checkAssignment').mockReturnValueOnce(true);
        jest.spyOn(AssignmentModel, 'getAssignmentTherapistEmail').mockReturnValueOnce('therapist@test.com');
        jest.spyOn(AssignmentModel, 'getAssignmentStatus').mockReturnValue('completed');
        jest.spyOn(AssignmentModel, 'setAssignmentFeedback').mockReturnValueOnce();
        jest.spyOn(UserModel, 'getUserName').mockReturnValueOnce('John Doe');

        const response = await request(app)
            .post('/reviewAssignment')
            .set('Authorization', `Basic ${auth}`)
            .send({
                assignmentId: '123',
                feedbackText: 'Good job!'
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            assignmentId: "123",
            feedbackText: "Good job!",
            status: "completed",
        });

        expect(AssignmentModel.setAssignmentFeedback).toHaveBeenCalledWith('123', 'Good job!');
    });
});