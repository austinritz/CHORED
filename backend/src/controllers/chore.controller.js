import mongoose from 'mongoose';
import Chore from '../models/Chore.js';

const ObjectId = mongoose.Types.ObjectId;

export const getChore = async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Chore Id"});
    }

    try {
        const retrievedChore = await Chore.findById(id)
            .populate('users')
            .populate('household');
        if (retrievedChore === null) {
            return res.status(404).json({ success: false, message: "Chore does not exist"});
        }
        res.status(200).json({ success: true, data: retrievedChore });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
};

export const getCurrentChoreUser = async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Chore Id"});
    }

    try {
        const retrievedChore = await Chore.findById(id)
            .populate('users');
        if (retrievedChore === null) {
            return res.status(404).json({ success: false, message: "Chore does not exist"});
        }
        if (retrievedChore.users === null) {
            return res.status(404).json({ success: false, message: "Chore has no users"});
        }
        const currentChoreUser = retrievedChore.users.filter(user => user.positionInQueue === retrievedChore.currentQueuePosition);
        res.status(200).json({ success: true, data: currentChoreUser });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
};

export const createChore = async (req, res) => {
    const chore = req.body;

    if (!chore.name || !chore.description) {
        return res.status(400).json({ success: false, message: "Please provide all fields"});
    }

    const newChore = new Chore(chore);

    try {
        await newChore.save();
        res.status(201).json({ success: true, data: newChore});
    } catch (error) {
        console.error('Error in Create Chore', error.message);
        res.status(500).json({ success: false, message: "Server Error"});
    }
};
    
export const updateChore = async (req, res) => {
    const { id } = req.params;

    const chore = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Chore Id"});
    }

    try {
        const updatedChore = await Chore.findByIdAndUpdate(id, chore,{new:true});
        res.status(200).json({ success: true, data: updatedChore });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
};

// Move the queue to the next person. If no more users are in the queue, then it will call the delay function (which resets the queue and puts the date to the next day)
export const incrementChoreQueuePosition = async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Chore Id"});
    }

    try {
        const retrievedChore = await Chore.findById(id);
        if (retrievedChore.users.length === retrievedChore.currentQueuePosition + 1) {
            return delayChore(id);
        }
        const updatedChore = await Chore.findByIdAndUpdate(id, { $inc: { currentQueuePosition: 1 } });
        res.status(200).json({ success: true, data: updatedChore });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
};

// Resets a chores queue to 0
export const resetChoreQueuePosition = async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Chore Id"});
    }

    try {
        const updatedChore = await Chore.findByIdAndUpdate(id, { $set: { currentQueuePosition: 0 } });
        res.status(200).json({ success: true, data: updatedChore });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
};

export const deleteChore = async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Chore Id"});
    }

    try {
        await Chore.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Chore was deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
}; 

export const delayChore = async (id) => {
    if (!ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Chore Id"});
    }

    try {
        const updatedChore = await Chore.findByIdAndUpdate(id, { $set: { currentQueuePosition: 0 }, $inc: { nextOccurrence: 86400000 }});
        res.status(200).json({ success: true, data: updatedChore });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
};
