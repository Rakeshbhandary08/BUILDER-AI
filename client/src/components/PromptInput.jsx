import React, { useRef, useState } from 'react'
import {ArrowRightIcon, CloudUploadIcon, Loader2Icon, MicIcon} from "lucide-react"

const PromptInput = ({onSubmit,loading=false,placeholder="Describe the website you want to build...",large=false,autoFocus=false,variant="default"}) => {

    const [value,setValue]=useState("");
    const textareaRef=useRef(null);

    const handleSubmit=(e)=>{
      if(e) e.preventDefault();
      const trimmed=value.trim()
      if(!trimmed || loading) return;
      onSubmit(trimmed);
      setValue("");
    }

    //Function to to control event handle
    const handleKeyDown=(e)=>{
       if(e.key ===  "Enter" && !e.shiftKey){
         e.preventDefault();
         handleSubmit()
       }
    }

    if(variant === "default"){
        return(
            <form onSubmit={handleSubmit} className='max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-xl ring-1 ring-white/25 focus-within:ring-2 focus-within:ring-white/30 overflow-hidden mt-6 transition'>
              
              {/* TEXT---AREA  */}
              <textarea className='outline-none w-full md:min-w-xl lg:min-w-2xl p-4 pb-2 resize-none placeholder:text-white/50 bg-transparent text-white text-base'
               rows={3} ref={textareaRef} value={value} onChange={(e)=>setValue(e.target.value)} onKeyDown={handleKeyDown} placeholder={placeholder} disabled={loading}/>

              <div className='flex items-center justify-between pb-3 px-3 gap-2'>
               
                <label htmlFor='file' className='border border-white/20  text-white/80 hover:text-white hover:border-white/30 p-1.5 rounded-md cursor-pointer flex items-center justify-center'>
                  <input className='hidden' type='file' id='file'/>
                  <CloudUploadIcon size={18}/>
                </label>

                <div className='flex items-center justify-end gap-2'>
                  <button type='button' className='flex items-center justify-between p-1 text-white/70 hover:text-white cursor-pointer'>
                    <MicIcon size={18}/>
                  </button>
                  <button type='button' className='flex items-center justify-center p-1.5 rouded-full bg-red-600 rounded-full text-white hover:bg-red-700 disabled:opacity-40 cursor-pointer transition-all'>
                     {loading ? <Loader2Icon size={18} className='animate-spin'/> : <ArrowRightIcon size={18}/>}
                  </button>
                </div>
              </div>
            </form>
        )
    }

  return (
    <div>
      
    </div>
  )
}

export default PromptInput