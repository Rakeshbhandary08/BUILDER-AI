import express from "express";
import { login, logout, me, register } from "../controllers/authController.js";

const router=express.Router();


router.post("/register",register)
router.post("/login",login)
router.get("/logout",logout)
router.post("/me",me)

export default router;