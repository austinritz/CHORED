import express from "express";
import { createHousehold, getHousehold, updateHousehold, deleteHousehold, getHouseholdUserIds, getHouseholdUsers } from "../controllers/household.controller.js";

const router = express.Router();

router.get('/:id', getHousehold);
router.get('/:id/userIds', getHouseholdUserIds);
router.get('/:id/users', getHouseholdUsers);
router.post('/', createHousehold);
router.put('/:id', updateHousehold);
router.delete('/:id', deleteHousehold);

export default router;