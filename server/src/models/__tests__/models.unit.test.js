import { Room } from '../room';
import { User } from '../user';

describe('Models', () => {

    describe('Room', () => {

        it('should create room from document', () => {
            const roomDoc = {
                _id: '456',
                itemName: 'Test Item',
                itemDescription: 'Description',
                startingPrice: 100,
                hostId: 'host123',
                status: 'open',
                createdAt: '2025-01-01T00:00:00.000Z'
            };

            const room = Room.fromRoomDocument(roomDoc);

            expect(room.id).toBe('456');
            expect(room.itemName).toBe('Test Item');
        });
    });

    describe('User', () => {

        it('should create user from document', () => {
            const userDoc = {
                _id: '123',
                username: 'testuser',
                password: 'hashedpw',
                balance: 150
            };

            const user = User.fromUserDocument(userDoc);

            expect(user.id).toBe('123');
            expect(user.username).toBe('testuser');
        });
    });
});

