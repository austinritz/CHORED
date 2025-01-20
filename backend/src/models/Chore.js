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
    nextOccurence: {
        type: Date,
        required: true
    },
    isReccuring: Boolean,
    recurrence: {
        type: String,
        required: false
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