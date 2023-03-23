import { isTherapist } from '../../index';
import * as TherapistModel from '../../models/therapist'

describe('isLoggedIn middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {
                authorization: 'Basic ' + Buffer.from('username@test.com:password').toString('base64')
            },
            auth: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should return 401 if there is no authentication header', () => {
        delete req.headers.authorization;

        isTherapist(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Authentication required.' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if credentials are invalid', () => {
        isTherapist(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Therapist permissions required.' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next if credentials are valid', () => {
        jest.spyOn(TherapistModel, 'loginTherapist').mockReturnValueOnce(true);
        isTherapist(req, res, next);

        expect(req.auth.email).toBe("username@test.com");
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });
});