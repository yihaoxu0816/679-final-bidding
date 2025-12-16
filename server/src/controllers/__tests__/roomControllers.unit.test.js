import { roomControllers } from '../roomControllers';
import { roomService } from '../../services/roomService';
import sinon from 'sinon';

const getAllRoomsStub = sinon.stub(roomService, 'getAllRooms');
const createRoomStub = sinon.stub(roomService, 'createRoom');
const closeRoomStub = sinon.stub(roomService, 'closeRoom');
const deleteRoomStub = sinon.stub(roomService, 'deleteRoom');

describe('roomControllers', () => {

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
        getAllRoomsStub.reset();
        createRoomStub.reset();
        closeRoomStub.reset();
        deleteRoomStub.reset();
        sinon.reset();
    });

    afterAll(() => {
        getAllRoomsStub.restore();
        createRoomStub.restore();
        closeRoomStub.restore();
        deleteRoomStub.restore();
    });

    describe('getAllRooms', () => {

        it('should return all rooms', async () => {
            const mockRooms = [
                { id: 'room1', itemName: 'Item 1' },
                { id: 'room2', itemName: 'Item 2' }
            ];
            getAllRoomsStub.resolves(mockRooms);

            await roomControllers.getAllRooms(req, res, next);

            expect(getAllRoomsStub.calledOnce).toBe(true);
            expect(res.json.calledOnce).toBe(true);
            expect(res.json.calledWith(mockRooms)).toBe(true);
            expect(next.called).toBe(false);
        });

        it('should call next with error when service throws', async () => {
            const error = new Error('Database error');
            getAllRoomsStub.rejects(error);

            await roomControllers.getAllRooms(req, res, next);

            expect(next.calledOnce).toBe(true);
            expect(next.calledWith(error)).toBe(true);
        });
    });

    describe('createRoom', () => {

        it('should create room with authenticated user as host', async () => {
            req.userId = 'host123';
            req.body = {
                itemName: 'Test Item',
                itemDescription: 'Description',
                startingPrice: 100
            };

            const mockRoom = {
                id: 'room123',
                hostId: 'host123',
                itemName: 'Test Item',
                startingPrice: 100
            };
            createRoomStub.resolves(mockRoom);

            await roomControllers.createRoom(req, res, next);

            expect(createRoomStub.calledOnce).toBe(true);
            expect(createRoomStub.calledWith({
                itemName: 'Test Item',
                itemDescription: 'Description',
                startingPrice: 100,
                hostId: 'host123'
            })).toBe(true);
            expect(res.json.calledOnce).toBe(true);
            expect(res.json.calledWith(mockRoom)).toBe(true);
            expect(next.called).toBe(false);
        });

        it('should call next with error when service throws', async () => {
            req.userId = 'host123';
            req.body = { itemName: 'Test' };

            const error = new Error('Valid starting price is required');
            createRoomStub.rejects(error);

            await roomControllers.createRoom(req, res, next);

            expect(next.calledOnce).toBe(true);
            expect(next.calledWith(error)).toBe(true);
        });
    });

    describe('closeRoom', () => {

        it('should close room successfully', async () => {
            req.params.id = 'room123';
            req.userId = 'host123';

            const mockClosedRoom = {
                id: 'room123',
                status: 'closed'
            };
            closeRoomStub.resolves(mockClosedRoom);

            await roomControllers.closeRoom(req, res, next);

            expect(closeRoomStub.calledOnce).toBe(true);
            expect(closeRoomStub.calledWith('room123', 'host123')).toBe(true);
            expect(res.json.calledOnce).toBe(true);
            expect(res.json.calledWith(mockClosedRoom)).toBe(true);
            expect(next.called).toBe(false);
        });

        it('should call next with error when user is not host', async () => {
            req.params.id = 'room123';
            req.userId = 'wrongUser';

            const error = new Error('Only the host can close the room');
            closeRoomStub.rejects(error);

            await roomControllers.closeRoom(req, res, next);

            expect(next.calledOnce).toBe(true);
            expect(next.calledWith(error)).toBe(true);
        });
    });

    describe('deleteRoom', () => {

        it('should delete room successfully', async () => {
            req.params.id = 'room123';

            deleteRoomStub.resolves({ deletedCount: 1 });

            await roomControllers.deleteRoom(req, res, next);

            expect(deleteRoomStub.calledOnce).toBe(true);
            expect(deleteRoomStub.calledWith('room123')).toBe(true);
            expect(res.json.calledOnce).toBe(true);
            expect(next.called).toBe(false);
        });

        it('should call next with error when service throws', async () => {
            req.params.id = 'room123';

            const error = new Error('Room not found');
            deleteRoomStub.rejects(error);

            await roomControllers.deleteRoom(req, res, next);

            expect(next.calledOnce).toBe(true);
            expect(next.calledWith(error)).toBe(true);
        });
    });
});

