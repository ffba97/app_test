import { pool } from "../../db/db.js";
import { validationResult } from "express-validator";
import { getUserByCredentials, getUserById } from "./users.js";
import { createToken, verifyToken } from "../utils/tokens.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Verifica los campos
    const errors = validationResult(req);

    // Si no tenemos ningun token, vemos si los campos estan completos
    if (!errors.isEmpty()) {
      const { msg } = errors.errors[0];
      return res.send(msg);
    }

    // Obtenemos el usuario desde la BD
    const user = await getUserByCredentials(email, password);
    if (!user) {
      return res.send("Usuario y/o contraseña invalidos").status(400);
    }

    // Si el usuario existe, generamos el token y lo enviamos
    const token = createToken(user);
    res.send({ user: user.id, token });
  } catch (error) {
    res.send(error.message).status(500);
  }
};

// Valida el token y devuelve el obj usuario perteneciente
export const authentication = async (req, res) => {
  try {
    const { tkn } = req.headers;
    const result = auth(tkn);

    res.json(result);
  } catch (error) {
    res.send(error.message).status(500);
  }
};

export const authTkn = async (tkn) => {
  try {
    const verify = verifyToken(tkn);
    if (!verify.id) {
      return res.send("Token invalido");
    }
    return verify;
  } catch (error) {
    console.log(error.message);
  }
};
