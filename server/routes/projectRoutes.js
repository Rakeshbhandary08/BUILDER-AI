import express from 'express'
import { createProject, deleteProject, getProject, getPublicProject, listProjects, publishProject, updateProject } from '../controllers/projectController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { chat } from '../controllers/chatController.js'
import rateLimiter from 'express-rate-limit'


const projectRouter=express.Router()

projectRouter.get("/public/:id",authMiddleware,getPublicProject)

//Project all following routes
projectRouter.use(authMiddleware)

// Strict limiter for AI generation / creation
const aiCreationLimiter=rateLimiter({
    windowMs:5*60*1000,
    max:5,
    message:{error:"Too many websites generated. Please wait a few minutes before trying again."}
})


projectRouter.post("/",authMiddleware,aiCreationLimiter,createProject)
projectRouter.get("/",listProjects)
projectRouter.get("/:id",getProject);
projectRouter.delete("/:id",deleteProject)
projectRouter.put("/:id/files",updateProject)
projectRouter.post("/:id/publish",publishProject)

//Chat
projectRouter.post("/:id/chat",chat)

export default projectRouter
