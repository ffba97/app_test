import { ENCRYPT_ROUNDS } from "../../config.js";
import { pool } from "../../db/db.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM usersVw");
    res.json(rows);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
};

// Se usa en users.routes
export const getUserByParamId = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    res.json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Devuelve el usuario en base al ID del mismo
export const getUserById = async (id) => {
  try {
    const { rows } = await pool.query("Select * FROM usersVw WHERE id=$1", [
      id,
    ]);
    return rows[0];
  } catch (error) {
    return error.message;
  }
};

// Devuelve el obj usuario correspondiente al email y a la contraseña que recibe como parametro
export const getUserByCredentials = async (email, password, err) => {
  try {
    console.log("Obteniendo usuario por credenciales");
    const { rows } = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (!rows[0]) {
      return null;
    }

    const compare = bcrypt.compareSync(password, rows[0].password, (e) =>
      console.log(e)
    );
    if (compare) {
      return rows[0];
    }

    return null;
  } catch (error) {
    console.log(error.message);
  }
};
