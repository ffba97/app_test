import { validationResult } from "express-validator";
import { pool } from "../../db/db.js";
import { authentication, authTkn } from "./auth.js";

export const getPost = async(req,res)=>{
  try {
    const {id} = req.params;

    const {rows} = await pool.query('SELECT * FROM getPost($1)',[id]);
    // Si el post no existe en la BD, devolvemos un estado 404
    if(!(rows[0])) return res.send('Post not found').status(404);

    res.json(rows[0]);

  } catch (error) {
    res.send(error.message).status(500);
  }
}

export const getPosts = async (req, res) => {
  try {
    let { p } = req.params;

    if (!p) p = 0;
    const base_id = p == 0 ? 1 : p * 10;
    const { rows } = await pool.query(
      "SELECT * FROM vwPosts WHERE id>=$1 ORDER BY id DESC LIMIT 10",
      [base_id]
    );
    res.json(rows);
  } catch (error) {
    res.send(error.message).status(500);
  }
};

export const newPost = async (req, res) => {
  try {
    //

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const { msg } = errors.errors[0];
      return res.send(msg);
    }
    const { title, content } = req.body;

    const { tkn } = req.headers;
    const user = await authTkn(tkn);
    if (!user) {
      return res.send("Registrate o inicia sesion");
    }

    // Query del nuevo Post
    const result = await pool.query("call newPost($1, $2, $3)", [
      title,
      content,
      user.id,
    ]);

    res.send("post hecho");
  } catch (error) {
    res.send(error.message).status(500);
  }
};
