import mongoose, { Schema } from "mongoose";

const MessageSchema=new Schema({
    role:{type:String,enum:["user","assistant"],required:true},
    content:{type:String,required:true},
    timestamps:{type:Date,default:Date.now}
},{_id:false})

const plannedFileSchema=new Schema({
    path:{type:String,required:true},
    description:{type:String,required:true}
},{_id:false})

const ProjectSchema=new Schema({
      name:{type:String,required:true,default:"Untitled Project"},
      description:{type:String,default:""},
      files:{type:Schema.Types.Mixed,default:{}},  //{"app.js":"...","index.js":"..."}
      messages:{type:[MessageSchema],default:[]},
      version:{type:Number,default:0},
      owner:{type:Schema.Types.ObjectId,ref:"User",required:true},
      published:{type:Boolean,default:false},
      status:{type:String,enum:["pending","generating","revising","completed","failed"],default:"pending"},
      filesPlanned:{type:[plannedFileSchema],default:[]},
      filesGenerated:{type:[String],default:[]},  //["index.html","app.js"]
      currentFile:{type:String,default:null},
      error:{type:String,default:null}
},{timestamps:true})

const projectModel=mongoose.models.projects || mongoose.model('projects',ProjectSchema)

export default projectModel;


//**************  EXAMPLE HOW PROJECT LOOKS LIKE ********************

// {
//   "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
//   "name": "E-Commerce Landing Page",
//   "description": "Create a modern landing page for a shoe store with a hero section and product grid",
//   "owner": "65f190a1b2c3d4e5f6a7b8c9",
//   "status": "completed",
//   "version": 1,
//   "published": true,
//   "currentFile": null,
//   "error": null,
//   "filesPlanned": [
//     {
//       "path": "index.html",
//       "description": "Main HTML document structure with Tailwind CDN import"
//     },
//     {
//       "path": "style.css",
//       "description": "Custom utility styles and animations"
//     },
//     {
//       "path": "app.js",
//       "description": "Dynamic product rendering and cart drawer interaction logic"
//     }
//   ],
//   "filesGenerated": [
//     "index.html",
//     "style.css",
//     "app.js"
//   ],
//   "files": {
//     "index.html": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <title>ShoeStore Landing</title>\n</head>\n<body>\n  <div id=\"app\"></div>\n</body>\n</html>",
//     "style.css": "/* Custom styles */\nbody { margin: 0; font-family: sans-serif; }",
//     "app.js": "console.log('App initialized');"
//   },
//   "messages": [
//     {
//       "role": "user",
//       "content": "Build me a modern shoe store landing page.",
//       "timestamps": "2026-09-13T13:45:00.000Z"
//     },
//     {
//       "role": "assistant",
//       "content": "I will create a 3-file structure: index.html, style.css, and app.js.",
//       "timestamps": "2026-09-13T13:45:05.000Z"
//     }
//   ],
//   "createdAt": "2026-09-13T13:44:50.123Z",
//   "updatedAt": "2026-09-13T13:46:10.456Z",
//   "__v": 0
// }

