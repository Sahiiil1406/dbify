class MongoDatabaseCRUD {
  constructor(conn, schema) {
    this.conn = conn;
    this.schema = schema;
    this.modelCache = new Map();
    this.queryCache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  getModel(collectionName) {
    if (this.modelCache.has(collectionName)) {
      return this.modelCache.get(collectionName);
    }

    const schema = new this.conn.base.Schema({}, { strict: false });
    const model = this.conn.model(collectionName, schema, collectionName);
    this.modelCache.set(collectionName, model);
    return model;
  }

  clearCache(collectionName) {
    for (const [key] of this.queryCache) {
      if (key.startsWith(collectionName + '_')) {
        this.queryCache.delete(key);
      }
    }
  }

  // CREATE
  async create(collectionName, data) {
    const Model = this.getModel(collectionName);
    const result = await Model.create(data);
    this.clearCache(collectionName);
    
    return {
      success: true,
      data: result,
      message: `Document created in ${collectionName}`
    };
  }

  // READ with caching
  async read(collectionName, conditions = {}, options = {}) {
    const cacheKey = `${collectionName}_${JSON.stringify(conditions)}_${JSON.stringify(options)}`;
    
    // Check cache
    if (this.queryCache.has(cacheKey)) {
      const cached = this.queryCache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        console.log(`Cache hit for ${collectionName}`);
        return { ...cached.result, cached: true };
      } else {
        this.queryCache.delete(cacheKey);
      }
    }

    const Model = this.getModel(collectionName);
    let query = Model.find(conditions);
    
    if (options.limit) query = query.limit(options.limit);
    if (options.skip) query = query.skip(options.skip);
    if (options.sort) query = query.sort(options.sort);

    const result = await query.exec();
    
    const response = {
      success: true,
      data: result,
      count: result.length,
      message: `Found ${result.length} documents in ${collectionName}`
    };

    // Cache small result sets
    if (result.length <= 100) {
      this.queryCache.set(cacheKey, {
        result: response,
        timestamp: Date.now()
      });
    }

    return response;
  }

  // UPDATE
  async update(collectionName, conditions, data) {
    const Model = this.getModel(collectionName);
    const result = await Model.updateMany(conditions, { $set: data });
    this.clearCache(collectionName);
    
    return {
      success: true,
      modifiedCount: result.modifiedCount,
      message: `Updated ${result.modifiedCount} documents in ${collectionName}`
    };
  }

  // DELETE
  async delete(collectionName, conditions) {
    const Model = this.getModel(collectionName);
    const result = await Model.deleteMany(conditions);
    this.clearCache(collectionName);
    
    return {
      success: true,
      deletedCount: result.deletedCount,
      message: `Deleted ${result.deletedCount} documents from ${collectionName}`
    };
  }
}

module.exports = MongoDatabaseCRUD;
