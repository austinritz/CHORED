import { scheduleReminder, cancelReminder, editReminder } from "./reminderJobs.js"
import { scheduleChore, cancelChore, editChore } from "./choreJobs.js"
import '../workers/choreWorkers.js'
import '../workers/reminderWorkers.js'

const scheduleChoreNotification = async (chore) => {
    scheduleChore(chore);
    scheduleReminder(chore);
};

const editChoreNotification = async (chore) => {
    editChore(chore);
    editReminder(chore);
};

const cancelChoreNotification = async (choreId) => {
    cancelChore(choreId);
    cancelReminder(choreId);
};

export {
    scheduleChoreNotification,
    editChoreNotification,
    cancelChoreNotification
};