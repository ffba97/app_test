import express from "express";
import bodyParser from "body-parser";
import { PORT } from "./config.js";
import { pool } from "./db/db.js";
import userRouter from "./api/routers/users.routes.js";
import loginRouter from "./api/routers/login.routes.js";
import bcrypt from "bcrypt";

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(userRouter);
app.use(loginRouter);

app.get("/", async (req, res) => {
  try {
    let pass = "holamundo";
    let encrypt = bcrypt.hashSync(pass, 10);
    let compare = bcrypt.compareSync(
      pass,
      "$2b$10$.zVrrSR3/9chvzpe0xJ66u9l19psfNGCQvO/uPV/XrGtBlp20OEEa",
      (e) => {
        console.log(e);
      }
    );
    res.json({
      pass,
      encrypt,
      compare,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Escuchando en puerto: ${PORT}`);
});
