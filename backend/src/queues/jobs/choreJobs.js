const { Queue, QueueScheduler } = require('bullmq');
const connection = require('../config/redis');

// Initialize scheduler
const scheduler = new QueueScheduler('chores', { connection });

// Create queue
const choreQueue = new Queue('chores', { connection });

// Job management functions
const scheduleChoreReminder = async (chore) => {
  const reminderTime = new Date(chore.dueDate);
  reminderTime.setHours(reminderTime.getHours() - 1);
  
  const delay = reminderTime.getTime() - Date.now();
  
  if (delay <= 0) return;

  return await choreQueue.add('reminder', {
    choreId: chore._id,
    userId: chore.userId,
    type: 'reminder'
  }, {
    delay,
    jobId: `reminder-${chore._id}`
  });
};

const cancelChoreReminder = async (choreId) => {
  await choreQueue.removeJobs(`reminder-${choreId}`);
};

module.exports = {
  choreQueue,
  scheduleChoreReminder,
  cancelChoreReminder
};