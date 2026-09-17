import express from 'express'
import { createProject, deleteProject, getProject, getPublicProject, listProjects, publishProject, updateProject } from '../controllers/projectController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const projectRouter=express.Router()

projectRouter.get("/public/:id",authMiddleware,getPublicProject)

//Project all following routes
projectRouter.use(authMiddleware)

projectRouter.post("/",authMiddleware,createProject)
projectRouter.get("/",listProjects)
projectRouter.get("/:id",getProject);
projectRouter.delete("/:id",deleteProject)
projectRouter.put("/:id/files",updateProject)
projectRouter.post("/:id/publish",publishProject)


export default projectRouter
