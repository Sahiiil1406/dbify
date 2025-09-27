// connection.js
const mongoose = require("mongoose");

const mongoConn = {};
const schemaCache = {};

// Connection options to handle timeouts (removed deprecated options)
const connectionOptions = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  maxPoolSize: 10,
  retryWrites: true,
};

const getConnection = async (dbUrl) => {
  try {
    // Return existing connection if available and ready
    if (mongoConn[dbUrl] && mongoConn[dbUrl].readyState === 1) {
      return mongoConn[dbUrl];
    }

    // Close any existing failed connection
    if (mongoConn[dbUrl]) {
      try {
        await mongoConn[dbUrl].close();
      } catch (err) {
        console.warn('Error closing failed connection:', err.message);
      }
    }

    console.log('Creating new MongoDB connection...');
    const conn = await mongoose.createConnection(dbUrl, connectionOptions);
    
    // Wait for connection to be fully ready
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout - database not ready'));
      }, 15000);

      if (conn.readyState === 1) {
        clearTimeout(timeout);
        mongoConn[dbUrl] = conn;
        console.log('MongoDB connection established');
        resolve(conn);
      } else {
        conn.once('connected', () => {
          clearTimeout(timeout);
          mongoConn[dbUrl] = conn;
          console.log('MongoDB connection established');
          resolve(conn);
        });

        conn.once('error', (err) => {
          clearTimeout(timeout);
          reject(new Error(`Connection failed: ${err.message}`));
        });
      }
    });
    
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw new Error(`Failed to connect to MongoDB: ${error.message}`);
  }
};

const extractDatabaseSchema = async (dbUrl) => {
  try {
    if (schemaCache[dbUrl]) {
      console.log("Using cached schema");
      return schemaCache[dbUrl];
    }

    const conn = await getConnection(dbUrl);
    const schema = {};
    
    // Wait a bit more to ensure connection is fully ready
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Use mongoose connection to get collections
    let collectionNames = [];
    
    try {
      // Try to get collections using the native MongoDB driver through mongoose
      const db = conn.db;
      if (db && typeof db.listCollections === 'function') {
        const collections = await db.listCollections().toArray();
        collectionNames = collections.map(col => col.name);
        console.log(`Found ${collectionNames.length} collections via listCollections`);
      } else {
        throw new Error('listCollections not available');
      }
    } catch (error) {
      console.warn('Could not list collections dynamically, trying to discover existing collections...');
      
      // Try to discover collections by attempting to access them
      const potentialCollections = ['users', 'products', 'orders', 'comments', 'movies', 'posts', 'categories'];
      
      for (const collName of potentialCollections) {
        try {
          const tempSchema = new conn.base.Schema({}, { strict: false });
          const TempModel = conn.model(`discover_${collName}`, tempSchema, collName);
          
          // Try to get collection stats to see if it exists
          const stats = await conn.db.collection(collName).stats();
          if (stats) {
            collectionNames.push(collName);
          }
          
          // Clean up
          delete conn.models[`discover_${collName}`];
        } catch (err) {
          // Collection doesn't exist, skip it
        }
      }
      
      console.log(`Discovered ${collectionNames.length} collections:`, collectionNames);
    }
    
    // Now extract schema from discovered collections
    for (const collectionName of collectionNames) {
      try {
        const tempSchema = new conn.base.Schema({}, { strict: false });
        const modelName = `temp_${collectionName}_${Date.now()}`;
        const TempModel = conn.model(modelName, tempSchema, collectionName);
        
        // Get sample document and count
        const [sampleDoc, docCount] = await Promise.all([
          TempModel.findOne().lean().exec(),
          TempModel.countDocuments().exec()
        ]);
        
        schema[collectionName] = {
          fields: sampleDoc ? Object.keys(sampleDoc) : [],
          documentCount: docCount
        };
        
        //console.log(`✓ Analyzed collection '${collectionName}': ${schema[collectionName].fields.length} fields, ${docCount} documents`);
        
        // Clean up temporary model
        delete conn.models[modelName];
        
      } catch (error) {
        console.warn(`✗ Failed to analyze collection '${collectionName}':`, error.message);
      }
    }

    const result = {
      schema,
      collections: Object.keys(schema),
      collectionCount: Object.keys(schema).length
    };

    schemaCache[dbUrl] = result;
    console.log(`Successfully extracted schema for ${result.collectionCount} collections`);
    return result;
    
  } catch (error) {
    console.error('Error extracting database schema:', error.message);
    throw new Error(`Schema extraction failed: ${error.message}`);
  }
};

const docsgenerator = async (dbUrl) => {
    try {
        
    } catch (error) {
        return 
    }
}

module.exports = { getConnection, extractDatabaseSchema };