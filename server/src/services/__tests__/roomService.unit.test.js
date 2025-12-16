import { roomService } from '../roomService';
import { db } from '../../db/db';
import { Room } from '../../models/room';
import sinon from 'sinon';

const getAllInCollectionStub = sinon.stub(db, 'getAllInCollection');
const getFromCollectionByIdStub = sinon.stub(db, 'getFromCollectionById');
const getManyFromCollectionByFieldValueStub = sinon.stub(db, 'getManyFromCollectionByFieldValue');
const addToCollectionStub = sinon.stub(db, 'addToCollection');
const updateFromCollectionByIdStub = sinon.stub(db, 'updateFromCollectionById');
const deleteFromCollectionByIdStub = sinon.stub(db, 'deleteFromCollectionById');
const fromRoomDocumentStub = sinon.stub(Room, 'fromRoomDocument');

describe('roomService', () => {

    afterEach(() => {
        getAllInCollectionStub.reset();
        getFromCollectionByIdStub.reset();
        getManyFromCollectionByFieldValueStub.reset();
        addToCollectionStub.reset();
        updateFromCollectionByIdStub.reset();
        deleteFromCollectionByIdStub.reset();
        fromRoomDocumentStub.reset();
    });

    afterAll(() => {
        getAllInCollectionStub.restore();
        getFromCollectionByIdStub.restore();
        getManyFromCollectionByFieldValueStub.restore();
        addToCollectionStub.restore();
        updateFromCollectionByIdStub.restore();
        deleteFromCollectionByIdStub.restore();
        fromRoomDocumentStub.restore();
    });

    describe('getRoomById', () => {

        it('should throw an error on falsy ID', async () => {
            await expect(roomService.getRoomById())
                .rejects.toThrow('Null or undefined ID not allowed.');
            await expect(roomService.getRoomById(null))
                .rejects.toThrow('Null or undefined ID not allowed.');
        });

        it('should throw an error when room not found', async () => {
            getFromCollectionByIdStub.resolves(null);
            await expect(roomService.getRoomById('nonexistent'))
                .rejects.toThrow('Room not found.');
        });

        it('should return a room when valid ID is provided', async () => {
            getFromCollectionByIdStub.resolves({
                _id: 'room1',
                itemName: 'Test Item',
                hostId: 'host1',
            });
            fromRoomDocumentStub.returns({
                id: 'room1',
                itemName: 'Test Item',
                hostId: 'host1',
            });

            const result = await roomService.getRoomById('room1');
            expect(result).toMatchObject({
                id: 'room1',
                itemName: 'Test Item',
                hostId: 'host1',
            });
        });
    });

    describe('getRoomsByHostId', () => {

        it('should throw an error on falsy host ID', async () => {
            await expect(roomService.getRoomsByHostId())
                .rejects.toThrow('Null or undefined host ID not allowed.');
            await expect(roomService.getRoomsByHostId(null))
                .rejects.toThrow('Null or undefined host ID not allowed.');
        });

        it('should return an array of rooms for valid host ID', async () => {
            getManyFromCollectionByFieldValueStub.resolves([
                { _id: 'room1', itemName: 'Item 1', hostId: 'host1' },
                { _id: 'room2', itemName: 'Item 2', hostId: 'host1' },
            ]);

            fromRoomDocumentStub.onFirstCall().returns({
                id: 'room1',
                itemName: 'Item 1',
                hostId: 'host1',
            });

            fromRoomDocumentStub.onSecondCall().returns({
                id: 'room2',
                itemName: 'Item 2',
                hostId: 'host1',
            });

            const result = await roomService.getRoomsByHostId('host1');
            expect(result).toHaveLength(2);
            expect(result[0]).toMatchObject({
                id: 'room1',
                itemName: 'Item 1',
            });
        });
    });

    describe('createRoom', () => {

        it('should throw an error on falsy room info', async () => {
            await expect(roomService.createRoom())
                .rejects.toThrow('Null or undefined room info not allowed.');
            await expect(roomService.createRoom(null))
                .rejects.toThrow('Null or undefined room info not allowed.');
        });

        it('should throw an error when hostId is missing', async () => {
            await expect(roomService.createRoom({ itemName: 'Test' }))
                .rejects.toThrow('Host ID is required.');
        });

        it('should throw an error when itemName is missing', async () => {
            await expect(roomService.createRoom({ hostId: 'host1' }))
                .rejects.toThrow('Item name is required.');
        });

        it('should throw an error when starting price is invalid', async () => {
            await expect(roomService.createRoom({ 
                hostId: 'host1', 
                itemName: 'Test Item' 
            })).rejects.toThrow('Valid starting price is required.');
        });

        it('should throw an error when host does not exist', async () => {
            getFromCollectionByIdStub.resolves(null);
            await expect(roomService.createRoom({
                hostId: 'nonexistent',
                itemName: 'Test Item',
                startingPrice: 100,
            })).rejects.toThrow('Host user not found.');
        });

        it('should create a room when valid info is provided', async () => {
            getFromCollectionByIdStub.resolves({ _id: 'host1' });
            addToCollectionStub.resolves({
                insertedId: 'newRoomId123'
            });

            const roomInfo = {
                hostId: 'host1',
                itemName: 'Test Item',
                itemDescription: 'Description',
                startingPrice: 100,
            };

            const result = await roomService.createRoom(roomInfo);

            expect(result).toMatchObject({
                id: 'newRoomId123',
                itemName: 'Test Item',
                hostId: 'host1',
                currentHighestBid: 100,
                status: 'open',
            });
        });
    });

    describe('updateRoom', () => {

        it('should throw an error on falsy ID', async () => {
            await expect(roomService.updateRoom())
                .rejects.toThrow('Null or undefined ID not allowed.');
            await expect(roomService.updateRoom(null))
                .rejects.toThrow('Null or undefined ID not allowed.');
        });

        it('should throw an error on falsy update info', async () => {
            await expect(roomService.updateRoom('room1', null))
                .rejects.toThrow('Null or undefined room info not allowed.');
        });

        it('should update a room when valid ID and info are provided', async () => {
            updateFromCollectionByIdStub.resolves();
            getFromCollectionByIdStub.resolves({
                _id: 'room1',
                itemName: 'Updated Item',
                hostId: 'host1',
            });
            fromRoomDocumentStub.returns({
                id: 'room1',
                itemName: 'Updated Item',
                hostId: 'host1',
            });

            const result = await roomService.updateRoom('room1', {
                itemName: 'Updated Item'
            });

            expect(result).toMatchObject({
                id: 'room1',
                itemName: 'Updated Item',
            });
        });
    });

    describe('deleteRoom', () => {

        it('should throw an error on falsy ID', async () => {
            await expect(roomService.deleteRoom())
                .rejects.toThrow('Null or undefined ID not allowed.');
            await expect(roomService.deleteRoom(null))
                .rejects.toThrow('Null or undefined ID not allowed.');
        });

        it('should delete a room when valid ID is provided', async () => {
            deleteFromCollectionByIdStub.resolves({
                deletedCount: 1
            });

            const result = await roomService.deleteRoom('room1');
            expect(result).toMatchObject({
                deletedCount: 1
            });
        });
    });

    describe('closeRoom', () => {

        it('should throw an error on falsy room ID', async () => {
            await expect(roomService.closeRoom())
                .rejects.toThrow('Null or undefined room ID not allowed.');
        });

        it('should throw an error on falsy host ID', async () => {
            await expect(roomService.closeRoom('room1', null))
                .rejects.toThrow('Null or undefined host ID not allowed.');
        });

        it('should throw an error when user is not the host', async () => {
            getFromCollectionByIdStub.resolves({
                _id: 'room1',
                hostId: 'host1',
                status: 'open',
            });
            fromRoomDocumentStub.returns({
                id: 'room1',
                hostId: 'host1',
                status: 'open',
            });

            await expect(roomService.closeRoom('room1', 'wrongHost'))
                .rejects.toThrow('Only the host can close the room.');
        });

        it('should throw an error when room is already closed', async () => {
            getFromCollectionByIdStub.resolves({
                _id: 'room1',
                hostId: 'host1',
                status: 'closed',
            });
            fromRoomDocumentStub.returns({
                id: 'room1',
                hostId: 'host1',
                status: 'closed',
            });

            await expect(roomService.closeRoom('room1', 'host1'))
                .rejects.toThrow('Room is already closed.');
        });
    });
});

