import mongoose from "mongoose"

const userCredentialSchema = new mongoose.Schema({
    email: String,
    username: String,
    hashed_password: String,
    salt: Number
});

const UserCredential = mongoose.model('UserCredential', userCredentialSchema);

export default UserCredential;