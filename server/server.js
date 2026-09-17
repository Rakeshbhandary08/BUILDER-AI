import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser"
import { connectToDatabase } from "./config/db.js";
import router from "./routes/authRoutes.js";
import projectRouter from "./routes/projectRoutes.js";


const app=express();

app.use(express.json())

//Use the middleware
const allowedOrigins = process.env.ORIGINS
  ? process.env.ORIGINS.split(",")
  : ["http://localhost:5173"];

app.use(cors({origin:allowedOrigins,credentials:true}))

app.use(cookieParser())

app.get("/",(req,res)=>{
    res.send("AI BUILDERrrrrrrrrrrrrrrrr")
})

app.use("/api/auth",router)
app.use("/api/projects",projectRouter)

//Centralized error handler
app.use((err,_req,res,_next)=>{
    console.log(`[Error] ${err.message}`)
    res.status(500).json({error:err.message})
})

const port=parseInt(process.env.PORT) || 5000


async function startServer(){
    try {
        await connectToDatabase();
        app.listen(port,()=>{console.log(`Server is running at http://localhost:${port};`)})
    } catch (error) {
       console.log("Failed to database",error) ;
       process.exit(1)
    }
    
}

startServer()