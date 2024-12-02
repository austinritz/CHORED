const { Worker } = require('bullmq');
const connection = require('../config/redis');

const choreWorker = new Worker('chores', async (job) => {
  const { choreId, userId, type } = job.data;
  
  switch (type) {
    case 'reminder':
      await sendChoreReminder(choreId, userId);
      break;
    case 'due':
      await markChoreDue(choreId);
      break;
    // Add other job types as needed
  }
}, {
  connection,
  concurrency: 10,
});

choreWorker.on('failed', (job, error) => {
  console.error(`Job ${job.id} failed:`, error);
});

module.exports = choreWorker;