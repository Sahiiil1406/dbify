const DatabaseCRUD = require("../CRUD/crud");
const { PrismaClient } = require("@prisma/client");
const {
  getDbConnection,
  extractDatabaseSchema,
} = require("../config/connection-management");
const { setKey, getKey, delKey } = require("../config/redis");
const prisma = new PrismaClient();

const generateCytoscapeElements = (schema) => {
  const nodes = [];
  const edges = [];

  if (!schema || !schema.schema) return { nodes, edges };

  for (const tableName in schema.schema) {
    const table = schema.schema[tableName];

    // Ensure columns array exists
    const columns = Array.isArray(table.columns) ? table.columns : [];

    // Node for table
    nodes.push({
      data: {
        id: tableName,
        label: `${tableName}${columns.length ? '\n' + columns.map(c => c.name || '').join(', ') : ''}`
      }
    });

    // Edges for foreign keys
    columns.forEach((col) => {
      if (col && col.isForeignKey && col.foreignTable && col.foreignColumn) {
        edges.push({
          data: {
            id: `${tableName}_${col.name || 'col'}_to_${col.foreignTable}`,
            source: tableName,
            target: col.foreignTable,
            label: `${col.name || ''} → ${col.foreignColumn}`
          }
        });
      }
    });
  }

  return { nodes, edges };
};


const visualizeSchema = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }
    //console.log("Visualizing schema for projectId:", projectId);
    const project = await prisma.project.findUnique({
      where: { id: Number(projectId) },
    });
    console.log(project);
    let schema = await getKey(`project:${project.dbUrl}`);
    console.log("Fetched schema from Redis:", schema);

    const { nodes, edges } = generateCytoscapeElements(schema);
    console.log(nodes);
    console.log(edges);
    return res.status(200).json({ nodes, edges });
  } catch (error) {
    console.error("❌ Error visualizing schema:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = { visualizeSchema };
