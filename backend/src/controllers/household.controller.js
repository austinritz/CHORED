import mongoose from 'mongoose';
import Household from '../models/Household.js';
import User from '../models/User.js';
import Chore from '../models/Chore.js';

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
Returns the full list of populated chore objects
*/
export const getHouseholdChores = async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Household Id"});
    }

    try {
        const retrievedHousehold = await Household.findById(id)
            .populate('chores');
        if (retrievedHousehold === null) {
            return res.status(404).json({ success: false, message: "Household does not exist"});
        }
        res.status(200).json({ success: true, data: retrievedHousehold.chores });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error});
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

    console.log("household: ", household);

    if (!household.name || !household.description) {
        return res.status(400).json({ success: false, message: "Please provide all fields"});
    }

    // Use a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const newHousehold = new Household(household);
        await newHousehold.save({ session });

        // Update users if userIds are provided
        if (household.users?.length) {
            const updateUsers = await User.updateMany(
                { _id: { $in: household.users } },
                { $push: { households: new mongoose.Types.ObjectId(newHousehold._id) } },
                { session }
            );

            // Verify that all users were updated
            if (updateUsers.modifiedCount !== household.users.length) {
                throw new Error('Some users could not be updated');
            }
        }

        // Commit the transaction
        await session.commitTransaction();
        
        res.status(201).json({ success: true, data: newHousehold});
    } catch (error) {
        // Rollback the transaction on error
        await session.abortTransaction();
        
        console.error('Error in Create Household', error.message);
        res.status(500).json({ success: false, message: "Server Error", error: error.message});
    } finally {
        // End the session
        session.endSession();
    }
};
    
export const updateHousehold = async (req, res) => {
    const { id } = req.params;

    const household = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Household Id"});
    }

    // Use a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Fetch the existing household to compare users
        const existingHousehold = await Household.findById(id).session(session);
        if (existingHousehold === null) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ success: false, message: "Household does not exist"});
        }

        const oldUserIds = existingHousehold.users.map(userId => userId.toString());
        const newUserIds = household.users?.map(userId => userId.toString()) || [];

        // Find users to remove (in old but not in new)
        const usersToRemove = oldUserIds.filter(userId => !newUserIds.includes(userId));
        // Find users to add (in new but not in old)
        const usersToAdd = newUserIds.filter(userId => !oldUserIds.includes(userId));

        // Update the household
        const updatedHousehold = await Household.findByIdAndUpdate(
            id, 
            household,
            { new: true, session }
        );

        // Remove household from users who are no longer in the household
        if (usersToRemove.length > 0) {
            const removeResult = await User.updateMany(
                { _id: { $in: usersToRemove } },
                { $pull: { households: new mongoose.Types.ObjectId(id) } },
                { session }
            );

            // Verify that all users were updated
            if (removeResult.modifiedCount !== usersToRemove.length) {
                throw new Error('Some users could not be removed from household');
            }
        }

        // Add household to users who are newly added
        if (usersToAdd.length > 0) {
            const addResult = await User.updateMany(
                { _id: { $in: usersToAdd } },
                { $push: { households: new mongoose.Types.ObjectId(id) } },
                { session }
            );

            // Verify that all users were updated
            if (addResult.modifiedCount !== usersToAdd.length) {
                throw new Error('Some users could not be added to household');
            }
        }

        // Commit the transaction
        await session.commitTransaction();
        
        res.status(200).json({ success: true, data: updatedHousehold });
    } catch (error) {
        // Rollback the transaction on error
        await session.abortTransaction();
        
        console.error('Error in Update Household', error.message);
        res.status(500).json({ success: false, message: "Server Error", error: error.message});
    } finally {
        // End the session
        session.endSession();
    }
};

export const deleteHousehold = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Household Id"});
    }

    // Use a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Fetch the household first to get related users
        const householdToDelete = await Household.findById(id).session(session);
        if (householdToDelete === null) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ success: false, message: "Household does not exist"});
        }

        const userIds = householdToDelete.users?.map(userId => userId.toString()) || [];

        // Find all chores in this household
        const choresToDelete = await Chore.find({ household: new mongoose.Types.ObjectId(id) }).session(session);
        
        // For each chore, remove it from User.chores arrays
        // Collect all unique user IDs from all chores
        const allChoreUserIds = new Set();
        for (const chore of choresToDelete) {
            if (chore.users && Array.isArray(chore.users)) {
                chore.users.forEach(userObj => {
                    if (userObj.user) {
                        allChoreUserIds.add(userObj.user.toString());
                    }
                });
            }
        }

        // Remove all chores from User.chores arrays
        if (allChoreUserIds.size > 0 && choresToDelete.length > 0) {
            const choreIds = choresToDelete.map(chore => chore._id);
            const updateUsers = await User.updateMany(
                { _id: { $in: Array.from(allChoreUserIds) } },
                { $pullAll: { chores: choreIds } },
                { session }
            );
        }

        // Delete all chores in the household
        if (choresToDelete.length > 0) {
            const choreIds = choresToDelete.map(chore => chore._id);
            await Chore.deleteMany({ _id: { $in: choreIds } }).session(session);
        }

        // Remove household from User.households arrays
        if (userIds.length > 0) {
            const updateUsers = await User.updateMany(
                { _id: { $in: userIds } },
                { $pull: { households: new mongoose.Types.ObjectId(id) } },
                { session }
            );

            // Verify that all users were updated
            if (updateUsers.modifiedCount !== userIds.length) {
                throw new Error('Some users could not be updated');
            }
        }

        // Delete the household
        await Household.findByIdAndDelete(id).session(session);

        // Commit the transaction
        await session.commitTransaction();

        res.status(200).json({ success: true, message: "Household was deleted" });
    } catch (error) {
        // Rollback the transaction on error
        await session.abortTransaction();
        
        console.error('Error in Delete Household', error.message);
        res.status(500).json({ success: false, message: "Server Error", error: error.message});
    } finally {
        // End the session
        session.endSession();
    }
};