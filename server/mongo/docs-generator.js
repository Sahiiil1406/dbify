const { extractDatabaseSchema } = require('./connection'); // Assuming connection.js is in same directory

const generateMongoDocumentation = async (mongoUrl) => {
  try {
    // Extract schema from MongoDB
    const schemaData = await extractDatabaseSchema(mongoUrl);
    const { schema, collections } = schemaData;

    let docs = {
      overview: "Dbify auto-generates CRUD APIs for your MongoDB database. " +
        "Each collection gets endpoints for create, read, update, and delete operations.",
      collectionCount: collections.length,
      collections: []
    };

    for (const collectionName of collections) {
      const collection = schema[collectionName];
      const { fields = [], documentCount = 0 } = collection;

      // Generate example payload based on field names and common patterns
      const examplePayload = generateExampleDocument(fields);

      docs.collections.push({
        collection: collectionName,
        documentCount,
        fields,
        endpoints: {
          create: {
            description: `Insert a new document into ${collectionName}`,
            payload: {
              projectId: 1,
              apiKey: "your_api_key",
              operation: "create",
              collectionName,
              payload: { data: examplePayload }
            }
          },
          read: {
            description: `Fetch documents from ${collectionName}`,
            payload: {
              projectId: 1,
              apiKey: "your_api_key",
              operation: "read",
              collectionName,
              payload: { 
                conditions: { _id: "507f1f77bcf86cd799439011" },
                options: { limit: 10, skip: 0, sort: { _id: -1 } }
              }
            }
          },
          update: {
            description: `Update documents in ${collectionName}`,
            payload: {
              projectId: 1,
              apiKey: "your_api_key",
              operation: "update",
              collectionName,
              payload: {
                conditions: { _id: "507f1f77bcf86cd799439011" },
                data: { ...examplePayload }
              }
            }
          },
          delete: {
            description: `Delete documents from ${collectionName}`,
            payload: {
              projectId: 1,
              apiKey: "your_api_key",
              operation: "delete",
              collectionName,
              payload: { 
                conditions: { _id: "507f1f77bcf86cd799439011" }
              }
            }
          },
          // Additional MongoDB-specific operations
          aggregate: {
            description: `Run aggregation pipeline on ${collectionName}`,
            payload: {
              projectId: 1,
              apiKey: "your_api_key",
              operation: "aggregate",
              collectionName,
              payload: {
                pipeline: [
                  { $match: {} },
                  { $group: { _id: null, count: { $sum: 1 } } }
                ]
              }
            }
          },
          count: {
            description: `Count documents in ${collectionName}`,
            payload: {
              projectId: 1,
              apiKey: "your_api_key",
              operation: "count",
              collectionName,
              payload: { 
                conditions: {}
              }
            }
          }
        }
      });
    }

    console.log("Generated MongoDB Docs:", JSON.stringify(docs, null, 2));
    return docs;

  } catch (error) {
    console.error('Error generating MongoDB documentation:', error.message);
    throw new Error(`Documentation generation failed: ${error.message}`);
  }
};

// Helper function to generate example document based on field names
const generateExampleDocument = (fields) => {
  const exampleDoc = {};
  
  fields.forEach(fieldName => {
    const lowerField = fieldName.toLowerCase();
    
    // Skip MongoDB internal fields
    if (fieldName === '_id' || fieldName === '__v') {
      return;
    }
    
    // Generate values based on field name patterns
    if (lowerField.includes('email')) {
      exampleDoc[fieldName] = "user@example.com";
    } else if (lowerField.includes('name')) {
      exampleDoc[fieldName] = "John Doe";
    } else if (lowerField.includes('age')) {
      exampleDoc[fieldName] = 25;
    } else if (lowerField.includes('price') || lowerField.includes('amount') || lowerField.includes('cost')) {
      exampleDoc[fieldName] = 99.99;
    } else if (lowerField.includes('date') || lowerField.includes('time')) {
      exampleDoc[fieldName] = new Date().toISOString();
    } else if (lowerField.includes('id') && fieldName !== '_id') {
      exampleDoc[fieldName] = "507f1f77bcf86cd799439011";
    } else if (lowerField.includes('url') || lowerField.includes('link')) {
      exampleDoc[fieldName] = "https://example.com";
    } else if (lowerField.includes('phone')) {
      exampleDoc[fieldName] = "+1234567890";
    } else if (lowerField.includes('status')) {
      exampleDoc[fieldName] = "active";
    } else if (lowerField.includes('count') || lowerField.includes('number') || lowerField.includes('qty')) {
      exampleDoc[fieldName] = 1;
    } else if (lowerField.includes('bool') || lowerField.includes('enabled') || lowerField.includes('active')) {
      exampleDoc[fieldName] = true;
    } else if (lowerField.includes('array') || lowerField.includes('list') || lowerField.includes('tags')) {
      exampleDoc[fieldName] = ["tag1", "tag2"];
    } else if (lowerField.includes('address')) {
      exampleDoc[fieldName] = "123 Main St, City, Country";
    } else if (lowerField.includes('description') || lowerField.includes('content') || lowerField.includes('text')) {
      exampleDoc[fieldName] = "Sample description text";
    } else {
      // Default value based on common patterns
      exampleDoc[fieldName] = `${fieldName}_value`;
    }
  });
  
  return exampleDoc;
};

// Enhanced version with more detailed documentation
const generateDetailedMongoDocumentation = async (mongoUrl) => {
  try {
    const schemaData = await extractDatabaseSchema(mongoUrl);
    const { schema, collections } = schemaData;

    let docs = {
      overview: {
        description: "Dbify auto-generates CRUD APIs for your MongoDB database. " +
          "Each collection gets endpoints for create, read, update, and delete operations.",
        baseUrl: "https://api.dbify.com/v1",
        authentication: "API Key required in request payload",
        responseFormat: "JSON"
      },
      database: {
        type: "MongoDB",
        collectionCount: collections.length,
        totalCollections: collections
      },
      collections: []
    };

    for (const collectionName of collections) {
      const collection = schema[collectionName];
      const { fields = [], documentCount = 0 } = collection;
      const examplePayload = generateExampleDocument(fields);

      // Generate field documentation
      const fieldDocs = fields.map(field => ({
        name: field,
        type: inferFieldType(field),
        required: field === '_id' ? true : false,
        description: generateFieldDescription(field)
      }));

      docs.collections.push({
        collection: collectionName,
        documentCount,
        fields: fieldDocs,
        schema: {
          example: examplePayload
        },
        endpoints: {
          create: {
            method: "POST",
            endpoint: "/api/crud",
            description: `Insert a new document into ${collectionName}`,
            requestBody: {
              projectId: 1,
              apiKey: "your_api_key",
              operation: "create",
              collectionName,
              payload: { data: examplePayload }
            },
            response: {
              success: true,
              data: { _id: "507f1f77bcf86cd799439011", ...examplePayload },
              operation: "create",
              count: 1,
              message: `Document(s) created in ${collectionName}`,
              createdDocuments: [{ _id: "507f1f77bcf86cd799439011", ...examplePayload }]
            }
          },
          read: {
            method: "POST",
            endpoint: "/api/crud",
            description: `Fetch documents from ${collectionName}`,
            requestBody: {
              projectId: 1,
              apiKey: "your_api_key",
              operation: "read",
              collectionName,
              payload: { 
                conditions: {},
                options: { limit: 10, skip: 0, sort: { _id: -1 } }
              }
            },
            response: {
              success: true,
              data: [{ _id: "507f1f77bcf86cd799439011", ...examplePayload }],
              operation: "read",
              count: 1,
              message: `Found 1 documents in ${collectionName}`,
              documents: [{ _id: "507f1f77bcf86cd799439011", ...examplePayload }]
            }
          },
          update: {
            method: "POST",
            endpoint: "/api/crud",
            description: `Update documents in ${collectionName}`,
            requestBody: {
              projectId: 1,
              apiKey: "your_api_key",
              operation: "update",
              collectionName,
              payload: {
                conditions: { _id: "507f1f77bcf86cd799439011" },
                data: examplePayload
              }
            },
            response: {
              success: true,
              operation: "update",
              modifiedCount: 1,
              matchedCount: 1,
              message: `Updated 1 documents in ${collectionName}`,
              updatedDocuments: [{ _id: "507f1f77bcf86cd799439011", ...examplePayload }]
            }
          },
          delete: {
            method: "POST",
            endpoint: "/api/crud",
            description: `Delete documents from ${collectionName}`,
            requestBody: {
              projectId: 1,
              apiKey: "your_api_key",
              operation: "delete",
              collectionName,
              payload: { 
                conditions: { _id: "507f1f77bcf86cd799439011" }
              }
            },
            response: {
              success: true,
              operation: "delete",
              deletedCount: 1,
              message: `Deleted 1 documents from ${collectionName}`,
              deletedDocuments: [{ _id: "507f1f77bcf86cd799439011", ...examplePayload }]
            }
          },
          aggregate: {
            method: "POST",
            endpoint: "/api/crud",
            description: `Run aggregation pipeline on ${collectionName}`,
            requestBody: {
              projectId: 1,
              apiKey: "your_api_key",
              operation: "aggregate",
              collectionName,
              payload: {
                pipeline: [
                  { $match: {} },
                  { $group: { _id: "$status", count: { $sum: 1 } } }
                ]
              }
            },
            response: {
              success: true,
              operation: "aggregate",
              data: [{ _id: "active", count: 5 }],
              count: 1,
              message: `Aggregation completed on ${collectionName}, returned 1 results`
            }
          },
          count: {
            method: "POST",
            endpoint: "/api/crud",
            description: `Count documents in ${collectionName}`,
            requestBody: {
              projectId: 1,
              apiKey: "your_api_key",
              operation: "count",
              collectionName,
              payload: { 
                conditions: {}
              }
            },
            response: {
              success: true,
              operation: "count",
              count: documentCount,
              conditions: {},
              message: `Found ${documentCount} documents matching conditions in ${collectionName}`
            }
          }
        }
      });
    }

    console.log("Generated Detailed MongoDB Docs:", JSON.stringify(docs, null, 2));
    return docs;

  } catch (error) {
    console.error('Error generating detailed MongoDB documentation:', error.message);
    throw new Error(`Detailed documentation generation failed: ${error.message}`);
  }
};

// Helper functions
const inferFieldType = (fieldName) => {
  const lowerField = fieldName.toLowerCase();
  
  if (fieldName === '_id') return 'ObjectId';
  if (lowerField.includes('date') || lowerField.includes('time')) return 'Date';
  if (lowerField.includes('email')) return 'String (Email)';
  if (lowerField.includes('age') || lowerField.includes('count') || lowerField.includes('number')) return 'Number';
  if (lowerField.includes('price') || lowerField.includes('amount')) return 'Number (Decimal)';
  if (lowerField.includes('bool') || lowerField.includes('enabled') || lowerField.includes('active')) return 'Boolean';
  if (lowerField.includes('array') || lowerField.includes('list') || lowerField.includes('tags')) return 'Array';
  
  return 'String';
};

const generateFieldDescription = (fieldName) => {
  const lowerField = fieldName.toLowerCase();
  
  if (fieldName === '_id') return 'MongoDB unique identifier';
  if (lowerField.includes('email')) return 'Email address';
  if (lowerField.includes('name')) return 'Name field';
  if (lowerField.includes('date') || lowerField.includes('time')) return 'Date/time value';
  if (lowerField.includes('status')) return 'Status indicator';
  if (lowerField.includes('description') || lowerField.includes('content')) return 'Text content';
  
  return `${fieldName} field`;
};

module.exports = { 
  generateMongoDocumentation, 
  generateDetailedMongoDocumentation 
};