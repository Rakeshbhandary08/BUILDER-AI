import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser"
import { connectToDatabase } from "./config/db.js";

const app=express();

//Use the middleware
app.use(cors({origin:process.env.ORIGINS.split(","),credentials:true}))
app.use(express.json())
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.send("AI BUILDER")
})

//Centralized error handler
app.use((err,_req,res,_next)=>{
    console.log(`[Error] ${err.message}`)
    res.status(500).json({error:err.message})
})

const port=process.env.PORT || 4000;

app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
    connectToDatabase();
})