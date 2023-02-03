import { ENCRYPT_ROUNDS } from "../../config.js";
import { pool } from "../../db/db.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM usersVw");
    res.json(rows[0]);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
};

export const getUserById = async(id) =>{
  const { rows } = await pool.query("SELECT * FROM usersVw WHERE id=$1",[id]);
  return rows[0];
}

export const getUserByCredentials = async (username, password, err) => {
  try {
    console.log("Obteniendo usuario por credenciales");
    const { rows } = await pool.query("SELECT * FROM users WHERE email=$1", [
      username,
    ]);

    if(!rows[0]){
        return null;
    }

    const compare = bcrypt.compareSync(password, rows[0].password, (e)=>console.log(e));
    
    if (compare) {
      return rows[0];
    }

    return null;
  } catch (error) {
    console.log(error.message);
  }
};

export const postUser = async (req, res) => {
  try {
    const { username, password,email, id_rol } = req.body;
    const passwordEncrypt = bcrypt.hashSync(password, ENCRYPT_ROUNDS);
    await pool.query("call createuser($1,$2,$3,$4)", [
      username,
      passwordEncrypt,
      email,
      id_rol,
    ]);
    console.log("Usuario creado con exito");
    res.status(201).send("Usuario creado con exito");
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
};
