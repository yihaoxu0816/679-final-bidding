import { authControllers } from '../authControllers';
import { authService } from '../../services/authService';
import sinon from 'sinon';

const registerUserStub = sinon.stub(authService, 'registerUser');
const validateLoginStub = sinon.stub(authService, 'validateLogin');

describe('authControllers', () => {

    let req, res;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            json: sinon.stub(),
            status: sinon.stub().returnsThis(),
            sendStatus: sinon.stub()
        };
    });

    afterEach(() => {
        registerUserStub.reset();
        validateLoginStub.reset();
        sinon.reset();
    });

    afterAll(() => {
        registerUserStub.restore();
        validateLoginStub.restore();
    });

    describe('register', () => {

        it('should register user successfully', async () => {
            req.body = {
                username: 'newuser',
                password: 'password123',
                displayName: 'New User'
            };

            registerUserStub.resolves();

            await authControllers.register(req, res);

            expect(registerUserStub.calledOnce).toBe(true);
            expect(registerUserStub.calledWith('newuser', 'password123', 'New User')).toBe(true);
            expect(res.sendStatus.calledOnce).toBe(true);
            expect(res.sendStatus.calledWith(200)).toBe(true);
        });

        it('should return 500 when registration fails', async () => {
            req.body = {
                username: 'existinguser',
                password: 'password123'
            };

            const error = new Error('User already exists');
            registerUserStub.rejects(error);

            await authControllers.register(req, res);

            expect(res.status.calledWith(500)).toBe(true);
            expect(res.json.calledOnce).toBe(true);
        });
    });

    describe('login', () => {

        it('should login successfully and return user with JWT', async () => {
            req.body = {
                username: 'testuser',
                password: 'password123'
            };

            const mockUser = {
                id: 'user123',
                username: 'testuser',
                jwt: 'mock-jwt-token'
            };
            validateLoginStub.resolves(mockUser);

            await authControllers.login(req, res);

            expect(validateLoginStub.calledOnce).toBe(true);
            expect(validateLoginStub.calledWith('testuser', 'password123')).toBe(true);
            expect(res.status.calledWith(200)).toBe(true);
            expect(res.json.calledOnce).toBe(true);
            expect(res.json.calledWith(mockUser)).toBe(true);
        });

        it('should return 401 when login fails', async () => {
            req.body = {
                username: 'testuser',
                password: 'wrongpassword'
            };

            const error = new Error('Invalid password');
            validateLoginStub.rejects(error);

            await authControllers.login(req, res);

            expect(res.status.calledWith(401)).toBe(true);
            expect(res.json.calledOnce).toBe(true);
            expect(res.json.args[0][0]).toMatchObject({
                error: 'Invalid password'
            });
        });

        it('should return 401 when user not found', async () => {
            req.body = {
                username: 'nonexistent',
                password: 'password'
            };

            const error = new Error('User not found');
            validateLoginStub.rejects(error);

            await authControllers.login(req, res);

            expect(res.status.calledWith(401)).toBe(true);
            expect(res.json.calledOnce).toBe(true);
        });
    });
});

