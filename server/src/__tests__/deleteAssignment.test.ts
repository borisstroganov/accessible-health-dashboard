import request from 'supertest';
import { app } from '../index';
import * as UserModel from '../models/user';
import * as TherapistModel from '../models/therapist';
import * as AssignmentModel from '../models/assignment';

const auth = Buffer.from('therapist@test.com:password').toString('base64');

describe('/deleteAssignment endpoint', () => {

    it('should return 401 if not authenticated', async () => {
        const response = await request(app).delete('/deleteAssignment');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Authentication required.' });
    });

    it('should return 403 if the user is not a therapist', async () => {
        jest.spyOn(TherapistModel, 'loginTherapist').mockReturnValueOnce(false);
        const response = await request(app)
            .delete('/deleteAssignment')
            .set('Authorization', `Basic ${auth}`)
            .send({
                assignmentId: '123',
            });

        expect(response.status).toBe(403);
        expect(response.body).toEqual({ message: 'Therapist permissions required.' });
    });

    it('should return 400 if the request body is missing required fields', async () => {
        jest.spyOn(TherapistModel, 'loginTherapist').mockReturnValueOnce(true);
        const response = await request(app)
            .delete('/deleteAssignment')
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
            .delete('/deleteAssignment')
            .set('Authorization', `Basic ${auth}`)
            .send({
                assignmentId: '123',
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Assignment with the following ID does not exist.' });
    });

    it('should return 400 if the assignment is not assigned to the current therapist', async () => {
        jest.spyOn(TherapistModel, 'loginTherapist').mockReturnValueOnce(true);
        jest.spyOn(AssignmentModel, 'checkAssignment').mockReturnValueOnce(true);
        jest.spyOn(AssignmentModel, 'getAssignmentTherapistEmail').mockReturnValueOnce('anothertherapist@test.com');

        const response = await request(app)
            .delete('/deleteAssignment')
            .set('Authorization', `Basic ${auth}`)
            .send({
                assignmentId: '123',
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Assignment assigned to a different therapist.' });
    });

    it('should successfully delete the assignment', async () => {
        jest.spyOn(TherapistModel, 'loginTherapist').mockReturnValueOnce(true);
        jest.spyOn(AssignmentModel, 'checkAssignment').mockReturnValueOnce(true);
        jest.spyOn(AssignmentModel, 'getAssignmentTherapistEmail').mockReturnValueOnce('therapist@test.com');
        jest.spyOn(AssignmentModel, 'deleteAssignment').mockReturnValueOnce();

        const response = await request(app)
            .delete('/deleteAssignment')
            .set('Authorization', `Basic ${auth}`)
            .send({
                assignmentId: '123',
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            email: 'therapist@test.com',
        });

        expect(AssignmentModel.deleteAssignment).toHaveBeenCalledWith('123');
    });
});