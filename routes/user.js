import express from "express";
import { loginOrSignup } from "../controllers/user.js";
const router = express.Router();
router.get('/login',loginOrSignup);

export default router;