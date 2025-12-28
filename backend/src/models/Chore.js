import mongoose, { mongo, Schema } from "mongoose"

const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;

const choreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    currentQueuePosition: {
        type: Number,
        default: 0
    },
    nextOccurrence: {
        type: Date,
        required: true
    },
    isRecurring: Boolean,
    // recurrence is a Cron pattern like '* * * * * *'
    recurrence: {
        type: String,
        required: false
    },
    // MS between reminder and event
    reminderBufferTime: {
        type: Number,
        required: false,
        default: EIGHT_HOURS_MS,
    },
    users: [{
        _id: false,
        positionInQueue: {
            type: Number,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }],
    household: {
        type: Schema.Types.ObjectId,
        ref: 'Household'
    },
}, {
    timestamps: true
});

const Chore = mongoose.model('Chore', choreSchema);

export default Chore;
