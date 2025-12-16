import { errorHandler } from '../errorHandler';
import sinon from 'sinon';

describe('errorHandler', () => {

    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.stub();
    });

    afterEach(() => {
        sinon.reset();
    });

    it('should return 500 status with error message', () => {
        const error = new Error('Test error message');

        errorHandler(error, req, res, next);

        expect(res.status.calledWith(500)).toBe(true);
        expect(res.json.calledWith({ error: 'Test error message' })).toBe(true);
    });
});

