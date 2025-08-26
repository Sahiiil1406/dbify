const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const jwt=require('jsonwebtoken');
const brcypt=require('bcryptjs');

const {pushToTaskQueue}=require('../config/taskQueue');

const signUp = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const hashedPassword = await brcypt.hash(password, 10);
  
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });


    res.status(201).json(user);
  } catch (error) {
    logger.error('Error during user registration', { error: error.message });
    res.status(500).json({ error: 'User creation failed' });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(401).json({ error: 'User dont exist' });
    }

    const isValidPassword = await brcypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const payload={
        userId: user.id,
        email: user.email,
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    pushToTaskQueue({ event: 'user_logged_in', userId: user.id });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'User sign-in failed' });
  }
};
module.exports = { signUp, signIn };