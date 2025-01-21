import { Worker } from 'bullmq';
import { connection } from'../config/redis.js';

export const choreWorker = new Worker('chores', async (job) => {
    console.log('chore execution started!');
    // TODO: Send to notification handler
}, {
  connection,
  concurrency: 10,
});

choreWorker.on('ready', () => {
  console.log('Reminder worker is ready to process jobs');
});

choreWorker.on('failed', (job, error) => {
  console.error(`Job ${job.id} failed:`, error);
  // TODO: Implement DLQ logic
});

choreWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed:`);
});
