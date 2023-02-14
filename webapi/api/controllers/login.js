import { pool } from "../../db/db.js";
import { validationResult } from "express-validator";
import { getUserByCredentials, getUserById } from "./users.js";
import { createToken, verifyToken } from "../utils/tokens.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req);

    // Si no tenemos ningun token, vemos si los campos estan completos
    if (!errors.isEmpty()) {
      const { msg } = errors.errors[0];
      return res.send(msg);
    }

    // Si no tenemos ningun token, entonces buscamos el usuario en la bd
    const user = await getUserByCredentials(email, password);

    if (!user) {
      return res.send("Usuario y/o contraseña invalidos").status(400);
    }
    // Si el usuario existe, generamos el token y lo enviamos
    const token = createToken(user);
    res.send({ user: await getUserById(user.id), token });
  } catch (error) {
    res.send(error.message).status(500);
  }
};

