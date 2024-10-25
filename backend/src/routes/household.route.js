import express from "express";
import { createHousehold, getHousehold, updateHousehold, deleteHousehold } from "../controllers/household.controller.js";

const router = express.Router();

router.get('/:id', getHousehold);
// router.get('/:id/users', getHouseholdWithUsers);
// router.get('/:id/chores', getHouseholdWithChores);
router.post('/', createHousehold);
router.put('/:id', updateHousehold);
router.delete('/:id', deleteHousehold);

export default router;