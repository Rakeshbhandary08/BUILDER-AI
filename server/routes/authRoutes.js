import express from "express";
import { login, logout, me, register } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createProject } from "../controllers/projectController.js";


const router=express.Router();


router.post("/register",register)
router.post("/login",login)
router.post("/logout",logout)
router.post("/me",authMiddleware,me)


export default router;