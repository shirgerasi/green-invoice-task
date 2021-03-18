'use strict';

const mongoClient = require('mongodb').MongoClient;

const connectionString = 'mongodb://127.0.0.1:27017';
const dbName = 'company';

const createDb = async () => {
  try {
    const client = await mongoClient.connect(connectionString, { useNewUrlParser: true });
    const db = client.db(dbName);
    
    console.log(`Connected MongoDB: ${connectionString}`);
    
    return db;
  } 
  catch (err) {
    console.error(err);
  } 
}

const db = (async () => {
  return await createDb();
})();

exports.db = db;
