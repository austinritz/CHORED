import { Queue } from 'bullmq'
import { connection } from '../config/redis.js'


// Create queue
const reminderQueue = new Queue('reminders', { connection });

// Job management functions
// schedule
const scheduleReminder = async (chore) => {
  // get cron schedule
  // if one time chore, get date
  if (chore.isReccuring){
    scheduleRecurringReminder(chore);
  } else {
    scheduleOneTimeReminder(chore);console.log("Chore: ", chore);
    console.log("Chore: ", chore);
  }
  console.log("Chore: ", chore);console.log("Chore: ", chore);console.log("Chore: ", chore);console.log("Chore: ", chore);
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
  if (chore.isReccuring) {
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
  try {
    // First cancel the existing chore job
    await cancelReminder(chore._id);
    
    // Then schedule a new job with the updated chore details
    await scheduleReminder(chore);
    
    console.log(`Successfully rescheduled reminder: ${chore._id}`);
    return true;
  } catch (error) {
    console.error(`Failed to edit chore ${chore._id} in queue:`, error);
    throw error;
  }
};

export {
  reminderQueue,
  scheduleReminder,
  cancelReminder,
  editReminder
};
