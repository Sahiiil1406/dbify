const redis = require('redis');

let client = null;

const connectRedis = async (url = 'redis://localhost:6379') => {
  if (client) return client;
  
  client = redis.createClient({ url });
  await client.connect();
  console.log('Redis connected');
  return client;
};

const setKey = async (key, value) => {
  if (!client) throw new Error('Redis not connected');
  
  const val = typeof value === 'object' ? JSON.stringify(value) : value;
  await client.set(key, val);
  return true;
};

const getKey = async (key) => {
  if (!client) throw new Error('Redis not connected');
  
  const value = await client.get(key);
  if (!value) return null;
  
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const delKey = async (key) => {
  if (!client) throw new Error('Redis not connected');
  await client.del(key);
  return true;
};


module.exports = { connectRedis, setKey, getKey ,delKey};