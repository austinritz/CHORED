import mongoose from 'mongoose';
import User from '../models/User.js';

const ObjectId = mongoose.Types.ObjectId;

export const getUser = async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid User Id"});
    }

    try {
        const retrievedUser = await User.findById(id)
            .populate('households')
            .populate('chores');
        if (retrievedUser === null) {
            return res.status(404).json({ success: false, message: "User does not exist"});
        } 
        res.status(200).json({ success: true, data: retrievedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
};

export const createUser = async (req, res) => {
    const user = req.body;

    if (!user.name || !user.email) {
        return res.status(400).json({ success: false, message: "Please provide all fields"});
    }

    const newUser = new User(user);

    try {
        await newUser.save();
        res.status(201).json({ success: true, data: newUser});
    } catch (error) {
        console.error('Error in Create User', error.message);
        res.status(500).json({ success: false, message: "Server Error"});
    }
};
    
export const updateUser = async (req, res) => {
    const { id } = req.params;

    const user = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid User Id"});
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(id, user,{new:true});
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid User Id"});
    }

    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "User was deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
};
