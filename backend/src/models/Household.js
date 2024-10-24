import mongoose, { mongo, Schema } from "mongoose"

const householdSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    users: [
        {type: Schema.Types.ObjectId, ref: 'User'}
    ],
    chores: [
        {type: Schema.Types.ObjectId, ref: 'Chore'}
    ],
}, {
    timestamps: true
});

const Household = mongoose.model('Household', householdSchema);

export default Household;