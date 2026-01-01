import mongoose from 'mongoose';
import Chore from '../models/Chore.js';
import User from '../models/User.js';
import Household from '../models/Household.js';
import { scheduleChoreNotification, editChoreNotification, cancelChoreNotification } from '../queues/jobs/jobHandler.js'


const ObjectId = mongoose.Types.ObjectId;

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

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

        const notificationResult = await scheduleChoreNotification(newChore);
        // TODO: check notification result to see if bullmq was successful

        // Commit the transaction
        await session.commitTransaction();
        
        // TODO: Create bullMQ job 
        // A chore should exist in the chore database and our bullqueue
        // These should never be out of sync
        
        res.status(201).json({ 
            success: true, 
            data: newChore
        });
        console.log("Chore id from constroller: ", newChore._id);
        console.log("another test", newChore._id.toString());

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

    const choreUpdate = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Chore Id"});
    }

    // Use a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Fetch the existing chore to compare users and household
        const existingChore = await Chore.findById(id).session(session);
        if (existingChore === null) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ success: false, message: "Chore not found" });
        }

        // Extract old user IDs from nested structure
        const oldUserIds = existingChore.users?.map(userObj => userObj.user.toString()) || [];
        const oldHouseholdId = existingChore.household?.toString() || null;

        // Format the chore update if users are provided (might be raw IDs)
        let formattedChoreUpdate = { ...choreUpdate };
        const usersProvided = choreUpdate.hasOwnProperty('users');
        const householdProvided = choreUpdate.hasOwnProperty('household');
        
        if (usersProvided && Array.isArray(choreUpdate.users) && choreUpdate.users.length > 0) {
            // Check if users are already formatted (have user property) or raw IDs
            const isFormatted = choreUpdate.users[0]?.user || typeof choreUpdate.users[0] === 'object';
            if (!isFormatted) {
                // Format users if they're raw IDs
                formattedChoreUpdate = formatNewChore(choreUpdate);
            }
        }

        // Extract new user IDs (handle both formats) - only if users were provided
        let newUserIds = [];
        if (usersProvided && formattedChoreUpdate.users && Array.isArray(formattedChoreUpdate.users)) {
            newUserIds = formattedChoreUpdate.users.map(userObj => {
                // Handle both nested structure and raw IDs
                if (typeof userObj === 'string') {
                    return userObj;
                }
                return userObj.user?.toString() || userObj.toString();
            });
        }
        const newHouseholdId = householdProvided ? (formattedChoreUpdate.household?.toString() || null) : oldHouseholdId;

        // Find users to remove (in old but not in new) - only if users were provided
        const usersToRemove = usersProvided ? oldUserIds.filter(userId => !newUserIds.includes(userId)) : [];
        // Find users to add (in new but not in old) - only if users were provided
        const usersToAdd = usersProvided ? newUserIds.filter(userId => !oldUserIds.includes(userId)) : [];

        // Update the chore
        const updatedChore = await Chore.findByIdAndUpdate(
            id,
            formattedChoreUpdate,
            { new: true, session }
        );

        // Remove chore from users who are no longer in the chore
        if (usersToRemove.length > 0) {
            const removeResult = await User.updateMany(
                { _id: { $in: usersToRemove } },
                { $pull: { chores: new mongoose.Types.ObjectId(id) } },
                { session }
            );

            // Verify that all users were updated
            if (removeResult.modifiedCount !== usersToRemove.length) {
                throw new Error('Some users could not be removed from chore');
            }
        }

        // Add chore to users who are newly added
        if (usersToAdd.length > 0) {
            const addResult = await User.updateMany(
                { _id: { $in: usersToAdd } },
                { $push: { chores: new mongoose.Types.ObjectId(id) } },
                { session }
            );

            // Verify that all users were updated
            if (addResult.modifiedCount !== usersToAdd.length) {
                throw new Error('Some users could not be added to chore');
            }
        }

        // Handle household changes - only if household was provided
        if (householdProvided && oldHouseholdId !== newHouseholdId) {
            // Remove chore from old household
            if (oldHouseholdId) {
                const removeHouseholdResult = await Household.updateOne(
                    { _id: oldHouseholdId },
                    { $pull: { chores: new mongoose.Types.ObjectId(id) } },
                    { session }
                );

                if (!removeHouseholdResult.modifiedCount) {
                    throw new Error('Old household could not be updated');
                }
            }

            // Add chore to new household
            if (newHouseholdId) {
                const addHouseholdResult = await Household.updateOne(
                    { _id: newHouseholdId },
                    { $push: { chores: new mongoose.Types.ObjectId(id) } },
                    { session }
                );

                if (!addHouseholdResult.modifiedCount) {
                    throw new Error('New household could not be updated');
                }
            }
        }

        // Commit the transaction
        await session.commitTransaction();

        // Update notification (outside transaction as it's external)
        const updatedChoreNotification = await editChoreNotification(updatedChore);

        res.status(200).json({ success: true, data: updatedChore });
    } catch (error) {
        // Rollback the transaction on error
        await session.abortTransaction();
        
        console.error('Error in Update Chore', error.message);
        res.status(500).json({ success: false, message: "Server Error", error: error.message});
    } finally {
        // End the session
        session.endSession();
    }
};

// Move the queue to the next person.
// If no more users are in the queue, then it will call the delay function (which resets the queue and puts the date to the next day)
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
        if (!updatedChore) {
            return res.status(404).json({ success: false, message: "Chore not found" });
        }
        const updatedChoreNotification = await editChoreNotification(updatedChore);
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

        if (!updatedChore) {
            return res.status(404).json({ success: false, message: "Chore not found" });
        }
        
        const updatedChoreNotification = await editChoreNotification(updatedChore);
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

    // Use a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Fetch the chore first to get related users and household
        const choreToDelete = await Chore.findById(id).session(session);
        if (choreToDelete === null) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ success: false, message: "Chore does not exist"});
        }

        // Extract user IDs from the nested structure
        const userIds = choreToDelete.users?.map(userObj => userObj.user.toString()) || [];
        const householdId = choreToDelete.household?.toString();

        // Remove chore from User.chores arrays
        if (userIds.length > 0) {
            const updateUsers = await User.updateMany(
                { _id: { $in: userIds } },
                { $pull: { chores: new mongoose.Types.ObjectId(id) } },
                { session }
            );

            // Verify that all users were updated
            if (updateUsers.modifiedCount !== userIds.length) {
                throw new Error('Some users could not be updated');
            }
        }

        // Remove chore from Household.chores array
        if (householdId) {
            const updateHousehold = await Household.updateOne(
                { _id: householdId },
                { $pull: { chores: new mongoose.Types.ObjectId(id) } },
                { session }
            );

            if (!updateHousehold.modifiedCount) {
                throw new Error('Household could not be updated');
            }
        }

        // Delete the chore
        await Chore.findByIdAndDelete(id).session(session);

        // Cancel notification (outside transaction as it's external)
        await cancelChoreNotification(id);

        // Commit the transaction
        await session.commitTransaction();

        res.status(200).json({ success: true, message: "Chore was deleted" });
    } catch (error) {
        // Rollback the transaction on error
        await session.abortTransaction();
        
        console.error('Error in Delete Chore', error.message);
        res.status(500).json({ success: false, message: "Server Error", error: error.message});
    } finally {
        // End the session
        session.endSession();
    }
}; 

export const delayChore = async (id) => {
    if (!ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Invalid Chore Id" });
    }
    
    try {
      const updatedChore = await Chore.findByIdAndUpdate(
        id, 
        { 
          $set: { currentQueuePosition: 0 }, 
          $inc: { nextOccurrence: ONE_DAY_MS }
        },
        { new: true }
      );
  
      if (!updatedChore) {
        return res.status(404).json({ success: false, message: "Chore not found" });
      }
      
      const updatedChoreNotification = await editChoreNotification(updatedChore);
      
      res.status(200).json({ success: true, data: updatedChore });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
