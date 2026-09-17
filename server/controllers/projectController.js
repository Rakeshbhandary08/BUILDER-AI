import projectModel from "../models/Project.js";
import crypto from "crypto"

function hashContent(content){
  return crypto.createHash("md5").update(content).digest("hex").slice(0,12)
}

//**********   POST  /api/projects

//create a new project from an AI Prompt
export async function createProject(req, res) {
  try {
    const { prompt } = req.body;

    //if prompt is not present or invalid prompt
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    //User authentication
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    //create project in DB immediately with "pending" status
    const project = await projectModel.create({
      name: "Planning project...",
      description: prompt,
      files: {},
      messages: [
        //Schema
        { role: "user", content: prompt },
        { role: "assistant", content: "Planning project structure..." },
      ],
      version: 0,
      owner: req.user.userId,
      status: "pending",
      filesPlanned: [],
      currentFile: null,
      error: null,
    });

    //Start background generation
    runBackgroundGeneration(project._id.toString(), prompt).catch((err) => {
      console.log(
        `[Background AI] Fatal generation error for project ${project._id}:`,
        err,
      );
    });

    res.status(201).json({
      _id: project._id,
      name: project.name,
      description: project.description,
      files: {},
      messages: project.messages,
      version: project.version,
      status: project.status,
      filesPlanned: project.filesPlanned,
      filesGenerated: project.filesGenerated,
      currentFile: project.currentFile,
      error: project.error,
      createdAt: project.createdAt,
    });
  } catch (err) {
    console.log("[Error Failed]", err);
    return res.status(500).json({ error: "Failed to create Project" });
  }
}

//Background worker to progressive generate files and update database in real-time
// INTEGRATION WITH AI
async function runBackgroundGeneration(prompt) {
  console.log(`Here is your : ${prompt}`);
}

//***************  GET -> /api/projects *************************
export async function listProjects(req, res) {
  try {
    //Verify user authentication
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    //Fetch projects owned by logged-in user
    const projects = await projectModel
      .find(
        { owner: req.user.userId },
        {
          name: 1,
          description: 1,
          status: 1,
          version: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      )
      .sort({ updatedAt: -1 });

    return res.json(projects);
  } catch (err) {
    console.log("[projects list]", err);
    return res.status(500).json({ error: "Failed to fetch project" });
  }
}

//***************  GET -> /api/project/:id *************************
export async function getProject(req, res) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const project = await projectModel.findOne({
      _id: req.params.id,
      owner: req.user.userId,
    });

    //IF there is no project with given id or invalid id something
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    let filesObj = {};
    for (let [path, entry] of Object.entries(project.files)) {
      filesObj[path] = entry.content;
    }

    return res.json({
      _id: project._id,
      name: project.name,
      description: project.description,
      files: filesObj,
      messages: project.messages,
      version: project.version,
      status: project.status,
      filesPlanned: project.filesPlanned,
      filesGenerated: project.filesGenerated,
      currentFile: project.currentFile,
      error: project.error,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    });
  } catch (err) {
    console.log("[project failed", err);
    return res.status(500).json({ error: "Failed to fetch project" });
  }
}

//***************  DELETE /api/projects/:id  ********************** */
export async function deleteProject(req, res) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await projectModel.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.userId,
    });

    if (!result) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.json({
      success: true,
      message: "Project is succcessfully deleled",
    });
  } catch(err){
     console.log("[project failed]",err)
     return res.status(500).json({error:"Failed to deleted project"})
  }
}

//*********************************/ PUT /api/projects/:id/files  ***********************************
export async function updateProject(req,res){
  try {
     const {files}=req.body;
     
     //checking the files
     if(!files || typeof files !== 'object'){
       return res.status(400).json({error:"files object is required"})
     }
  
     if(!req.user || !req.user.userId){
       return res.status(401).json({error:"Unauthorized"})
     }
  
     const project=await projectModel.findOne({_id:req.params.id,owner:req.user.userId})
  
     //Checking the availability of project
     if(!project){
      return res.status(404).json({error:"Project not found"})
     }
  
     //Rebuild project files map with content and hashes
     let newFiles={ ...(project.files || {})}
     for(const [path,content] of Object.entries(files)){
       if(typeof content === "string"){
         newFiles[path]={content,hash:hashContent(content)}
       }
     }
  
     //save into databasee
     project.files=newFiles
     await project.save()

     //project.files={"App.jsx":{content:"<h2>Hello world</h2>",hash:"DE2908CU7"}}

     const filesObj={}; //{"App.jsx":"<h2>Hello world</h2>"}
     for(const [path,entry] of Object.entries(project.files || {})){
        if(entry && typeof entry.content === "string"){
          filesObj[path]=entry.content
        }
     }

     res.json({
       _id: project._id,
      name: project.name,
      description: project.description,
      files: filesObj,
      messages: project.messages,
      version: project.version,
      createdAt: project.createdAt,
      updatedAt:project.updatedAt
     })
     
  } catch (err) {
     console.log("[Error]",err.message)
     return res.status(500).json({error:"Failed to update"})
  }
}


// POST /api/projects/:id/publish
// Mark a project as publicly published.
export async function publishProject(req,res){
  try {
    if(!req.user || !req.user.userId){
      return res.status(401).json({error:"Unauthorized"})
    }
  
    const project=await projectModel.findOneAndUpdate({_id:req.params.id,owner:req.user.userId},{published:true},{new:true})
  
    //Checking the availability of project
    if(!project){
      return res.status(404).json({error:"Project not found"})
    }
  
    res.json({success:true,published:project.published})
  } catch (err) {
    console.log("[Error]",err.message)
     return res.status(500).json({error:"Failed to published project"})
  }
}


// GET /api/projects/public/:id
// GET a publicly published project details (without auth)

export async function getPublicProject(req,res){
   try{

     const project=await projectModel.findById(req.params.id)
     if(!project){
       return res.status(404).json({error:"Project not found"})
     }

     if(!project.published){
        return res.status(403).json({error:"Project not found"})
     }

     const filesObj={};
     for (const [path,entry] of (Object.entries(project.files) || {})){
      filesObj[path]=entry.content;
     }

     return res.json({
      _id: project._id,
      name: project.name,
      description: project.description,
      files: filesObj,
      version: project.version,
     })

   }
   catch(err) {
      console.log("[Failed Request]",err.message);
      return res.status(500).json({error:"Failed to get the project"})
   }
}