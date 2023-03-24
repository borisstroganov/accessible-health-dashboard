import request from 'supertest';
import { app } from '../index';
import * as UserModel from '../models/user';
import * as HrModel from '../models/heartRate';

const auth = Buffer.from('test@test.com:password').toString('base64');

describe('/retrieveHrs endpoint', () => {
    beforeEach(() => {
        jest.spyOn(UserModel, 'loginUser').mockReturnValueOnce(true);
        jest.spyOn(HrModel, 'retrieveAllHr').mockClear();
    });

    it('should return 401 if not authenticated', async () => {
        const response = await request(app).get('/retrieveHrs');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Authentication required.' });
    });

    it('should return all HR data if exists', async () => {
        const allHrs = [
            {
                hr: 80,
                date: new Date().toISOString(),
            }, {
                hr: 90,
                date: new Date().toISOString(),
            },];
        jest.spyOn(HrModel, 'retrieveAllHr').mockReturnValueOnce(allHrs);

        const expectedResponse = {
            hrs: allHrs.map((item) => ({
                hrCapture: {
                    hr: item.hr,
                    date: item.date,
                },
            })),
        };

        const response = await request(app)
            .get('/retrieveHrs')
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedResponse);
        expect(HrModel.retrieveAllHr).toHaveBeenCalledTimes(1);
        expect(HrModel.retrieveAllHr).toHaveBeenCalledWith('test@test.com');
    });

    it('should return default values if no HR data exists', async () => {
        jest.spyOn(HrModel, 'retrieveAllHr').mockReturnValueOnce(undefined);

        const expectedResponse = {
            hrs: [
                {
                    hrCapture: {
                        hr: 0,
                        date: '',
                    },
                },
            ],
        };

        const response = await request(app)
            .get('/retrieveHrs')
            .set('Authorization', `Basic ${auth}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedResponse);
        expect(HrModel.retrieveAllHr).toHaveBeenCalledTimes(1);
        expect(HrModel.retrieveAllHr).toHaveBeenCalledWith('test@test.com');
    });
});
