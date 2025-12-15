import { postService } from '../postService';
import { db } from '../../db/db';
import { Post } from '../../models/post';
import sinon from 'sinon';

const getAllInCollectionStub = sinon.stub(db, 'getAllInCollection');
const addToCollectionStub = sinon.stub(db, 'addToCollection');
const fromPostDocumentStub = sinon.stub(Post, 'fromPostDocument');
const getFromCollectionByIdStub = sinon.stub(db, 'getFromCollectionById');
const updateFromCollectionByIdStub = sinon.stub(db, 'updateFromCollectionById');
const deleteFromCollectionByIdStub = sinon.stub(db, 'deleteFromCollectionById');

describe('postService', () => {

    afterEach(() => {
        getAllInCollectionStub.reset();
        addToCollectionStub.reset();
        fromPostDocumentStub.reset();
        getFromCollectionByIdStub.reset();
        updateFromCollectionByIdStub.reset();
        deleteFromCollectionByIdStub.reset();
    });

    afterAll(() => {
        getAllInCollectionStub.restore();
        addToCollectionStub.restore();
        fromPostDocumentStub.restore();
        getFromCollectionByIdStub.restore();
        updateFromCollectionByIdStub.restore();
        deleteFromCollectionByIdStub.restore();
    });

    describe('getPostsById', () => {

        it('should throw an error on falsy user ID', async () => {
            await expect(postService.getPostsById())
                .rejects.toThrow('Null or undefined user ID not allowed.');
            await expect(postService.getPostsById(null))
                .rejects.toThrow('Null or undefined user ID not allowed.');
        });

        it('should return an array of posts when valid user ID is provided', async () => {
            // Mock database to return array of posts
            getAllInCollectionStub.resolves([
                {
                    _id: 'post1',
                    title: 'First Post',
                    content: 'First content',
                    authorId: 'testUserId',
                },
                {
                    _id: 'post2',
                    title: 'Second Post',
                    content: 'Second content',
                    authorId: 'testUserId',
                }
            ]);

            fromPostDocumentStub.onFirstCall().returns({
                id: 'post1',
                title: 'First Post',
                content: 'First content',
                authorId: 'testUserId',
            });
            
            fromPostDocumentStub.onSecondCall().returns({
                id: 'post2',
                title: 'Second Post',
                content: 'Second content',
                authorId: 'testUserId',
            });
            
            const result = await postService.getPostsById('testUserId');
            expect(result[0]).toMatchObject({
                id: 'post1',
                title: 'First Post',
                content: 'First content',
                authorId: 'testUserId',
            });
            
            expect(result[1]).toMatchObject({
                id: 'post2',
                title: 'Second Post',
                content: 'Second content',
                authorId: 'testUserId',
            });
        });
    });



    describe('addPost', () => {

        it('should throw an error on falsy post info', async () => {
            await expect(postService.addPost())
                .rejects.toThrow('Null or undefined post info not allowed.');
            await expect(postService.addPost(null))
                .rejects.toThrow('Null or undefined post info not allowed.');
        });

        it('should add a post when valid post info is provided', async () => {
            // Mock database to return inserted ID
            addToCollectionStub.resolves({
                insertedId: 'newPostId123'
            });
            
            const postInfo = {
                title: 'Test Post',
                content: 'Test content',
                authorId: 'testUserId',
            };
            
            const result = await postService.addPost(postInfo);
            expect(result).toMatchObject({
                id: 'newPostId123',
                title: 'Test Post',
                content: 'Test content',
                authorId: 'testUserId',
            });
            
        });
    });


    describe('updatePost', () => {
        it('should throw an error on falsy ID', async () => {
            await expect(postService.updatePost())
                .rejects.toThrow('Null or undefined ID not allowed.');
            await expect(postService.updatePost(null))
                .rejects.toThrow('Null or undefined ID not allowed.');
        });

        it('should throw an error on falsy update info', async () => {
            await expect(postService.updatePost('post1', null))
                .rejects.toThrow('Null or undefined post info not allowed.');
            await expect(postService.updatePost('post1', undefined))
                .rejects.toThrow('Null or undefined post info not allowed.');
        });

        it('should update a post when valid ID and update info are provided', async () => {
            // Mock database update
            updateFromCollectionByIdStub.resolves();
            
            // Mock getting the updated document from database
            getFromCollectionByIdStub.resolves({
                _id: 'post1',
                title: 'Updated Post',
                content: 'Updated content',
                authorId: 'testUserId',
                updatedAt: '2025-11-07T12:00:00.000Z',
            });
            
            // Mock fromPostDocument to format the returned document
            fromPostDocumentStub.returns({
                id: 'post1',
                title: 'Updated Post',
                content: 'Updated content',
                authorId: 'testUserId',
                updatedAt: '2025-11-07T12:00:00.000Z',
            });

            const result = await postService.updatePost('post1', {title: 'Updated Post', content: 'Updated content'});
            
            expect(result).toMatchObject({
                id: 'post1',
                title: 'Updated Post',
                content: 'Updated content',
                authorId: 'testUserId',
            });
        });
    });

    describe('deletePost', () => {
        it('should throw an error on falsy ID', async () => {
            await expect(postService.deletePost())
                .rejects.toThrow('Null or undefined ID not allowed.');
            await expect(postService.deletePost(null))
                .rejects.toThrow('Null or undefined ID not allowed.');
        });
        
        it('should delete a post when valid ID is provided', async () => {
            // Mock database delete
            deleteFromCollectionByIdStub.resolves({
                deletedCount: 1
            });
            await expect(postService.deletePost('post1')).resolves.toMatchObject({
                deletedCount: 1
            });
        });
    });
});
