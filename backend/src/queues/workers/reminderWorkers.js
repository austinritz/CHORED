import { Worker } from 'bullmq';
import { connection } from'../config/redis.js';

export const reminderWorker = new Worker('reminders', async (job) => {
    console.log('Task notification sent ( in theory ;) )');
    
}, {
  connection,
  concurrency: 10,
});

reminderWorker.on('failed', (job, error) => {
  console.error(`Job ${job.id} failed:`, error);
  // TODO: Implement DLQ logic
});

reminderWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed:`);
});