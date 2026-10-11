import express from "express";
import { login, logout, me, register } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import rateLimiter, { rateLimit } from "express-rate-limit"

const router=express.Router();

const authLimiter=rateLimiter({
    windowMs:2*60*1000,
    max:5,
    message:{error:"Too many login/register attempts. Please try again later."}
})

router.post("/register",authLimiter,register)
router.post("/login",authLimiter,login)
router.post("/logout",logout)
router.get("/me",authMiddleware,me)


export default router;