const { getConnection, extractDatabaseSchema } = require("./connection");
const MongoDatabaseCRUD = require("./crud");


const mongohelper = async(dbUrl,operation,docName,payload) => {
    try {
        console.log("mongo jelper")
        const conn = await getConnection(dbUrl);
        console.log("Commected")
        const schema = await extractDatabaseSchema(dbUrl);
        const mcrud=new MongoDatabaseCRUD(conn, schema);
        if(operation==='read'){
            const comments = await mcrud.read(docName);
            return comments;
        }else if(operation==='create'){
            const newDoc= await mcrud.create(docName, payload);
            return newDoc;
        }else if(operation==='update'){
            const updatedDoc= await mcrud.update(docName, payload.where, payload.data);
            return updatedDoc;
        }else if(operation==='delete'){
            const deletedDoc= await mcrud.delete(docName, payload);
            return deletedDoc;
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}

module.exports = mongohelper;