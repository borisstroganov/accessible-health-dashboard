import request from 'supertest';
import { app } from '../index';
import * as UserModel from '../models/user';
import * as BpModel from '../models/bloodPressure';

const auth = Buffer.from('test@test.com:password').toString('base64');

describe('/retrieveBps endpoint', () => {
    beforeEach(() => {
        jest.spyOn(UserModel, 'loginUser').mockReturnValueOnce(true);
        jest.spyOn(BpModel, 'retrieveAllBp').mockClear();
    });

    it('should return 401 if not authenticated', async () => {
        const response = await request(app).get('/retrieveBps');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Authentication required.' });
    });

    it('should return all BP data if exists', async () => {
        const bpData = [
            {
                systolicPressure: 120,
                diastolicPressure: 80,
                date: new Date().toISOString(),
            }, {
                systolicPressure: 130,
                diastolicPressure: 85,
                date: new Date().toISOString(),
            },];
        jest.spyOn(BpModel, 'retrieveAllBp').mockReturnValueOnce(bpData);

        const response = await request(app)
            .get('/retrieveBps')
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            bps: bpData.map((item) => ({
                bpCapture: {
                    systolicPressure: item.systolicPressure,
                    diastolicPressure: item.diastolicPressure,
                    date: item.date,
                },
            })),
        });
        expect(BpModel.retrieveAllBp).toHaveBeenCalledTimes(1);
        expect(BpModel.retrieveAllBp).toHaveBeenCalledWith('test@test.com');
    });

    it('should return default values if no BP data exists', async () => {
        jest.spyOn(BpModel, 'retrieveAllBp').mockReturnValueOnce(undefined);

        const response = await request(app)
            .get('/retrieveBps')
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            bps: [
                {
                    bpCapture: {
                        systolicPressure: 0,
                        diastolicPressure: 0,
                        date: '',
                    },
                },
            ],
        });

        expect(BpModel.retrieveAllBp).toHaveBeenCalledTimes(1);
        expect(BpModel.retrieveAllBp).toHaveBeenCalledWith('test@test.com');
    });
});
