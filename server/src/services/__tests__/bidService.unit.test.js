import { bidService } from '../bidService';
import { db } from '../../db/db';
import { Bid } from '../../models/bid';
import { Room } from '../../models/room';
import { User } from '../../models/user';
import sinon from 'sinon';

const getFromCollectionByIdStub = sinon.stub(db, 'getFromCollectionById');
const getManyFromCollectionWithSortStub = sinon.stub(db, 'getManyFromCollectionWithSort');
const addToCollectionStub = sinon.stub(db, 'addToCollection');
const updateFromCollectionByIdStub = sinon.stub(db, 'updateFromCollectionById');
const fromBidDocumentStub = sinon.stub(Bid, 'fromBidDocument');
const fromRoomDocumentStub = sinon.stub(Room, 'fromRoomDocument');
const fromUserDocumentStub = sinon.stub(User, 'fromUserDocument');

describe('bidService', () => {

    afterEach(() => {
        getFromCollectionByIdStub.reset();
        getManyFromCollectionWithSortStub.reset();
        addToCollectionStub.reset();
        updateFromCollectionByIdStub.reset();
        fromBidDocumentStub.reset();
        fromRoomDocumentStub.reset();
        fromUserDocumentStub.reset();
    });

    afterAll(() => {
        getFromCollectionByIdStub.restore();
        getManyFromCollectionWithSortStub.restore();
        addToCollectionStub.restore();
        updateFromCollectionByIdStub.restore();
        fromBidDocumentStub.restore();
        fromRoomDocumentStub.restore();
        fromUserDocumentStub.restore();
    });

    describe('getBidsByRoomId', () => {

        it('should throw an error on falsy room ID', async () => {
            await expect(bidService.getBidsByRoomId())
                .rejects.toThrow('Null or undefined room ID not allowed.');
            await expect(bidService.getBidsByRoomId(null))
                .rejects.toThrow('Null or undefined room ID not allowed.');
        });

        it('should return an array of bids for valid room ID', async () => {
            getManyFromCollectionWithSortStub.resolves([
                { _id: 'bid1', roomId: 'room1', userId: 'user1', amount: 100 },
                { _id: 'bid2', roomId: 'room1', userId: 'user2', amount: 150 },
            ]);

            fromBidDocumentStub.onFirstCall().returns({
                id: 'bid1',
                roomId: 'room1',
                userId: 'user1',
                amount: 100,
            });

            fromBidDocumentStub.onSecondCall().returns({
                id: 'bid2',
                roomId: 'room1',
                userId: 'user2',
                amount: 150,
            });

            const result = await bidService.getBidsByRoomId('room1');
            expect(result).toHaveLength(2);
            expect(result[0]).toMatchObject({
                id: 'bid1',
                amount: 100,
            });
        });
    });

    describe('getBidsByUserId', () => {

        it('should throw an error on falsy user ID', async () => {
            await expect(bidService.getBidsByUserId())
                .rejects.toThrow('Null or undefined user ID not allowed.');
            await expect(bidService.getBidsByUserId(null))
                .rejects.toThrow('Null or undefined user ID not allowed.');
        });

        it('should return an array of bids for valid user ID', async () => {
            getManyFromCollectionWithSortStub.resolves([
                { _id: 'bid1', roomId: 'room1', userId: 'user1', amount: 100 },
            ]);

            fromBidDocumentStub.returns({
                id: 'bid1',
                roomId: 'room1',
                userId: 'user1',
                amount: 100,
            });

            const result = await bidService.getBidsByUserId('user1');
            expect(result).toHaveLength(1);
        });
    });

    describe('placeBid', () => {

        it('should throw an error on falsy bid info', async () => {
            await expect(bidService.placeBid())
                .rejects.toThrow('Null or undefined bid info not allowed.');
            await expect(bidService.placeBid(null))
                .rejects.toThrow('Null or undefined bid info not allowed.');
        });

        it('should throw an error when roomId is missing', async () => {
            await expect(bidService.placeBid({ userId: 'user1', amount: 100 }))
                .rejects.toThrow('Room ID is required.');
        });

        it('should throw an error when userId is missing', async () => {
            await expect(bidService.placeBid({ roomId: 'room1', amount: 100 }))
                .rejects.toThrow('User ID is required.');
        });

        it('should throw an error when bid amount is invalid', async () => {
            await expect(bidService.placeBid({ 
                roomId: 'room1', 
                userId: 'user1' 
            })).rejects.toThrow('Valid bid amount is required.');
        });

        it('should throw an error when room does not exist', async () => {
            getFromCollectionByIdStub.resolves(null);
            await expect(bidService.placeBid({
                roomId: 'nonexistent',
                userId: 'user1',
                amount: 100,
            })).rejects.toThrow('Room not found.');
        });

        it('should throw an error when room is closed', async () => {
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

            await expect(bidService.placeBid({
                roomId: 'room1',
                userId: 'user1',
                amount: 100,
            })).rejects.toThrow('Cannot bid on a closed room.');
        });

        it('should throw an error when user is the host', async () => {
            getFromCollectionByIdStub.resolves({
                _id: 'room1',
                hostId: 'host1',
                status: 'open',
                currentHighestBid: 50,
            });
            fromRoomDocumentStub.returns({
                id: 'room1',
                hostId: 'host1',
                status: 'open',
                currentHighestBid: 50,
            });

            await expect(bidService.placeBid({
                roomId: 'room1',
                userId: 'host1',  // Same as host
                amount: 100,
            })).rejects.toThrow("You can't make a bid in your own room");
        });

        it('should throw an error when bid is not higher than current highest', async () => {
            getFromCollectionByIdStub.resolves({
                _id: 'room1',
                hostId: 'host1',
                status: 'open',
                currentHighestBid: 100,
            });
            fromRoomDocumentStub.returns({
                id: 'room1',
                hostId: 'host1',
                status: 'open',
                currentHighestBid: 100,
            });

            await expect(bidService.placeBid({
                roomId: 'room1',
                userId: 'user1',
                amount: 100,  // Equal to current highest
            })).rejects.toThrow('Bid must be higher than current highest bid');
        });

        it('should throw an error when user does not exist', async () => {
            getFromCollectionByIdStub.onFirstCall().resolves({
                _id: 'room1',
                hostId: 'host1',
                status: 'open',
                currentHighestBid: 50,
            });
            getFromCollectionByIdStub.onSecondCall().resolves(null);

            fromRoomDocumentStub.returns({
                id: 'room1',
                hostId: 'host1',
                status: 'open',
                currentHighestBid: 50,
            });

            await expect(bidService.placeBid({
                roomId: 'room1',
                userId: 'nonexistent',
                amount: 100,
            })).rejects.toThrow('User not found.');
        });

        it('should throw an error when user has insufficient balance', async () => {
            getFromCollectionByIdStub.onFirstCall().resolves({
                _id: 'room1',
                hostId: 'host1',
                status: 'open',
                currentHighestBid: 50,
            });
            getFromCollectionByIdStub.onSecondCall().resolves({
                _id: 'user1',
                username: 'testuser',
                balance: 75,
            });

            fromRoomDocumentStub.returns({
                id: 'room1',
                hostId: 'host1',
                status: 'open',
                currentHighestBid: 50,
            });

            fromUserDocumentStub.returns({
                id: 'user1',
                username: 'testuser',
                balance: 75,
            });

            await expect(bidService.placeBid({
                roomId: 'room1',
                userId: 'user1',
                amount: 100,
            })).rejects.toThrow('Insufficient balance to place this bid.');
        });

        it('should place a bid when all validations pass', async () => {
            getFromCollectionByIdStub.onFirstCall().resolves({
                _id: 'room1',
                hostId: 'host1',
                status: 'open',
                currentHighestBid: 50,
            });
            getFromCollectionByIdStub.onSecondCall().resolves({
                _id: 'user1',
                username: 'testuser',
                balance: 200,
            });

            fromRoomDocumentStub.returns({
                id: 'room1',
                hostId: 'host1',
                status: 'open',
                currentHighestBid: 50,
            });

            fromUserDocumentStub.returns({
                id: 'user1',
                username: 'testuser',
                balance: 200,
            });

            addToCollectionStub.resolves({
                insertedId: 'newBidId123'
            });

            updateFromCollectionByIdStub.resolves();

            const result = await bidService.placeBid({
                roomId: 'room1',
                userId: 'user1',
                amount: 100,
            });

            expect(result).toMatchObject({
                id: 'newBidId123',
                roomId: 'room1',
                userId: 'user1',
                amount: 100,
            });
        });
    });
});

