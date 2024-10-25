import express from "express";
import { createUser, getUser, updateUser, deleteUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get('/:id', getUser);
// router.get('/user/households/:id', getUserHouseholds);
// router.get('/user/chores/:id', getUserChores);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;