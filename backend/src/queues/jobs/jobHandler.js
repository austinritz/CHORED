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

const cancelChoreNotification = async (chore) => {
    cancelChore(chore);
    cancelReminder(chore);
};

export {
    scheduleChoreNotification,
    editChoreNotification,
    cancelChoreNotification
};