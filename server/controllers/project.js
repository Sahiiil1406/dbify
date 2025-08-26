const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const crypto = require("crypto");


const generateApiKey = () => crypto.randomBytes(9).toString("hex");

const createProject = async (req, res) => {
  const { name, description } = req.body;

  const apiKey = generateApiKey();
  //console.log(req.user)
  try {
    const project = await prisma.project.create({
      data: {
        title: name,
        description,
        user: {
          connect: { id: req.user.userId },
        },
        apiKey,
      },
    });
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Project creation failed" });
  }
};

const updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const project = await prisma.project.update({
      where: { id: Number(id) },
      data: {
        title: name, // updated to match schema
        description,
      },
    });
    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Project update failed" });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.project.delete({
      where: { id: Number(id) },
    });
    res.status(204).send({
      msg:"Project deleted successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Project deletion failed" });
  }
};

const getProject = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await prisma.project.findUnique({
      where: { id: Number(id) },
    });
    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Project retrieval failed" });
  }
};

const getMyProjects = async (req, res) => {
  const userId = req.user.id;

  try {
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }, // optional: newest first
    });
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve projects" });
  }
};

module.exports = {
  createProject,
  updateProject,
  deleteProject,
  getProject,
  getMyProjects,
};
