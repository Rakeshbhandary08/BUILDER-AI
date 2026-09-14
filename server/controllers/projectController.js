import projectModel from "../models/Project.js";

//**********   POST  /api/project

//create a new project from an AI Prompt
export async function createProject(req,res){
     const {prompt}=req.body;
     
     //if prompt is not present or invalid prompt
     if(!prompt ||typeof prompt === "string"){
        return res.status(400).json({error:"Prompt is required"})
     }

     //User authentication
     if(!req.user){
        res.status(401).json({error:"Unauthorized"})
     }

     //create project in DB immediately with "pending" status
     const project=projectModel.create({
        name:"Planning project...",
        description:prompt,
        files:{},
        messages:[ //Schema
            {role:"user",content:prompt},
            {role:"assistant",content:"Planning project structure..."}
        ],
        version:0,
        owner:req.user.userId,
        status:"pending",
        filesPlanned:[],
        currentFile:null,
        error:null
     })

     //Start background generation
     runBackgroundGeneration(project._id.toString(),prompt).catch((err)=>{
        console.log(`[Background AI] Fatal generation error for project ${project._id}:`,err)
     })

     req.status(201).json({_id:project._id,
                           name:project.name,
                           description:project.description,
                           files:{},
                           messages:project.messages,
                           version:project.version,
                           status:project.status,
                           filesPlanned:project.filesPlanned,
                           filesGenerated:project.filesGenerated,
                           currentFile:project.currentFile,
                           error:project.error,
                           createAt:project.createAt
                         })
}

//Background worker to progressive generate files and update database in real-time
// async function runBackgroundGeneration(){
    
// }

