import express from "express";
import { createHousehold, getHousehold, updateHousehold, deleteHousehold, getHouseholdUserIds, getHouseholdUsers, getHouseholdChores } from "../controllers/household.controller.js";

const router = express.Router();

router.get('/:id', getHousehold);
router.get('/userIds/:id', getHouseholdUserIds);
router.get('/users/:id', getHouseholdUsers);
router.get('/chores/:id', getHouseholdChores);
router.post('/', createHousehold);
router.put('/:id', updateHousehold);
router.delete('/:id', deleteHousehold);

export default router;