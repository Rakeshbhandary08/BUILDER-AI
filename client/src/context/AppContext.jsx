import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast"
import {  useNavigate } from "react-router-dom";

const AppContext=createContext(undefined);

export function AppContextProvider({children}){

    const navigate=useNavigate();

    //Auth States -------
    const [user,setUser]=useState(null);
    const [loadingUser,setLoadingUser]=useState(false);
    
    //Auth Actions -------
    const checkSession=useCallback(async()=>{  //cache the function reference
       try{
         const {data}=await api.get("/api/auth/me");
         setUser(data.user)
       }
       catch(error){
          setUser(null)
       }finally{
          setLoadingUser(false)
       }
    },[])

    useEffect(()=>{
        checkSession();
    },[checkSession])

    //Function for login
    const login=async(email , password)=>{
        try{
          const {data}=await api.post("/api/auth/login",{email,password});
          setUser(data.user);
          toast.success("Welcome back!");
          navigate("/")
        }
        catch(err){
           console.log("Login failed",err);
           const errMsg=err?.response?.data?.error || "Invalid Credentials"
           toast.error(errMsg);
           throw new Error(errMsg)
        }
    }

    //Function for Registeration
     const register=async(name,email,password)=>{
        try{
          const {data}=await api.post("/api/auth/register",{name,email,password});
          setUser(data.user);
          toast.success("Account created successfully");
          navigate("/")
        }
        catch(err){
           console.log("Registration failed",err);
           const errMsg=err?.response?.data?.error || "Registration failed"
           toast.error(errMsg);
           throw new Error(errMsg);
        }
    }

    return(
    <AppContext.Provider value={{user,loadingUser,login,register}}>
        {children}
    </AppContext.Provider>
    )
}

//function that prevents silent bugs by throwing a clear error if i accidentally try to read context in a component that isn't wrapped inside <AppContextProvider>.
export function useAppContext(){
    const context=useContext(AppContext)

    if(context === undefined){
        throw new Error("useAppContext must be used within an AppContextProvider")
    }
    return context;
}