import React, { useMemo, useState } from 'react'
import { detectDependencies } from '../utils/sandpackUtils';
import SandpackErrorMonitor from './SandpackErrorMonitor';
import { SandpackLayout, SandpackPreview, SandpackProvider } from '@codesandbox/sandpack-react';

const FullPagePreview = ({files,project}) => {

    const [showErrorOverlay,setShowErrorOverlay]=useState(true);

    //Convert liveFiles to Sandpack format
      const sandpackFiles=useMemo(()=>{
        if(!files) return {};
        const spFiles={};
        for(const [path,content] of Object.entries(files)){
            
            spFiles[path]={code:content}
        }
        return spFiles;
      },[files])
    
      // Detect dependencies from import statements using liveFiles
      const dependencies=useMemo(()=>{
        if(!files) return {};
        return detectDependencies(files)
      },[files])

  return (
    <div className='h-screen w-screen bg-white overflow-hidden'>
            <SandpackProvider style={{height:"100%"}} key={project._id} template='react'
             files={sandpackFiles}
             customSetup={{dependencies}} 
             options={{
                externalResources: [
                            "https://cdn.tailwindcss.com",
                            // FIX 2: Fixed FontAwesome URL syntax typo
                            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                        ],
                logLevel:0
             }} 
             className="h-full w-full" >
    
              
              <SandpackErrorMonitor onErrorChange={setShowErrorOverlay}/>
    
              <SandpackLayout className="h-full w-full border-none bg-transparent">
    
                    <SandpackPreview showNavigator={false} showRefreshButton={false} showOpenInCodeSandbox={false} showSandpackErrorOverlay={showErrorOverlay} 
                    className='h-full w-full'/>
              </SandpackLayout>
              
            </SandpackProvider>
        </div>
  )
}

export default FullPagePreview