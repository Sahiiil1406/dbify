class DatabaseCRUD {
  constructor(db, schema) {
    this.db = db;
    this.schema = schema;
  }


  async create(tableName, data) {
    try {
      if (!this.schema[tableName]) {
        throw new Error(`Table '${tableName}' not found in schema`);
      }

      const result = await this.db(tableName).insert(data).returning('*');
      return {
        success: true,
        data: result,
        message: `Record created successfully in ${tableName}`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `Failed to create record in ${tableName}`
      };
    }
  }

  // READ - Get data from table
  async read(tableName, conditions = {}, options = {}) {
    try {
      if (!this.schema[tableName]) {
        throw new Error(`Table '${tableName}' not found in schema`);
      }

      let query = this.db(tableName);
      
      // Apply conditions
      if (Object.keys(conditions).length > 0) {
        query = query.where(conditions);
      }

      // Apply options (limit, offset, orderBy)
      if (options.limit) query = query.limit(options.limit);
      if (options.offset) query = query.offset(options.offset);
      if (options.orderBy) {
        if (Array.isArray(options.orderBy)) {
          query = query.orderBy(options.orderBy);
        } else {
          query = query.orderBy(options.orderBy);
        }
      }

      const result = await query;
      return {
        success: true,
        data: result,
        count: result.length,
        message: `Records retrieved successfully from ${tableName}`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `Failed to read records from ${tableName}`
      };
    }
  }

  // UPDATE - Update data in table
  async update(tableName, conditions, data) {
    try {
      if (!this.schema[tableName]) {
        throw new Error(`Table '${tableName}' not found in schema`);
      }

      const result = await this.db(tableName)
        .where(conditions)
        .update(data)
        .returning('*');

      return {
        success: true,
        data: result,
        updatedCount: result.length,
        message: `Records updated successfully in ${tableName}`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `Failed to update records in ${tableName}`
      };
    }
  }

  // DELETE - Delete data from table
  async delete(tableName, conditions) {
    try {
      if (!this.schema[tableName]) {
        throw new Error(`Table '${tableName}' not found in schema`);
      }

      const deletedRows = await this.db(tableName)
        .where(conditions)
        .del();

      return {
        success: true,
        deletedCount: deletedRows,
        message: `${deletedRows} record(s) deleted successfully from ${tableName}`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `Failed to delete records from ${tableName}`
      };
    }
  }

  // Get table schema info
  getTableSchema(tableName) {
    return this.schema[tableName] || null;
  }

  // Get all tables
  getAllTables() {
    return Object.keys(this.schema);
  }

  // Execute custom query
  async customQuery(query, bindings = []) {
    try {
      const result = await this.db.raw(query, bindings);
      return {
        success: true,
        data: result.rows || result,
        message: 'Custom query executed successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to execute custom query'
      };
    }
  }
}
module.exports = DatabaseCRUD;