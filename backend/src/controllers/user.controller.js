import mongoose from 'mongoose';
import User from '../models/User.js';
import Household from '../models/Household.js';
import Chore from '../models/Chore.js';

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

    // Use a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Fetch the existing user to compare households and chores
        const existingUser = await User.findById(id).session(session);
        if (existingUser === null) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        const oldHouseholdIds = existingUser.households?.map(householdId => householdId.toString()) || [];
        const oldChoreIds = existingUser.chores?.map(choreId => choreId.toString()) || [];

        // Only update relationships if they are explicitly provided in the update
        const householdsProvided = user.hasOwnProperty('households');
        const choresProvided = user.hasOwnProperty('chores');

        const newHouseholdIds = householdsProvided ? (user.households?.map(householdId => householdId.toString()) || []) : oldHouseholdIds;
        const newChoreIds = choresProvided ? (user.chores?.map(choreId => choreId.toString()) || []) : oldChoreIds;

        // Find households to remove (in old but not in new) - only if households were provided
        const householdsToRemove = householdsProvided ? oldHouseholdIds.filter(householdId => !newHouseholdIds.includes(householdId)) : [];
        // Find households to add (in new but not in old) - only if households were provided
        const householdsToAdd = householdsProvided ? newHouseholdIds.filter(householdId => !oldHouseholdIds.includes(householdId)) : [];

        // Find chores to remove (in old but not in new) - only if chores were provided
        const choresToRemove = choresProvided ? oldChoreIds.filter(choreId => !newChoreIds.includes(choreId)) : [];
        // Find chores to add (in new but not in old) - only if chores were provided
        const choresToAdd = choresProvided ? newChoreIds.filter(choreId => !oldChoreIds.includes(choreId)) : [];

        // Update the user
        const updatedUser = await User.findByIdAndUpdate(
            id,
            user,
            { new: true, session }
        );

        // Remove user from households who are no longer associated
        if (householdsToRemove.length > 0) {
            const removeHouseholdResult = await Household.updateMany(
                { _id: { $in: householdsToRemove } },
                { $pull: { users: new mongoose.Types.ObjectId(id) } },
                { session }
            );

            // Verify that all households were updated
            if (removeHouseholdResult.modifiedCount !== householdsToRemove.length) {
                throw new Error('Some households could not be updated');
            }
        }

        // Add user to households who are newly associated
        if (householdsToAdd.length > 0) {
            const addHouseholdResult = await Household.updateMany(
                { _id: { $in: householdsToAdd } },
                { $push: { users: new mongoose.Types.ObjectId(id) } },
                { session }
            );

            // Verify that all households were updated
            if (addHouseholdResult.modifiedCount !== householdsToAdd.length) {
                throw new Error('Some households could not be updated');
            }
        }

        // Remove user from chores who are no longer associated
        if (choresToRemove.length > 0) {
            // Remove from Chore.users nested array
            const removeChoreResult = await Chore.updateMany(
                { _id: { $in: choresToRemove } },
                { $pull: { users: { user: new mongoose.Types.ObjectId(id) } } },
                { session }
            );

            // Note: modifiedCount might be less than choresToRemove.length if some chores don't have this user
            // This is acceptable as the user might have been removed from some chores already
        }

        // Add user to chores who are newly associated
        if (choresToAdd.length > 0) {
            // For each chore, add the user with a positionInQueue
            // We'll use the current length of the users array as the position
            for (const choreId of choresToAdd) {
                const chore = await Chore.findById(choreId).session(session);
                if (chore) {
                    const positionInQueue = chore.users?.length || 0;
                    await Chore.updateOne(
                        { _id: choreId },
                        { $push: { users: { user: new mongoose.Types.ObjectId(id), positionInQueue } } },
                        { session }
                    );
                }
            }
        }

        // Commit the transaction
        await session.commitTransaction();

        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        // Rollback the transaction on error
        await session.abortTransaction();
        
        console.error('Error in Update User', error.message);
        res.status(500).json({ success: false, message: "Server Error", error: error.message});
    } finally {
        // End the session
        session.endSession();
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid User Id"});
    }

    // Use a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Fetch the user first to get related households and chores
        const userToDelete = await User.findById(id).session(session);
        if (userToDelete === null) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ success: false, message: "User does not exist"});
        }

        const householdIds = userToDelete.households?.map(householdId => householdId.toString()) || [];
        const choreIds = userToDelete.chores?.map(choreId => choreId.toString()) || [];

        // Remove user from Household.users arrays
        if (householdIds.length > 0) {
            const updateHouseholds = await Household.updateMany(
                { _id: { $in: householdIds } },
                { $pull: { users: new mongoose.Types.ObjectId(id) } },
                { session }
            );

            // Verify that all households were updated
            if (updateHouseholds.modifiedCount !== householdIds.length) {
                throw new Error('Some households could not be updated');
            }
        }

        // Remove user from Chore.users arrays (nested structure)
        if (choreIds.length > 0) {
            const updateChores = await Chore.updateMany(
                { _id: { $in: choreIds } },
                { $pull: { users: { user: new mongoose.Types.ObjectId(id) } } },
                { session }
            );

            // Note: modifiedCount might be less than choreIds.length if some chores don't have this user
            // This is acceptable as the user might have been removed from some chores already
        }

        // Also remove user from any chore that has this user in the nested users array
        // (in case the user.chores array is out of sync)
        const updateAllChores = await Chore.updateMany(
            { 'users.user': new mongoose.Types.ObjectId(id) },
            { $pull: { users: { user: new mongoose.Types.ObjectId(id) } } },
            { session }
        );

        // Delete the user
        await User.findByIdAndDelete(id).session(session);

        // Commit the transaction
        await session.commitTransaction();

        res.status(200).json({ success: true, message: "User was deleted" });
    } catch (error) {
        // Rollback the transaction on error
        await session.abortTransaction();
        
        console.error('Error in Delete User', error.message);
        res.status(500).json({ success: false, message: "Server Error", error: error.message});
    } finally {
        // End the session
        session.endSession();
    }
};
