import { authService } from '../authService';
import { db } from '../../db/db';
import { User } from '../../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sinon from 'sinon';

const getFromCollectionByFieldValueStub = sinon.stub(db, 'getFromCollectionByFieldValue');
const addToCollectionStub = sinon.stub(db, 'addToCollection');
const fromUserDocumentStub = sinon.stub(User, 'fromUserDocument');
const bcryptHashStub = sinon.stub(bcrypt, 'hash');
const bcryptCompareStub = sinon.stub(bcrypt, 'compare');
const jwtSignStub = sinon.stub(jwt, 'sign');

describe('authService', () => {

    afterEach(() => {
        getFromCollectionByFieldValueStub.reset();
        addToCollectionStub.reset();
        fromUserDocumentStub.reset();
        bcryptHashStub.reset();
        bcryptCompareStub.reset();
        jwtSignStub.reset();
    });

    afterAll(() => {
        getFromCollectionByFieldValueStub.restore();
        addToCollectionStub.restore();
        fromUserDocumentStub.restore();
        bcryptHashStub.restore();
        bcryptCompareStub.restore();
        jwtSignStub.restore();
    });

    describe('registerUser', () => {

        it('should throw an error when username already exists', async () => {
            getFromCollectionByFieldValueStub.resolves({
                _id: 'existingUserId',
                username: 'existinguser',
            });

            await expect(authService.registerUser('existinguser', 'password123'))
                .rejects.toThrow('User already exists');
        });

        it('should throw an error when registration fails', async () => {
            getFromCollectionByFieldValueStub.resolves(null);
            bcryptHashStub.resolves('hashedPassword');
            addToCollectionStub.resolves({
                acknowledged: false
            });

            await expect(authService.registerUser('newuser', 'password123'))
                .rejects.toThrow('Failed to register user');
        });

        it('should register a new user successfully', async () => {
            getFromCollectionByFieldValueStub.resolves(null);
            bcryptHashStub.resolves('hashedPassword');
            addToCollectionStub.resolves({
                acknowledged: true,
                insertedId: 'newUserId123'
            });

            await expect(authService.registerUser('newuser', 'password123'))
                .resolves.toBeUndefined();
        });
    });

    describe('validateLogin', () => {

        it('should throw an error when user not found', async () => {
            getFromCollectionByFieldValueStub.resolves(null);

            await expect(authService.validateLogin('nonexistent', 'password'))
                .rejects.toThrow('User not found');
        });

        it('should throw an error when password is invalid', async () => {
            getFromCollectionByFieldValueStub.resolves({
                _id: 'user1',
                username: 'testuser',
                password: 'hashedPassword',
            });

            fromUserDocumentStub.returns({
                id: 'user1',
                username: 'testuser',
                password: 'hashedPassword',
            });

            bcryptCompareStub.resolves(false);

            await expect(authService.validateLogin('testuser', 'wrongpassword'))
                .rejects.toThrow('Invalid password');
        });

        it('should return user with JWT when login is successful', async () => {
            getFromCollectionByFieldValueStub.resolves({
                _id: 'user1',
                username: 'testuser',
                password: 'hashedPassword',
                balance: 100,
            });

            fromUserDocumentStub.returns({
                id: 'user1',
                username: 'testuser',
                password: 'hashedPassword',
                balance: 100,
            });

            bcryptCompareStub.resolves(true);
            jwtSignStub.returns('mock-jwt-token');

            const result = await authService.validateLogin('testuser', 'correctpassword');

            expect(result).toHaveProperty('jwt');
            expect(result.jwt).toBe('mock-jwt-token');
            expect(result.username).toBe('testuser');
            expect(result.password).toBeUndefined();
        });
    });
});

