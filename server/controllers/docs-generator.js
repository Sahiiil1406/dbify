const DatabaseCRUD=require('../CRUD/crud')
const { PrismaClient } = require("@prisma/client");
const {getDbConnection,extractDatabaseSchema}=require('../config/connection-management')
const {setKey,getKey,delKey}=require('../config/redis');
const prisma = new PrismaClient();

const generateDocumentation = async (schema) => {
  const { tables, schema: tableSchemas } = schema;

  let docs = {
    overview: "Dbify auto-generates CRUD APIs for your database. " +
      "Each table gets endpoints for create, read, update, and delete operations.",
    tableCount: tables.length,
    tables: []
  };

  for (const tableName of tables) {
    const table = tableSchemas[tableName];
    const { columns = [], primaryKeys = [] } = table;

    const examplePayload = {};
    columns.forEach(col => {
      const type = col.dataType || ""; // <-- corrected
      if (type.includes("int")) examplePayload[col.name] = 1;
      else if (type.includes("char") || type.includes("text")) examplePayload[col.name] = `${col.name}_value`;
      else if (type.includes("timestamp") || type.includes("date")) examplePayload[col.name] = new Date().toISOString();
      else if (type.includes("bool")) examplePayload[col.name] = true;
      else examplePayload[col.name] = null;
    });

    docs.tables.push({
      table: tableName,
      primaryKeys,
      columns,
      endpoints: {
        create: {
          description: `Insert a new record into ${tableName}`,
          payload: {
            projectId: 1,
            apiKey: "your_api_key",
            operation: "create",
            tableName,
            payload: { data: examplePayload }
          }
        },
        read: {
          description: `Fetch records from ${tableName}`,
          payload: {
            projectId: 1,
            apiKey: "your_api_key",
            operation: "read",
            tableName,
            payload: { [primaryKeys[0] || "id"]: 1 }
          }
        },
        update: {
          description: `Update records in ${tableName}`,
          payload: {
            projectId: 1,
            apiKey: "your_api_key",
            operation: "update",
            tableName,
            payload: {
              where: { [primaryKeys[0] || "id"]: 1 },
              data: { ...examplePayload }
            }
          }
        },
        delete: {
          description: `Delete records from ${tableName}`,
          payload: {
            projectId: 1,
            apiKey: "your_api_key",
            operation: "delete",
            tableName,
            payload: { where: { [primaryKeys[0] || "id"]: 1 } }
          }
        }
      }
    });
  }
  console.log("Generated Docs:", docs);
  return docs;
};

const getDocs=async(req,res)=>{
    try {
        const {projectId}=req.params;
        const project = await prisma.project.findUnique({
          where: { id: Number(projectId) },
        })
        //console.log("Project:",project);
        let schema=await getKey(`project:${project.dbUrl}`);
        if(!schema){
            const db= getDbConnection(project.dbUrl);
            schema=await extractDatabaseSchema(db);
            await setKey(`project:${project.dbUrl}`, schema);
        }
        // Generate documentation from schema
         console.log("Schema:",schema);
        const docs=await generateDocumentation(schema);
        return res.status(200).json(docs);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports={getDocs};