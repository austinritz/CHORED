import mongoose, { Schema } from "mongoose"
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: Number,
    profilePhoto: {
        type: String,
        default: null
      },
    households: [
        {type: Schema.Types.ObjectId, ref: 'Household'}
    ],
    chores: [
        {type: Schema.Types.ObjectId, ref: 'Chore'}
    ],
}, {
    timestamps: true
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

export default User;