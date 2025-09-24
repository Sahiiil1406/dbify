// Convert your code to ES6 imports
import express from 'express';
import amqp from 'amqplib';
import 'dotenv/config';
import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api.js";

const app = express();
const PORT = process.env.PORT || 3000;
const convex = new ConvexHttpClient(process.env.CONVEX_URL);
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://user:password@localhost:5672/'
const QUEUE_NAME = process.env.RABBITMQ_TASK_QUEUE || 'task_queue'
const EXCHANGE = process.env.RABBITMQ_TASK_QUEUE || 'task_queue'
const ROUTING_KEY = '#';

const runWorker = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE, 'topic', { durable: true });
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    await channel.bindQueue(QUEUE_NAME, EXCHANGE, ROUTING_KEY);

    console.log(`✅ Waiting for messages in queue: ${QUEUE_NAME}`);

    channel.consume(
      QUEUE_NAME,
      async(msg) => {
        if (msg !== null) {
          const content = msg.content.toString();
          // console.log('📥 Received message:', content);
          const logData = JSON.parse(content);
          // storeLog(logData).catch(err => console.error('❌ Failed to store log:', err));
          // Acknowledge message after processing
          await convex.mutation(api.mutations.storeLog, logData).catch(err => console.error('❌ Failed to store log:', err));
          channel.ack(msg);
        }
      },
      { noAck: false }
    );

    connection.on('close', () => console.warn('⚠️ RabbitMQ connection closed'));
    connection.on('error', (err) => console.error('❌ RabbitMQ error:', err.message));
  } catch (err) {
    console.error('❌ Failed to connect to RabbitMQ:', err.message);
    setTimeout(runWorker, 5000); // retry after 5s
  }
};

// Start Express server
app.get('/', (req, res) => {
  res.send('Express server is running and connected to RabbitMQ!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  runWorker(); // start consuming messages
});
