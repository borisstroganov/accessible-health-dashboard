import request from 'supertest';
import { app } from '../index';
import * as UserModel from '../models/user';
import * as AssignmentModel from '../models/assignment';
import * as SpeechModel from '../models/speechRate';

const auth = Buffer.from('test@test.com:password').toString('base64');

describe('/submitAssignment endpoint', () => {
    beforeEach(() => {
        jest.spyOn(UserModel, 'loginUser').mockReturnValueOnce(true);
    });

    it('should return 401 if not authenticated', async () => {
        const response = await request(app).post('/submitAssignment');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Authentication required.' });
    });

    it('should return 400 if the request body is missing required fields', async () => {
        const response = await request(app)
            .post('/submitAssignment')
            .set('Authorization', `Basic ${auth}`)
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: ["must have required property 'assignmentId'"]
        });
    });

    it('should return 400 if the assignment ID does not exist', async () => {
        jest.spyOn(AssignmentModel, 'checkAssignment').mockReturnValueOnce(false);

        const response = await request(app)
            .post('/submitAssignment')
            .set('Authorization', `Basic ${auth}`)
            .send({
                assignmentId: '123',
                wpm: 50,
                accuracy: 90
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Assignment with the following ID does not exist.' });
    });

    it('should return 400 if the assignment is not assigned to the current user', async () => {
        jest.spyOn(AssignmentModel, 'checkAssignment').mockReturnValueOnce(true);
        jest.spyOn(AssignmentModel, 'getAssignmentUserEmail').mockReturnValueOnce('anotheruser@test.com');

        const response = await request(app)
            .post('/submitAssignment')
            .set('Authorization', `Basic ${auth}`)
            .send({
                assignmentId: '123',
                wpm: 50,
                accuracy: 90
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Assignment assigned to a different user.' });
    });

    it('should return 400 if the assignment has already been completed', async () => {
        jest.spyOn(AssignmentModel, 'checkAssignment').mockReturnValueOnce(true);
        jest.spyOn(AssignmentModel, 'getAssignmentUserEmail').mockReturnValueOnce('test@test.com');
        jest.spyOn(AssignmentModel, 'getAssignmentStatus').mockReturnValueOnce('done');

        const response = await request(app)
            .post('/submitAssignment')
            .set('Authorization', `Basic ${auth}`)
            .send({
                assignmentId: '123',
                wpm: 50,
                accuracy: 90
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Assignment has already been completed.' });
    });

    it('should successfully submit the assignment', async () => {
        jest.spyOn(AssignmentModel, 'getAssignmentUserEmail').mockReturnValueOnce('test@test.com');
        jest.spyOn(AssignmentModel, 'getAssignmentStatus').mockReturnValueOnce('todo');
        jest.spyOn(AssignmentModel, 'checkAssignment').mockReturnValueOnce(true);
        jest.spyOn(AssignmentModel, 'setAssignmentSpeech').mockReturnValueOnce();
        jest.spyOn(SpeechModel, 'captureSpeech').mockReturnValueOnce('2023-03-23T12:00:00.000Z');
        jest.spyOn(SpeechModel, 'retrieveSpeech').mockReturnValueOnce({
            speechId: 'abc', wpm: 100, accuracy: 90, date: '2023-03-23T12:00:00.000Z'
        });

        const response = await request(app)
            .post('/submitAssignment')
            .set('Authorization', `Basic ${auth}`)
            .send({
                assignmentId: '123',
                wpm: 100,
                accuracy: 90,
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            email: 'test@test.com',
            wpm: 100,
            accuracy: 90,
            date: '2023-03-23T12:00:00.000Z',
        });

        expect(SpeechModel.captureSpeech).toHaveBeenCalledWith('test@test.com', 100, 90);
        expect(SpeechModel.retrieveSpeech).toHaveBeenCalledWith('test@test.com');
        expect(AssignmentModel.setAssignmentSpeech).toHaveBeenCalledWith('123', 'abc');
    });
});
