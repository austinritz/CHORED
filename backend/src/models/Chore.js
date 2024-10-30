import mongoose, { mongo, Schema } from "mongoose"

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
    nextOccurence: Date,
    recurrence: {
        intervalType: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'yearly'],
            default: 'weekly'
        },
        intervalSpacing: {
            type: Number,
            default: 1
        }, // Ex. once a week, every other week, every day, every 3 days, etc
        dayOfTheWeek: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            default: 'Monday'
        },
        dayOfTheMonth: {
            type: Number,
            min: 1,
            max: 31,
        },
        time: { 
            type: String,
            hour: { type: Number, min: 0, max: 23 },
            minute: { type: Number, min: 0, max: 59 }
        }
    },
    users: [
        {
            type: Map,
            of: new Schema({
                positionInQueue: Number,
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'User'
                },
            })
        }
    ],
    household: {
        type: Schema.Types.ObjectId,
        ref: 'Household'
    },
}, {
    timestamps: true
});

const Chore = mongoose.model('chore', choreSchema);

export default Chore;