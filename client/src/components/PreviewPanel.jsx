import React, { useEffect, useMemo, useRef, useState } from 'react'
import {SandpackProvider, useSandpack} from '@codesandbox/sandpack-react'
import { detectDependencies } from '../utils/sandpackUtils';
import { useAppContext } from '../context/AppContext';



function sandpackFileWatcher({onLiveFileChange}){
    const {sandpack} =useSandpack();
    const {files} =sandpack;
    const {activeProject,updateProjectFiles}=useAppContext()

    const activeProjectRef=useRef(activeProject);

   useEffect(()=>{
    activeProjectRef.current=activeProject;
   },[activeProject])

   useEffect(()=>{
    const project=activeProjectRef.current;
    if(!project) return;
    const updatedFiles={};
    let hasChanges=false;

    for(const [path,fileObj] of Object.entries(files)){
        const fileCode=fileObj.code;
        updatedFiles[path]=fileCode;
        const originalContent=typeof project.files[path] === "string" ? project.files[path]:project.files[path]?.content

        if(originalContent !== undefined && originalContent !== fileCode){
            hasChanges=true;
        }
    }

    //Sync live files to parent
    onLiveFileChange(updatedFiles);
    if(hasChanges){
        updateProjectFiles(updatedFiles)
    }
    
   },[files])
   return null;
}


const PreviewPanel = ({activeFile,showCode}) => {

    const project = {
  _id: "proj_abc123",
  version: 1,
  name: "My AI Web App",
  files: {
    "/App.js": `export default function App() {
  return <h1>Hello from Sandpack!</h1>;
}`,
    "/index.js": `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);`,
    "/styles.css": `body { font-family: sans-serif; padding: 20px; }`
  }
};
    

    const [showErrorOverlay,setShowErrorOverlay]=useState(true);
    const [liveFiles,setLiveFiles]=useState(project.files);
    const [prevProjectKey,setPrevProjectKey]=useState(`${project._id}-${project.version}`)

    const currentKey=`${project._id}-${project.version}`
    if(prevProjectKey !== currentKey){ //changes detect
      setPrevProjectKey(currentKey);
      setLiveFiles(project.files);
    }

  //Convert liveFiles to Sandpack format
  const sandpackFiles=useMemo(()=>{
    const spFiles={};
    for(const [path,content] of Object.entries(liveFiles)){
        const fileCode = typeof content === "string" ? content : content?.content || "";
        spFiles[path]={
            code:fileCode,
            active:path === activeFile,

        }
    }
    return spFiles;
  },[liveFiles,activeFile])

  // Detect dependencies from import statements using liveFiles
  const dependencies=useMemo(()=>{
    return detectDependencies()
  },[liveFiles])

  return (
    <div>
        <SandpackProvider key={project._id} template='react'
         files={sandpackFiles}
         customSetup={{dependencies}} 
         options={{
            externalResources:[
                "https://cdn.tailwindcss.com",
                "https://cdnjs.cloudFlare.com.ajax/libs/font-awesome/6.4.0/css/all.min.css"
            ],
            classes:{
                "sp-wrapper":"sp-wrapper",
                "sp-layout":"sp-layout",
                "sp-preview":"sp-preview"
            },
            logLevel:0
         }} 
         theme={{
            colors:{
                surface1:"#ffffff",
                surface2:"#f4f4f5",
                surface3:"#e4e4ef",
                clickable:"#71717a",
                base:"#09090b",
                disabled:"#a1a1aa",
                hover:"#18181b",
                accent:"#18181b",
                error:"#ef4444",
                errorSurface:"#fef2f2"
            },
            font:{
                body:"'Urbanisht',system-ui,-apple-system,sans-serif",
                mono:"'Geist Mono',ui-monospace,monospace",
                size:"13px",
                lineHeight:"1.6",
            }
         }} >

          

        </SandpackProvider>
    </div>
  )
}

export default PreviewPanel