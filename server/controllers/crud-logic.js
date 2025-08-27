const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {setKey,getKey,delKey}=require('../config/redis');
const { getDbConnection,extractDatabaseSchema}=require('../config/connection-management');

const initialiseProject=async(req,res)=>{
  try {
   
    const {id}=req.params;
    const project = await prisma.project.findFirst({
    where: {
        id: Number(id)
    }
});
//    console.log(project);
    if(!project) return res.status(404).json({ error: 'Project not found' });
    if(String(req.user.userId) !== String(project.userId)) return res.status(403).json({ error: 'Access denied' });
    const db = await getDbConnection(project.dbUrl);
    
    const schema = await extractDatabaseSchema(db);
    // console.log(schema);
    await setKey(`project:${project.dbUrl}`, schema);
    return res.status(200).json({ message: 'Project initialized successfully', schema });
  } catch (error) {
    return res.status(500).json({ error: 'Project initialization failed' });
  }
};

const stopProject=async(req,res)=>{
  try {
    const {id}=req.params;
    const project=await prisma.project.findUnique({where:{
        id:Number(id)
    }});
    if(!project) return res.status(404).json({ error: 'Project not found' });
    if(String(project.userId) !== String(req.user.userId)) return res.status(403).json({ error: 'Access denied' });
    await delKey(`project:${project.dbUrl}`);
    return res.status(200).json({ message: 'Project stopped successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Project stopping failed' });
  }
};

const getDetailedSchema=async(req,res)=>{
    try {
        const {id}=req.params;
        const project=await prisma.project.findUnique({where:{
            id:Number(id)
        }});
        if(!project) return res.status(404).json({ error: 'Project not found' });

        if(String(project.userId) !== String(req.user.userId)) return res.status(403).json({ error: 'Access denied' });
        const schema=await getKey(`project:${project.dbUrl}`);

        return res.status(200).json({ schema });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve detailed schema' });
    }
}

const updateProjectSchema=async(req,res)=>{
    try {
        const {id}=req.params;
        const project=await prisma.project.findUnique({where:{
            id:Number(id)
        }});
        if(!project) return res.status(404).json({ error: 'Project not found' });

        if(String(project.userId) !== String(req.user.userId)) return res.status(403).json({ error: 'Access denied' });
        await delKey(`project:${project.dbUrl}`);
        await setKey(`project:${project.dbUrl}`, schema);

        return res.status(200).json({ schema });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update project schema' });
    }
}

module.exports={initialiseProject,stopProject,getDetailedSchema,updateProjectSchema};
