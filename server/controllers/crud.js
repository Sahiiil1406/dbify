const DatabaseCRUD=require('../CRUD/crud')
const { PrismaClient } = require("@prisma/client");
const {getDbConnection,extractDatabaseSchema}=require('../config/connection-management')
const {setKey,getKey,delKey}=require('../config/redis');
const prisma = new PrismaClient();

const mainDBFunc=async(req,res)=>{
    const {projectId,apiKey,operation,payload,tableName}=req.body;
    const project = await prisma.project.findUnique({
      where: { id: Number(projectId) },
    })
    if(!project) return res.status(404).json({ error: 'Project not found' });
    if(project.apiKey !== apiKey) return res.status(403).json({ error: 'Access denied' });
    //console.log(project);
    const dbUrl=project.dbUrl;
    const db=await getDbConnection(dbUrl);
    let schema=await getKey(`project:${project.dbUrl}`);
    //console.log("Fetched schema from Redis:", schema);
    if(!schema){
        schema=await extractDatabaseSchema(db);
        await setKey(`project:${project.dbUrl}`, schema);
    }
    console.log(schema);
    const CRUD=new DatabaseCRUD(db,schema);
    // console.log(CRUD)
    if(operation==='create'){
        const result=await CRUD.create(tableName,payload);
        return res.status(200).json(result);
    }else if(operation==='read'){
        const result=await CRUD.read(tableName,payload);
        return res.status(200).json(result);
    }else if(operation==='update'){
        const {where,data}=payload;
        const result=await CRUD.update(tableName,where,data);
        return res.status(200).json(result);
    }else if(operation==='delete'){
        const result=await CRUD.delete(tableName,payload);
        return res.status(200).json(result);
    }else{
        return res.status(400).json({ error: 'Invalid operation' });
    }
    
}
module.exports={mainDBFunc};