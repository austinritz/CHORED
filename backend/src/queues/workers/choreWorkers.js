const { Worker } = require('bullmq');
const connection = require('../config/redis');

const choreWorker = new Worker('chores', async (job) => {
    console.log('* Triggered task executed!');
}, {
  connection,
  concurrency: 10,
});

choreWorker.on('failed', (job, error) => {
  console.error(`Job ${job.id} failed:`, error);
});

choreWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed:`);
});

module.exports = choreWorker;