const amqp = require('amqplib');
require('dotenv').config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
const TASK_QUEUE = process.env.RABBITMQ_TASK_QUEUE || 'tasks';

let connection;
let channel;

const connectRabbitMQ = async (retries = 5, delay = 2000) => {
  if (connection && channel) return;

  for (let i = 0; i < retries; i++) {
    try {
      connection = await amqp.connect(RABBITMQ_URL);
      channel = await connection.createChannel();

      await channel.assertQueue(TASK_QUEUE, { durable: true });

      connection.on('close', () => console.warn('⚠️ RabbitMQ connection closed'));
      connection.on('error', (err) => console.error('❌ RabbitMQ error:', err.message));

      console.log('✅ Connected to RabbitMQ');
      return;
    } catch (err) {
      console.error(`❌ RabbitMQ connection failed (attempt ${i + 1}/${retries}):`, err.message);
      if (i < retries - 1) {
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise((res) => setTimeout(res, delay));
        delay *= 2; // exponential backoff
      } else {
        throw err; // failed after all retries
      }
    }
  }
};

const pushToTaskQueue = async (message) => {
  if (!connection || !channel) {
    await connectRabbitMQ();
  }
  console.log(message);


  channel.sendToQueue(TASK_QUEUE, Buffer.from(JSON.stringify(message)), { persistent: true });
  //console.log('📤 Message sent to task queue:', message);
};

module.exports = {
  pushToTaskQueue,
  connectRabbitMQ
};
