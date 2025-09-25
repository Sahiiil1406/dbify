const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {connectRabbitMQ}=require('./config/taskQueue');
const {connectRedis} =require('./config/redis.js')
const { PrismaClient } = require('@prisma/client');
const userRoutes = require('./routes/user.routes.js');
const projectRoutes = require('./routes/project.routes.js');
const crudRoutes = require('./routes/crud.routes.js');
const docsRoutes = require('./routes/docs.routes.js');
const loggerMiddleware = require('./middleware/logger.middleware.js');
const prisma = new PrismaClient();

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173", "*"], // your React app URL
    credentials: true,              // allow cookies
  })
);
app.use(cookieParser());
app.use(loggerMiddleware);

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString() 
  });
});

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/crud', crudRoutes);
app.use('/api/docs', docsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectRedis()
  connectRabbitMQ()
  console.log(`Server is running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});