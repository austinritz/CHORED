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

const Household = mongoose.model('Household', householdSchema);

export default Household;