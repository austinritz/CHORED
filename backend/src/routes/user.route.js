import express from "express";
import { createUser, getUser, updateUser, deleteUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get('/:id', getUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;