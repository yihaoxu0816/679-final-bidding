import { userService } from '../userService';
import { db } from '../../db/db';
import { User } from '../../models/user';
import sinon from 'sinon';

const getAllInCollectionStub = sinon.stub(db, 'getAllInCollection');
const getFromCollectionByIdStub = sinon.stub(db, 'getFromCollectionById');
const addToCollectionStub = sinon.stub(db, 'addToCollection');
const updateFromCollectionByIdStub = sinon.stub(db, 'updateFromCollectionById');
const deleteFromCollectionByIdStub = sinon.stub(db, 'deleteFromCollectionById');
const fromUserDocumentStub = sinon.stub(User, 'fromUserDocument');

describe('userService', () => {

    afterEach(() => {
        getAllInCollectionStub.reset();
        getFromCollectionByIdStub.reset();
        addToCollectionStub.reset();
        updateFromCollectionByIdStub.reset();
        deleteFromCollectionByIdStub.reset();
        fromUserDocumentStub.reset();
    });

    afterAll(() => {
        getAllInCollectionStub.restore();
        getFromCollectionByIdStub.restore();
        addToCollectionStub.restore();
        updateFromCollectionByIdStub.restore();
        deleteFromCollectionByIdStub.restore();
        fromUserDocumentStub.restore();
    });

    describe('getUserById', () => {

        it('should throw an error on falsy ID', async () => {
            await expect(userService.getUserById())
                .rejects.toThrow('Null or undefined ID not allowed.');
            await expect(userService.getUserById(null))
                .rejects.toThrow('Null or undefined ID not allowed.');
        });

        it('should return a user when valid ID is provided', async () => {
            getFromCollectionByIdStub.resolves();
            fromUserDocumentStub.returns({
                id: 'user1',
                username: 'testuser',
                displayName: 'Test User',
            });

            const result = await userService.getUserById('user1');
            expect(result).toMatchObject({
                id: 'user1',
                username: 'testuser',
                displayName: 'Test User',
            });
        });
    });

    describe('createUser', () => {

        it('should throw an error on falsy user info', async () => {
            await expect(userService.createUser())
                .rejects.toThrow('Null or undefined user info not allowed.');
            await expect(userService.createUser(null))
                .rejects.toThrow('Null or undefined user info not allowed.');
        });

        it('should create a user when valid user info is provided', async () => {
            addToCollectionStub.resolves({
                insertedId: 'newUserId123'
            });
            
            const userInfo = {
                username: 'newuser',
                password: 'password123',
                displayName: 'New User',
            };
            
            const result = await userService.createUser(userInfo);
            
            // Password should NOT be in the returned object
            expect(result).toMatchObject({
                id: 'newUserId123',
                username: 'newuser',
                displayName: 'New User',
            });
            expect(result.password).toBeUndefined();
        });
    });

    describe('updateUser', () => {
        it('should throw an error on falsy ID', async () => {
            await expect(userService.updateUser())
                .rejects.toThrow('Null or undefined ID not allowed.');
            await expect(userService.updateUser(null))
                .rejects.toThrow('Null or undefined ID not allowed.');
        });

        it('should throw an error on falsy update info', async () => {
            await expect(userService.updateUser('user1', null))
                .rejects.toThrow('Null or undefined user info not allowed.');
            await expect(userService.updateUser('user1', undefined))
                .rejects.toThrow('Null or undefined user info not allowed.');
        });

        it('should update a user when valid ID and update info are provided', async () => {
            updateFromCollectionByIdStub.resolves();
            fromUserDocumentStub.returns({
                id: 'user1',
                username: 'updateduser',
                displayName: 'Updated User',
            });

            const result = await userService.updateUser('user1', {username: 'updateduser', displayName: 'Updated User'});
            
            expect(result).toMatchObject({
                id: 'user1',
                username: 'updateduser',
                displayName: 'Updated User',
            });
        });

    });

    describe('deleteUser', () => {
        it('should throw an error on falsy ID', async () => {
            await expect(userService.deleteUser())
                .rejects.toThrow('Null or undefined ID not allowed.');
            await expect(userService.deleteUser(null))
                .rejects.toThrow('Null or undefined ID not allowed.');
        });
        
        it('should delete a user when valid ID is provided', async () => {
            deleteFromCollectionByIdStub.resolves({
                deletedCount: 1
            });
            await expect(userService.deleteUser('user1')).resolves.toMatchObject({
                deletedCount: 1
            });
        });
    });
});

