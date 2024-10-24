import express from "express";
import { createChore, getChore, updateChore, deleteChore } from "../controllers/chore.controller.js";

const router = express.Router();

router.get('/:id', getChore);
router.post('/', createChore);
router.put('/:id', updateChore);
router.delete('/:id', deleteChore);

export default router;