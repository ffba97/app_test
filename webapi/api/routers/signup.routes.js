import { Router } from "express";
import { signup, signupGet } from "../controllers/signup.js";

const router = Router();

router.post("/signup", signupGet);
router.get('/signup', signup);

export default router;