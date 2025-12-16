import { MongoClient, ObjectId } from "mongodb";

const mongoURI = 'mongodb://127.0.0.1:27017';
const dbName = 'bidding-platform';

// Collection names for the bidding platform
const ROOMS = 'rooms';      // Stores bidding rooms created by users
const USERS = 'users';      // Stores user accounts with balance
const BIDS = 'bids';        // Stores bidding history for each room

let mongoClient = null;
let theDb = null;

const init = async () => {
    // new
    // const mongoURI = process.env.MONGO_URI;
    // const dbName = process.env.DB_NAME;
    // end new
    mongoClient = new MongoClient(mongoURI);
    await mongoClient.connect();
    theDb = mongoClient.db(dbName);
}

const watchCollection = async (collectionName, callback = () => {}) => {
  // Ensure database is initialized
  if (!mongoClient || !theDb) { 
    await init(); 
  }
  
  const changeStream = theDb.collection(collectionName).watch();

  changeStream.on('change', (change) => {
    console.log(change);
    callback(change);
  });
  console.log('watching collection', collectionName);
  return changeStream;
}

const closeChangeStream = async (changeStream) => {
  changeStream.close();
}

const getAllInCollection = async (collectionName) => {
    if (!mongoClient) { await init(); }
    const allDocs = await theDb.collection(collectionName).find();
    return allDocs.toArray();
  }
  
  const getFromCollectionById = async (collectionName, id) => {
    if (!mongoClient) { await init(); }
    const doc = await theDb.collection(collectionName).findOne({_id: new ObjectId(String(id))});
    return doc;
  }
  
  const deleteFromCollectionById = async (collectionName, id) => {
    if (!mongoClient) { await init(); }
    const result = await theDb.collection(collectionName).deleteOne({_id: new ObjectId(String(id))});
    return result;
  }
  
  const addToCollection = async (collectionName, docData) => {
    if (!mongoClient) { await init(); }
    const result = await theDb.collection(collectionName).insertOne(docData);
    return result;
  }

  const updateFromCollectionById = async (collectionName, id, docData) => {
    if (!mongoClient) { await init(); }
    const query = { _id: new ObjectId(String(id))};
    const update = { $set: {...docData}};
    const result = await theDb.collection(collectionName).updateOne(query, update);
    return result;
  }

  const getFromCollectionByFieldValue = async (collectionName, field, value) => {
    if (!mongoClient) { await init(); }
    const doc = await theDb
    .collection(collectionName)
    .findOne({[field]: value});
    return doc;
  }

  // Get multiple documents by field value (e.g., all bids for a room)
  const getManyFromCollectionByFieldValue = async (collectionName, field, value) => {
    if (!mongoClient) { await init(); }
    const docs = await theDb
      .collection(collectionName)
      .find({[field]: value})
      .toArray();
    return docs;
  }

  // Get multiple documents with sorting (useful for bid history)
  const getManyFromCollectionWithSort = async (collectionName, query, sortField, sortOrder = -1) => {
    if (!mongoClient) { await init(); }
    const docs = await theDb
      .collection(collectionName)
      .find(query)
      .sort({[sortField]: sortOrder})
      .toArray();
    return docs;
  }
  
  export const db = {
    init, 
    // close,
    watchCollection, 
    closeChangeStream,
    getAllInCollection, 
    getFromCollectionById,
    addToCollection,
    deleteFromCollectionById,
    updateFromCollectionById,
    getFromCollectionByFieldValue,
    getManyFromCollectionByFieldValue,
    getManyFromCollectionWithSort,
    ROOMS,
    USERS,
    BIDS
  }