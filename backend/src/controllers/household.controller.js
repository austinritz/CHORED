import mongoose from 'mongoose';
import Household from '../models/Household.js';

const ObjectId = mongoose.Types.ObjectId;

export const getHousehold = async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Household Id"});
    }

    try {
        const retrievedHousehold = await Household.findById(id)
            .populate('chores')
            .populate('users');
        if (retrievedHousehold === null) {
            return res.status(404).json({ success: false, message: "Household does not exist"});
        }
        res.status(200).json({ success: true, data: retrievedHousehold });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
};

/*
Returns the full list of populated user objects
*/
export const getHouseholdUsers = async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Household Id"});
    }

    try {
        const retrievedHousehold = await Household.findById(id)
            .populate('users');
        if (retrievedHousehold === null) {
            return res.status(404).json({ success: false, message: "Household does not exist"});
        }
        res.status(200).json({ success: true, data: retrievedHousehold.users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
};

/*
Returns full list of User object ids
*/
export const getHouseholdUserIds = async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Household Id"});
    }

    try {
        const retrievedHousehold = await Household.findById(id);
        if (retrievedHousehold === null) {
            return res.status(404).json({ success: false, message: "Household does not exist"});
        }
        res.status(200).json({ success: true, data: retrievedHousehold.users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
};

/*
* I'm going to explore just using get* with a fully populated response
*/

// export const getHouseholdWithUsers = async (req, res) => {
//     const { id } = req.params;

//     if (!ObjectId.isValid(id)) {
//         return res.status(404).json({ success: false, message: "Invalid Household Id"});
//     }

//     try {
//         const retrievedHousehold = await Household.findById(id).populate('users');
//         if (retrievedHousehold === null) {
//             return res.status(404).json({ success: false, message: "Household does not exist"});
//         }
//         res.status(200).json({ success: true, data: retrievedHousehold });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Server Error"});
//     }
// };

// export const getHouseholdWithChores = async (req, res) => {
//     const { id } = req.params;

//     if (!ObjectId.isValid(id)) {
//         return res.status(404).json({ success: false, message: "Invalid Household Id"});
//     }

//     try {
//         const retrievedHousehold = await Household.findById(id).populate('chores');
//         if (retrievedHousehold === null) {
//             return res.status(404).json({ success: false, message: "Household does not exist"});
//         }
//         res.status(200).json({ success: true, data: retrievedHousehold });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Server Error"});
//     }
// };

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