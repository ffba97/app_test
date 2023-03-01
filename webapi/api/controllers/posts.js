import { validationResult } from "express-validator";
import { pool } from "../../db/db.js";
import { authentication, authTkn } from "./auth.js";
export const getPosts = async (req, res) => {
  try {
    let { p } = req.params;

    if (!p) p = 0;
    console.log(p);
    const base_id = p * 10;
    const { rows } = await pool.query(
      "SELECT id, title FROM posts WHERE id>=$1 ORDER BY id DESC LIMIT 10",
      [base_id]
    );
    res.json(rows);
  } catch (error) {
    res.send(error.message).status(500);
  }
};

export const newPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const { msg } = errors.errors[0];
      return res.send(msg);
    }
    const { tkn } = req.headers;
    const { title, content } = req.body;
    const user = await authTkn(tkn);

    if (!user) {
      return res.send("Registrate o inicia sesion");
    }
    res.send("post hecho");
  } catch (error) {
    res.send(error.message).status(500);
  }
};
