const { Queue, QueueScheduler } = require('bullmq');
const connection = require('../config/redis');

// Initialize scheduler
// const scheduler = new QueueScheduler('chores', { connection });

// Create queue
const choreQueue = new Queue('chores', { connection });

// Job management functions
// schedule
const scheduleChoreReminder = async (chore) => {
  // get cron schedule
  // if one time chore, get date
  if (chore.isRecurring){
    return scheduleOneTimeChore(chore);
  } else {
    return scheduleRecurringChore(chore);
  }
};

const scheduleRecurringChore = async (chore) => {
 // called from scheduleChoreReminder
 // creates/gets cron schedule for the chore
 // https://docs.bullmq.io/guide/job-schedulers
 const cronPattern = chore.recurrence;
 if (!cronPattern) {
    console.error(`chore-scheduler-${chore._id} failed to create. No recurrence pattern.`);
    return;
 }
 await choreQueue.upsertJobScheduler(
    `chore-scheduler-${chore._id}`,
    {
      pattern: cronPattern,
    },
    {
      name: `chore-job-${chore._id}`,
      data: { jobData: chore }
    },
  );
}

const scheduleOneTimeChore = async (chore) => {
 // called from scheduleChoreReminder
 // creates a one time date chore
 // https://docs.bullmq.io/guide/jobs/delayed
  const targetTime = chore.nextOccurence;
  const delay = Number(targetTime) - Number(new Date());
  await choreQueue.add(`chore-job-${chore._id}`, { chore: chore }, { delay: delay, jobId: chore._id });
}

const cancelChoreReminder = async (choreId) => {
  if (chore.isRecurring) {
    const result = await choreQueue.removeJobScheduler(`chore-scheduler-${choreId}`);
    console.log(
      result ? 'Scheduler removed successfully' : 'Missing Job Scheduler',
    );
  } else {
    const result = await choreQueue.removeJobs(`chore-reminder-${choreId}`);
    console.log(
      result ? 'Job removed successfully' : 'Missing Job',
    );
  }
  return;
};


module.exports = {
  choreQueue,
  scheduleChoreReminder,
  cancelChoreReminder
};