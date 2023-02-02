
import { pool } from "../../db/db.js"
import bcrypt from 'bcrypt'
export const getUsers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM usersVw');
        res.json(rows);
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message)
    }
}

export const postUser = async(req,res) => {
    try {
        const {username, password, id_rol} = req.body;
        const result = await pool.query('');

        password = b

        console.log(result);
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message)
    }
}