import { ENCRYPT_ROUNDS } from "../../config.js";
import bcrypt from 'bcrypt';
import { pool } from '../../db/db.js';

export const signupGet = (req,res)=>{
    res.send('Regsitrar usuario').status(200);
}
export const signup = async (req, res) => {
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