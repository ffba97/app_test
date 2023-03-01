import { Router } from "express";
import { check } from "express-validator";
import { authentication, login } from "../controllers/auth.js";

const router = Router();

router.get("/login", (req, res) => {
  res.send("logear get");
});

router.post("/login", [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
],
login
);

router.post("/auth",
  authentication
)

export default router;
