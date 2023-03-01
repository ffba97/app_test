import { Router } from "express";
import { signup, signupGet } from "../controllers/signup.js";
import { check } from "express-validator";

const router = Router();

router.post("/signup", [
    check('username', 'Campo username requerido'),
    check('email', 'Campo email requerido'),
    check('password', 'Campo password requerido'),
    check('id_rol', 'Campo id_rol requerido')
]
,signup);
router.get('/signup', signupGet);

export default router;