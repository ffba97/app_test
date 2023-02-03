import { pool } from "../../db/db.js";
import { validationResult } from "express-validator";
import { getUserByCredentials, getUserById } from "./users.js";
import { createToken, verifyToken } from "../utils/tokens.js";

export const login = async (req, res) => {
  try {
    const { email, password, tokenlogin } = req.body;
    const errors = validationResult(req);

    // Si tenenoms token de login, verificamos
    if (tokenlogin) {
      // Si el token es valido, tendra el id del usuario dentro
      const { id } = verifyToken(tokenlogin);
      // si el id no existe, entonces el token es invalido
      if (id) {
        // obtenemos el usuario que posee el id
        const user = await getUserById(id);
        // devolvemos el usuario
        if (user) {
          return res.send(user);
        }
      }
    }
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
