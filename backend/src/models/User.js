import mongoose, { mongo, Schema } from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: String,
    phoneNumber: Number,
    households: [
        {type: Schema.Types.ObjectId, ref: 'Household'}
    ],
    chores: [
        {type: Schema.Types.ObjectId, ref: 'Chore'}
    ],
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;