import express from "express";
import userRouter from "./api/routers/users.routes.js";
import authRouter from "./api/routers/auth.routes.js";
import signupRouter from "./api/routers/signup.routes.js"
import postsRouter from "./api/routers/posts.routes.js"
import bodyParser from "body-parser";
import { PORT } from "./config.js";


const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(userRouter);
app.use(authRouter);
app.use(signupRouter);
app.use(postsRouter);

app.get("/", async (req, res) => {
  res.send('Hello world').status(200)
});

app.listen(PORT, () => {
  console.log(`Escuchando en puerto: ${PORT}`);
});
