import mongoose from 'mongoose';
import Household from '../models/Household.js';

const ObjectId = mongoose.Types.ObjectId;

export const getHousehold = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Household Id"});
    }

    try {
        const retrievedHousehold = await Household.findById(id);
        if (retrievedHousehold === null) {
            return res.status(404).json({ success: false, message: "Household does not exist"});
        } 
        res.status(200).json({ success: true, data: retrievedHousehold });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
};

export const getUserHouseholds = async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid User Id"});
    }

    try {
        const retrievedHouseholds = await Household.find({ users: id }).exec();
        if (retrievedHouseholds.length === 0) {
            return res.status(404).json({ success: false, message: "User is not in any households"});
        }
        res.status(200).json({ success: true, data: retrievedHouseholds });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
};

export const getChoreHousehold = async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Chore Id"});
    }

    try {
        const retrievedHouseholds = await Household.find({ chores: id }).exec();
        if (retrievedHouseholds.length === 0) {
            return res.status(404).json({ success: false, message: "Chore is not in any households"});
        } 
        res.status(200).json({ success: true, data: retrievedHouseholds });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
};

export const createHousehold = async (req, res) => {
    const household = req.body;

    if (!household.name || !household.description) {
        return res.status(400).json({ success: false, message: "Please provide all fields"});
    }

    const newHousehold = new Household(household);

    try {
        await newHousehold.save();
        res.status(201).json({ success: true, data: newHousehold});
    } catch (error) {
        console.error('Error in Create Household', error.message);
        res.status(500).json({ success: false, message: "Server Error"});
    }
};
    
export const updateHousehold = async (req, res) => {
    const { id } = req.params;

    const household = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Household Id"});
    }

    try {
        const updatedHousehold = await Household.findByIdAndUpdate(id, household,{new:true});
        res.status(200).json({ success: true, data: updatedHousehold });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
};

export const deleteHousehold = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Household Id"});
    }

    try {
        await Household.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Household was deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
};