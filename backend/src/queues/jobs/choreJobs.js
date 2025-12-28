import { Queue } from 'bullmq'
import { connection } from '../config/redis.js'

// Create queue
const choreQueue = new Queue('chores', { connection });

// Job management functions
// schedule
const scheduleChore = async (chore) => {
  // get cron schedule
  // if one time chore, get date
  console.log("Chore: ", chore);
  console.log("Chore isRecurring? ", chore.isRecurring);
  console.log("Chore id: ", chore._id.toString());
  if (chore.isRecurring){
    console.log("Chore is recurring");
    scheduleRecurringChore(chore);
  } else {
    console.log("Chore is one time chore");
    scheduleOneTimeChore(chore);
  }
  return;
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
  const targetTime = chore.nextOccurrence;
  const currentTime = Number(new Date());
  console.log(`TargetTime: ${targetTime}`);
  const delay = Number(targetTime) - Number(new Date());
  console.log(`current unix time: ${currentTime}`);
  console.log(`delay: ${delay}`);
  await choreQueue.add(`chore-job-${chore._id}`, { chore: chore }, { delay: delay, jobId: chore._id });
}

const cancelChore = async (choreId) => {
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

const editChore = async (chore) => {
  try {
    // First cancel the existing chore job
    await cancelChore(chore._id);
    
    // Then schedule a new job with the updated chore details
    await scheduleChore(chore);
    
    console.log(`Successfully rescheduled chore: ${chore._id}`);
    return true;
  } catch (error) {
    console.error(`Failed to edit chore ${chore._id} in queue:`, error);
    throw error;
  }
};


export {
  choreQueue,
  scheduleChore,
  cancelChore,
  editChore
};
