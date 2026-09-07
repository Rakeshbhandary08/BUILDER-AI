import { useSandpack } from '@codesandbox/sandpack-react'
import React, { useEffect } from 'react'

const SandpackErrorMonitor = ({onErrorChange}) => {
    const {sandpack} =useSandpack();
    const {error}=sandpack;

    useEffect(()=>{
        // Case 1: No error exists -> Code is healthy
        if(!error){
          onErrorChange(false)  //Kio Error to aaya hi nahi.
          return null
        } 
        if(error){
            const msg=error.message || "";
            const isNetworkError=msg.includes("Failed to fetch") || 
                                 msg.includes("col.csbops.io") || 
                                 msg.includes("ERR_CONNECTION_TIMED_OUT") ||
                                 msg.includes("net::ERR")
            
            if(isNetworkError){
                onErrorChange(false);
                return
            }
        }
        onErrorChange(true)
    },[error,onErrorChange])

  return (
    null
  )
}

export default SandpackErrorMonitor