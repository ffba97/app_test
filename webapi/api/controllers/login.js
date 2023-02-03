import { pool } from "../../db/db.js";
import { validationResult } from "express-validator";
import { getUserByCredentials } from "./users.js";
import { createToken } from "../utils/tokens.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const { msg } = errors.errors[0];
      return res.send(msg);
    }

    const user = await getUserByCredentials(email, password);
    if (!user) {
      return res.send("Usuario y/o contraseña invalidos").status(400);
    }
    const token = createToken(user);
    res.send(token.token);
  } catch (error) {
    res.send(error.message).status(500);
  }
};
