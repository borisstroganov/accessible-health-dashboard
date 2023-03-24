import request from 'supertest';
import { app } from '../index';
import * as UserModel from '../models/user';
import * as HrModel from '../models/heartRate';

const auth = Buffer.from('test@test.com:password').toString('base64');

describe('/latestHr endpoint', () => {
    beforeEach(() => {
        jest.spyOn(UserModel, 'loginUser').mockReturnValueOnce(true);
        jest.spyOn(HrModel, 'retrieveHr').mockClear();
    });

    it('should return 401 if not authenticated', async () => {
        const response = await request(app).get('/latestHr');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Authentication required.' });
    });

    it('should return the latest heart rate if it exists', async () => {
        const latestHr = {
            hr: 80,
            date: new Date().toISOString()
        };
        jest.spyOn(HrModel, 'retrieveHr').mockReturnValueOnce(latestHr);
        const response = await request(app)
            .get('/latestHr')
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(latestHr);
        expect(HrModel.retrieveHr).toHaveBeenCalledTimes(1);
        expect(HrModel.retrieveHr).toHaveBeenCalledWith('test@test.com');
    });

    it('should return default values if latest heart rate does not exist', async () => {
        jest.spyOn(HrModel, 'retrieveHr').mockReturnValueOnce(undefined);
        const response = await request(app)
            .get('/latestHr')
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            hr: 0,
            date: "",
        });
        expect(HrModel.retrieveHr).toHaveBeenCalledTimes(1);
        expect(HrModel.retrieveHr).toHaveBeenCalledWith('test@test.com');
    });
});
