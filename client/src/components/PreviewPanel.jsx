import React, { useEffect, useMemo, useRef, useState } from 'react'
import {SandpackCodeEditor, SandpackLayout, SandpackPreview, SandpackProvider, useSandpack} from '@codesandbox/sandpack-react'
import { detectDependencies } from '../utils/sandpackUtils';
import { useAppContext } from '../context/AppContext';
import SandpackErrorMonitor from './SandpackErrorMonitor';



function SandpackFileWatcher({onLiveFileChange}){
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


const PreviewPanel = ({project,activeFile,showCode}) => {

//     const project = {
//   _id: "proj_abc123",
//   version: 1,
//   name: "My AI Web App",
//   files: {
//     "/App.js": `export default function App() {
//   return <h1>Hello from Sandpack!</h1>;
// }`,
//     "/index.js": `import React from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App';

// const root = createRoot(document.getElementById('root'));
// root.render(<App />);`,
//     "/styles.css": `body { font-family: sans-serif; padding: 20px; }`
//   }
// };
    

    const [showErrorOverlay,setShowErrorOverlay]=useState(true);
    const [liveFiles,setLiveFiles]=useState(project.files);
    const [prevProjectKey,setPrevProjectKey]=useState(`${project._id}-${project.version}`)

    const currentKey=`${project._id}-${project.version}`
    if(prevProjectKey !== currentKey){ //changes detect
      setPrevProjectKey(currentKey);
      setLiveFiles(project.files);
    }

   //Function 


   const handleLiveFilesChange=(newFiles)=>{  //{"App.jsx":.....,"Index.css":font,color..., "App.css":....}
       setLiveFiles((prev)=>{
        let changed=false;
        for( const [p,code] of Object.entries(newFiles)){
            if(prev[p] !== code){
                //File has been updated/changed
                changed=true;
                break;
            }
        }
        return changed ? newFiles : prev;
       })
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
    return detectDependencies(liveFiles)
  },[liveFiles])

  return (
    <div className='h-full w-full overflow-hidden'>
        <SandpackProvider style={{height:"100%"}} key={project._id} template='react'
         files={sandpackFiles}
         customSetup={{dependencies}} 
         options={{
            externalResources: [
                        "https://cdn.tailwindcss.com",
                        // FIX 2: Fixed FontAwesome URL syntax typo
                        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
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
                body:"'Urbanist',system-ui,-apple-system,sans-serif",
                mono:"'Geist Mono',ui-monospace,monospace",
                size:"13px",
                lineHeight:"1.6",
            }
         }} >

          
          <SandpackFileWatcher onLiveFileChange={handleLiveFilesChange}/>
          <SandpackErrorMonitor onErrorChange={setShowErrorOverlay}/>

          <SandpackLayout style={{height:"100%",border:"none",borderRadius:0,background:"transparent"}}>
                {showCode && (<SandpackCodeEditor showTabs showLineNumbers showInlineErrors wrapContent style={{height:"100%",flex:1,minWidth:0}}/>)}

                <SandpackPreview showNavigator={false} showRefreshButton showOpenInCodeSandbox={false} showSandpackErrorOverlay={showErrorOverlay} 
                style={{ height:"100%",flex:showCode ? 1 : 2,minWidth:0}}/>
          </SandpackLayout>
          
        </SandpackProvider>
    </div>
  )
}

export default PreviewPanel