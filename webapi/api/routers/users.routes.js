import { Router } from "express";
import { getUserByParamId, getUsers } from "../controllers/users.js";

const router = Router();

router.get('/users', getUsers);
router.get('/users/:id', getUserByParamId);

export default router;
