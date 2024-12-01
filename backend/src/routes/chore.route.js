import express from "express";
import { createChore, getChore, updateChore, deleteChore, getCurrentChoreUser } from "../controllers/chore.controller.js";

const router = express.Router();

router.get('/:id', getChore);
router.post('/', createChore);
router.post('/user/:id', getCurrentChoreUser);
router.put('/:id', updateChore);
router.delete('/:id', deleteChore);

export default router;