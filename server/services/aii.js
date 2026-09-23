import { createOpenAI } from "@ai-sdk/openai";
import {generateObject} from 'ai';
import { FilePlanSchema } from "./aiSchemas.js";
import { FILE_PLAN_SYSTEM } from "./prompts.js";
import pMap from 'p-map'
import pMap from "p-map";

// -- openRouter Model Client Setup ---
const MODEL=process.env.OPENROUTER_MODEL || "openrouter/free";

const MAX_CONCURRENCY=parseInt(process.env.AI_MAX_CONCURRENCY  || "6",10)

//Configure OpenRouter provider using @ai-sdk/openai
const openrouter=createOpenAI({
    baseURL:"https://openrouter.ai/api/v1",
    apiKey:process.env.OPENROUTER_API_KEY
})

const model=openrouter(MODEL);

//Generate a single file's code
async function generateSingleFile(file,allFiles,prompt,alreadyGeneratedFiles){
    
}

//Generate project files : plan first, then build files in order with fallback retries
export async function generateProject(prompt,callbacks){
     //Phase 1: Plan
     console.log(`[Ai] Phase 1: Planning file structure for : "${prompt.slice(0,80)}..."`);
     const {object : plan}=await generateObject({
        model,
        schema:FilePlanSchema,
        system:FILE_PLAN_SYSTEM,
        prompt:`Plan a React website for: ${prompt}`,
        maxRetries:2
     })

     if(!plan.find((f)=>f.path === "/App.js")){
         plan.files.unshift({
         path:"/App.js",
         description:"Main application entry point",
         exports:"default App",
         imports:["./styles.css"]
       })
     }

     if(!plan.find((f)=>f.path === "/styles.js")){
         plan.files.push({
         path:"/styles.js",
         description:"Global CSS: Google Font import, keyframe animations, utility classes",
         exports:"none",
         imports:[]
       })
     }

     if(callbacks?.onPlan){
        await callbacks.onPlan(plan)
     }

     console.log(`[AI] Phase 2: Generating ${plan.files.length} files in parallel (concurrency=${MAX_CONCURRENCY}): ${plan.files.map((f)=>f.path).join(",")}`)

     const files={}
     let pendingFiles=plan.files.map((f)=>({...f}));

     const maxRetryRounds=2;

     for(let round=0;round <= maxRetryRounds ; round++){
        if(pendingFiles.length === 0) break;

        if(round > 0){
            console.log(
                `[AI] Retry round ${round}/${maxRetryRounds} for ${pendingFiles.length} failed files: ${pendingFiles.map((f)=>f.path).join(",")}`
            )
        }

        const results=await pMap(
            pendingFiles,

            async (file)=>{
                try {
                    if(callbacks?.onFileStart){
                        await callbacks.onFileStart(file.path)}

                    const singleResult=await generateSingleFile(file,plan.files,prompt,files)

                    if(callbacks?.onFileComplete){
                       await callbacks.onFileComplete(file.path,singleResult.code)
                    }

                    return {success:true,file,result:singleResult}
                } catch (err) {
                    return {success:false,file,error:err}
                }
            },
            {concurrency:MAX_CONCURRENCY}
        )

      const failedFiles=[];
       for(const entry of results){
          if(entry.success){
            const {path,code}=entry.result;
            files[path.startsWith("/") ? path : "/" + path]=code;
          }
          else{
            console.warn(`[AI] File ${entry.file.path} failed in round ${round}: ${entry.error?.message || entry.error}`);
            failedFiles.push(entry.push)
          }
       }
       pendingFiles=failedFiles;
     }

     if(pendingFiles.length > 0){
        const failedPaths=pendingFiles.map((f)=>f.path).join(",");
        console.error(`[AI] Failed to generate ${pendingFiles.length} files after all retry rounds: ${failedPaths}`);

        if(pendingFiles.some((f)=>f.path === "/App.js")){
            const ext=file.path.split(".").pop()?.toLowerCase()

            if(ext === "css"){
                files[file.path]=`/* ${file.description} - Generation failed, please retry */\n`
            }
            else{
                files[file.path]="import React from 'react';\n\n" + `// This file could not be generated. Please retry.\n` +
                 `// Purpose : ${file.description}`
            }
        }
     }
}

export async function reviseProject(prompt,manifest,relevantFiles,recentMessages){

}





