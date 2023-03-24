import request from 'supertest';
import { app } from '../index';
import * as UserModel from '../models/user';
import * as BpModel from '../models/bloodPressure';

const auth = Buffer.from('test@test.com:password').toString('base64');

describe('/latestBp endpoint', () => {
    beforeEach(() => {
        jest.spyOn(UserModel, 'loginUser').mockReturnValueOnce(true);
        jest.spyOn(BpModel, 'retrieveBp').mockClear();
    });

    it('should return 401 if not authenticated', async () => {
        const response = await request(app).get('/latestBp');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Authentication required.' });
    });

    it('should return latest BP data if exists', async () => {
        const latestBp = {
            systolicPressure: 120,
            diastolicPressure: 80,
            date: new Date().toISOString(),
        };
        jest.spyOn(BpModel, 'retrieveBp').mockReturnValueOnce(latestBp);

        const response = await request(app)
            .get('/latestBp')
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(latestBp);
        expect(BpModel.retrieveBp).toHaveBeenCalledTimes(1);
        expect(BpModel.retrieveBp).toHaveBeenCalledWith('test@test.com');
    });

    it('should return default values if no BP data exists', async () => {
        jest.spyOn(BpModel, 'retrieveBp').mockReturnValueOnce(undefined);

        const response = await request(app)
            .get('/latestBp')
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            systolicPressure: 0,
            diastolicPressure: 0,
            date: "",
        });

        expect(BpModel.retrieveBp).toHaveBeenCalledTimes(1);
        expect(BpModel.retrieveBp).toHaveBeenCalledWith('test@test.com');
    });
});
