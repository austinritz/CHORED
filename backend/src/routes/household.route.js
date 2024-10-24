import express from "express";
import { createHousehold, getHousehold, getUserHouseholds, getChoreHousehold, updateHousehold, deleteHousehold } from "../controllers/household.controller.js";

const router = express.Router();

router.get('/:id', getHousehold);
router.get('/user/:id', getUserHouseholds);
router.get('/chore/:id', getChoreHousehold);
router.post('/', createHousehold);
router.put('/:id', updateHousehold);
router.delete('/:id', deleteHousehold);

export default router;