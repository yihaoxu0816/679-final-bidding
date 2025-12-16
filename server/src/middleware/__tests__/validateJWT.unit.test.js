import { validateJWT } from '../validateJWT';
import jwt from 'jsonwebtoken';
import sinon from 'sinon';

const jwtVerifyStub = sinon.stub(jwt, 'verify');

describe('validateJWT', () => {

    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {}
        };
        res = {
            sendStatus: sinon.stub()
        };
        next = sinon.stub();
    });

    afterEach(() => {
        jwtVerifyStub.reset();
        sinon.reset();
    });

    afterAll(() => {
        jwtVerifyStub.restore();
    });

    it('should return 401 when no authorization header', () => {
        validateJWT(req, res, next);

        expect(res.sendStatus.calledWith(401)).toBe(true);
        expect(next.called).toBe(false);
    });
});

