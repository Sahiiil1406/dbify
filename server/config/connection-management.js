const knex = require("knex");
const { Client } = require("pg");
const { connectRedis, setKey, getKey, delKey } = require("./redis");

const connections = {};
async function setupTriggers(pgClient) {
  await pgClient.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_event_trigger WHERE evtname = 'schema_change_trigger'
      ) THEN
        CREATE FUNCTION notify_db_change()
        RETURNS event_trigger
        LANGUAGE plpgsql
        AS $fn$
        BEGIN
          PERFORM pg_notify('db_change', 'schema_changed');
        END;
        $fn$;

        CREATE EVENT TRIGGER schema_change_trigger
        ON ddl_command_end
        EXECUTE FUNCTION notify_db_change();
      END IF;
    END
    $$ LANGUAGE plpgsql;
  `);
}

const getDbConnection = async (connectionUrl) => {
  if (connections[connectionUrl]) {
    console.log("Using cached connection:", connectionUrl);
    return connections[connectionUrl].knex;
  }

  try {
    const dbInstance = knex({
      client: "pg",
      connection: connectionUrl,
      pool: { min: 0, max: 10 },
    });

    // 2. Dedicated pg.Client for LISTEN/NOTIFY
    const pgClient = new Client({ connectionString: connectionUrl });
    await pgClient.connect();

    // Setup triggers
    await setupTriggers(pgClient);

    // Listen for notifications
    pgClient.on("notification", async (msg) => {
      if (msg.channel === "db_change") {
        const schema = await extractDatabaseSchema(dbInstance);
        await setKey(`project:${connectionUrl}`, JSON.stringify(schema));
        console.log(`Database schema for ${connectionUrl} updated in Redis`);
      }
    });
    await pgClient.query("LISTEN db_change");

    // Cache both
    connections[connectionUrl] = { knex: dbInstance, listener: pgClient };

    //console.log("New DB connection established and listening for changes.");

    return dbInstance;
  } catch (error) {
    console.error("Failed to create database connection:", error);
    throw error;
  }
};

const extractDatabaseSchema = async (db) => {
  try {
    const tablesResult = await db.raw(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    const tables = tablesResult.rows.map((row) => row.table_name);

    const schema = {};

    for (const tableName of tables) {
      const columnsResult = await db.raw(
        `
        SELECT 
          c.column_name,
          c.data_type,
          c.is_nullable,
          c.column_default,
          c.character_maximum_length,
          c.numeric_precision,
          c.numeric_scale,
          CASE 
            WHEN pk.column_name IS NOT NULL THEN true 
            ELSE false 
          END as is_primary_key,
          CASE 
            WHEN fk.column_name IS NOT NULL THEN true 
            ELSE false 
          END as is_foreign_key,
          fk.foreign_table_name,
          fk.foreign_column_name
        FROM information_schema.columns c
        LEFT JOIN (
          SELECT kcu.column_name, kcu.table_name
          FROM information_schema.table_constraints tc
          JOIN information_schema.key_column_usage kcu 
            ON tc.constraint_name = kcu.constraint_name
          WHERE tc.constraint_type = 'PRIMARY KEY'
        ) pk ON c.column_name = pk.column_name AND c.table_name = pk.table_name
        LEFT JOIN (
          SELECT 
            kcu.column_name,
            kcu.table_name,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
          FROM information_schema.table_constraints AS tc
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
          WHERE tc.constraint_type = 'FOREIGN KEY'
        ) fk ON c.column_name = fk.column_name AND c.table_name = fk.table_name
        WHERE c.table_name = ?
        ORDER BY c.ordinal_position;
      `,
        [tableName]
      );

      const columns = columnsResult.rows;
      const primaryKeys = columns
        .filter((col) => col.is_primary_key)
        .map((col) => col.column_name);

      schema[tableName] = {
        tableName,
        columns: columns.map((col) => ({
          name: col.column_name,
          dataType: col.data_type,
          isNullable: col.is_nullable === "YES",
          defaultValue: col.column_default,
          maxLength: col.character_maximum_length,
          precision: col.numeric_precision,
          scale: col.numeric_scale,
          isPrimaryKey: col.is_primary_key,
          isForeignKey: col.is_foreign_key,
          foreignTable: col.foreign_table_name,
          foreignColumn: col.foreign_column_name,
        })),
        primaryKeys,
      };
    }

    return {
      tables,
      schema,
      tableCount: tables.length,
    };
  } catch (error) {
    console.error("Error extracting database schema:", error);
    throw error;
  }
};

module.exports = {
  getDbConnection,
  extractDatabaseSchema,
};
