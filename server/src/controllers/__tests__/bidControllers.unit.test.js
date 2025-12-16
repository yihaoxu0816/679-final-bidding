import { bidControllers } from '../bidControllers';
import { bidService } from '../../services/bidService';
import sinon from 'sinon';

const getBidsByRoomIdStub = sinon.stub(bidService, 'getBidsByRoomId');
const placeBidStub = sinon.stub(bidService, 'placeBid');

describe('bidControllers', () => {

    let req, res, next;

    beforeEach(() => {
        req = {
            params: {},
            body: {},
            userId: null
        };
        res = {
            json: sinon.stub(),
            status: sinon.stub().returnsThis()
        };
        next = sinon.stub();
    });

    afterEach(() => {
        getBidsByRoomIdStub.reset();
        placeBidStub.reset();
        sinon.reset();
    });

    afterAll(() => {
        getBidsByRoomIdStub.restore();
        placeBidStub.restore();
    });

    describe('getBidsByRoomId', () => {

        it('should return bids when valid room ID is provided', async () => {
            req.params.roomId = 'room123';
            const mockBids = [
                { id: 'bid1', amount: 100 },
                { id: 'bid2', amount: 150 }
            ];
            getBidsByRoomIdStub.resolves(mockBids);

            await bidControllers.getBidsByRoomId(req, res, next);

            expect(getBidsByRoomIdStub.calledOnce).toBe(true);
            expect(getBidsByRoomIdStub.calledWith('room123')).toBe(true);
            expect(res.json.calledOnce).toBe(true);
            expect(res.json.calledWith(mockBids)).toBe(true);
            expect(next.called).toBe(false);
        });

        it('should call next with error when service throws', async () => {
            req.params.roomId = 'room123';
            const error = new Error('Room not found');
            getBidsByRoomIdStub.rejects(error);

            await bidControllers.getBidsByRoomId(req, res, next);

            expect(next.calledOnce).toBe(true);
            expect(next.calledWith(error)).toBe(true);
            expect(res.json.called).toBe(false);
        });
    });

    describe('placeBid', () => {

        it('should place bid successfully', async () => {
            req.params.roomId = 'room123';
            req.userId = 'user456';
            req.body = { amount: 200 };

            const mockBid = {
                id: 'bid123',
                roomId: 'room123',
                userId: 'user456',
                amount: 200
            };
            placeBidStub.resolves(mockBid);

            await bidControllers.placeBid(req, res, next);

            expect(placeBidStub.calledOnce).toBe(true);
            expect(placeBidStub.calledWith({
                amount: 200,
                roomId: 'room123',
                userId: 'user456'
            })).toBe(true);
            expect(res.json.calledOnce).toBe(true);
            expect(res.json.calledWith(mockBid)).toBe(true);
            expect(next.called).toBe(false);
        });

        it('should call next with error when service throws', async () => {
            req.params.roomId = 'room123';
            req.userId = 'user456';
            req.body = { amount: 50 };

            const error = new Error('Bid must be higher than current highest bid');
            placeBidStub.rejects(error);

            await bidControllers.placeBid(req, res, next);

            expect(next.calledOnce).toBe(true);
            expect(next.calledWith(error)).toBe(true);
            expect(res.json.called).toBe(false);
        });
    });
});

