import mongoose from 'mongoose';
import Chore from '../models/Chore.js';
import User from '../models/User.js';
import Household from '../models/Household.js';


const ObjectId = mongoose.Types.ObjectId;

// Formats an entire chore object by adding queue positions to users
const formatNewChore = (unformattedChore) => {
    // Create a deep copy of the chore to avoid mutating the original
    const formattedChore = { ...unformattedChore };
    
    // If no users provided, set empty array and return
    if (!formattedChore.users || formattedChore.users.length === 0) {
      formattedChore.users = [];
      return formattedChore;
    }
  
    // Create array of indices and shuffle them for random queue positions
    const positions = Array.from({ length: formattedChore.users.length }, (_, i) => i);
    for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
    }
  
    // Map each user ID to an object with random queue position
    formattedChore.users = formattedChore.users.map((userId, index) => ({
        positionInQueue: positions[index],
        user: new mongoose.Types.ObjectId(userId)
    }));
  
    return formattedChore;
};

export const getChore = async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Chore Id"});
    }

    try {
        const retrievedChore = await Chore.findById(id);
        if (retrievedChore === null) {
            return res.status(404).json({ success: false, message: "Chore does not exist"});
        }
        res.status(200).json({ success: true, data: retrievedChore });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
};

export const getPopulatedChore = async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Chore Id"});
    }

    try {
        const retrievedChore = await Chore.findById(id)
            .populate({
                path: 'users',			
                populate: { 
                    path: 'user',
                    model: 'User'
                }
            })
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
            .populate({
                path: 'users',			
                populate: { 
                    path: 'user',
                    model: 'User'
                }
            });
        if (retrievedChore === null) {
            return res.status(404).json({ success: false, message: "Chore does not exist"});
        }
        if (retrievedChore.users === null) {
            return res.status(404).json({ success: false, message: "Chore has no users"});
        }
        const currentChoreUser = retrievedChore.users.filter(user => user.positionInQueue === retrievedChore.currentQueuePosition)[0]?.user;
        res.status(200).json({ success: true, data: currentChoreUser });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
};


/*
* This endpoint expects:
* 1. Chore name, description, (opt) frequency, etc
* 2. Users (ids) attached to the chore
* 3. A household for the chore
*/
export const createChore = async (req, res) => {
    const chore = req.body;
    
    // Validate required fields
    if (!chore.name || !chore.description) {
        return res.status(400).json({ 
            success: false, 
            message: "Please provide all fields"
        });
    }

    // Validate that we have either users or household (depending on your requirements)
    if (chore.users?.length == 0 && !chore.householdId) {
        return res.status(400).json({
            success: false,
            message: "Chore must be assigned to at least one user or household"
        });
    }

    // Use a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const formattedChore = formatNewChore(chore);
        // Create the new chore
        const newChore = new Chore(formattedChore);
        await newChore.save({ session });

        // Update users if userIds are provided
        if (chore.users?.length) {
            const updateUsers = await User.updateMany(
                { _id: { $in: chore.users } },
                { $push: { chores: new mongoose.Types.ObjectId(newChore._id) } },
                { session }
            );

            // Verify that all users were updated
            if (updateUsers.modifiedCount !== chore.users.length) {
                throw new Error('Some users could not be updated');
            }
        }

        if (chore.household) {
            const updateHousehold = await Household.updateOne(
                { _id: { $in: chore.household } },
                { $push: { chores: new mongoose.Types.ObjectId(newChore._id) } },
                { session }
            );

            if (!updateHousehold.modifiedCount) {
                throw new Error('Household could not be updated');
            }
        }

        // Commit the transaction
        await session.commitTransaction();
        
        // Send response
        res.status(201).json({ 
            success: true, 
            data: newChore
        });

    } catch (error) {
        // Rollback the transaction on error
        await session.abortTransaction();
        
        console.error('Error in Create Chore:', error.message);
        res.status(500).json({ 
            success: false,
            message: "Server Error",
            error: error.message
        });

    } finally {
        // End the session
        session.endSession();
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
