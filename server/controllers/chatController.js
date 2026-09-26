import projectModel from "../models/Project.js";
import { reviseProject } from "../services/ai.js";
import { applyOperations } from "../services/diff.js";


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
    const relevantFiles={};//{"app.jsx":"<rafce.....>"}
    for(const [path,entry] of Object.entries(project.files)){
        relevantFiles[path]=entry.content
    }

    //Recent message for context (last 4 max) messages=[{role:...,content:...},{role:...,content:...},{role:...,content:...}]
    const recentMessages=project.messages.slice(-4).map((m)=>({role:m.role,content:m.content})) 
    // [{role:...,content:...},{role:...,content:...},{role:...,content:...}]

    console.log(`[AI] Revising project ${project._id}:"${prompt.slice(0,80)}..."` +
               `(${manifest.length} files, manifest ~${JSON.stringify(manifest).length} chars)`)

    
    //Call AI with manifest + relevant files
    const result=await reviseProject(prompt,manifest,relevantFiles,recentMessages)

    console.log(`[AI] Got ${result.operations.length} operations:${result.description}`);

    //Apply operations to file map
    const {files:updatedFiles,applied,errors}=applyOperations(project.files,result.operations)

    if(errors.length > 0){
        console.warn(`[Diff] Errors applying operations:`, errors);
    }

    //Update project in DB
    project.files=updatedFiles;
    project.markModified("files");
    project.version +=1;
    project.status="completed";
    project.messages.push({
        role:"assistant",
        content:result.description + (errors.length > 0 ? `\n\n Some operation failed: ${errors.join(",")}`: "")
    })

    await project.save()

    //Return updated project
    const filesObj={};
    for (const [path,entry] of Object.entries(project.files)){
        filesObj[path]=entry.content
    }

    return res.json({
        _id:project._id,
        name:project.name,
        description:project.description,
        files:filesObj,
        messages:project.messages,
        status:project.status,
        applied,
        errors,
        aiDescription:result.description
    })

   } catch (err) {
     console.log(`[AI Revision Error] ${err.message}`)
     project.status="completed";
     await project.save();
     return res.status(500).json({error:err.message || "Failed to process revision request"})
   }
}