import { Queue } from 'bullmq'
import { connection } from '../config/redis.js'


// Create queue
const reminderQueue = new Queue('reminders', { connection });

// Job management functions
// schedule
const scheduleReminder = async (chore) => {
  // get cron schedule
  // if one time chore, get date
  if (chore.isRecurring){
    scheduleRecurringReminder(chore);
  } else {
    scheduleOneTimeReminder(chore);
    
  }
  return;
};

const scheduleRecurringReminder = async (chore) => {
 // called from scheduleChoreReminder
 // creates/gets cron schedule for the chore
 // https://docs.bullmq.io/guide/job-schedulers
 const cronPattern = chore.recurrence;
 if (!cronPattern) {
    console.error(`reminder-scheduler-${chore._id} failed to create. No recurrence pattern.`);
    return;
 }
 await reminderQueue.upsertJobScheduler(
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

const scheduleOneTimeReminder = async (chore) => {
 // called from scheduleChoreReminder
 // creates a one time date chore
 // https://docs.bullmq.io/guide/jobs/delayed
  const targetTime = chore.nextOccurence;
  const delay = Number(targetTime) - Number(new Date());
  await reminderQueue.add(`chore-job-${chore._id}`, { chore: chore }, { delay: delay, jobId: chore._id });
}

const cancelReminder = async (choreId) => {
  if (chore.isRecurring) {
    const result = await reminderQueue.removeJobScheduler(`chore-scheduler-${choreId}`);
    console.log(
      result ? 'Scheduler removed successfully' : 'Missing Job Scheduler',
    );
  } else {
    const result = await reminderQueue.removeJobs(`chore-reminder-${choreId}`);
    console.log(
      result ? 'Job removed successfully' : 'Missing Job',
    );
  }
  return;
};

const editReminder = async (chore) => {
    // TODO
}


export {
  reminderQueue,
  scheduleReminder,
  cancelReminder,
  editReminder
};