import { Router } from "express";
import { getPosts, newPost } from "../controllers/posts.js";
import { check } from "express-validator";
const router = Router();

router.get('/posts/', getPosts);
router.get('/posts/:p', getPosts);
router.post('/posts',
[
    check('title', 'Se necesita un titulo').not().isEmpty() ,
    check('content', 'Se necesita contenido').not().isEmpty()
],
newPost);

export default router;