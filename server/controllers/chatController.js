import projectModel from "../models/Project.js";


export function buildManifest(files){
    let manifest=[];

    for(let [path,entry] of Object.entries(files)){
        manifest.push({path,hash:entry.hash,size:entry.content.length})
    }

    return manifest;
}

// POST /api/project/:id/chat

// Authentication - Invoke AI - Apply Edits - Log History - Reply
//Send a revision prompt and retur updated project

export async function chat(req,res){
    
   try {
    if(!req.user || !req.user.userId){
        return res.status(401).json({error:"Unauthorized"})
    }
    const {prompt}=req.body;

    if(!prompt || typeof prompt !== "string"){
        return res.status(400).json({error:"prompt is required"})
    }

    const project=await projectModel.findOne({_id:req.params.id,owner:req.user.userId})

    //If project is not found
    if(!project){
        return res.status(404).json({error:"Project not found"})
    }

    //Set status to revising and save user prompt immediately'
    project.status="revising"
    project.messages.push({role:"user",content:prompt,timestamps:new Date()})

    await project.save() //save the document in the database

    //Build compact manifest instead of sending all code
     const manifest=buildManifest(project.files);

    //Include ALL file contents so the AI can do accurate search/replace
    
  
   } catch (error) {
    
   }
}