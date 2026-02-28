import express from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { loginSchema, signupSchema } from "./auth.schema.js";
import { login, signup } from "./auth.controller.simple.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);

export default router;
