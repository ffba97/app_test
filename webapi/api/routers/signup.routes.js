import { Router } from "express";
import { signup, signupGet } from "../controllers/signup.js";

const router = Router();

router.post("/signup", signup);
router.get('/signup', signupGet);

export default router;