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

    //States for Aleady build projects
    const [projects,setProjects]=useState([]);
    const [loadingProjects,setLoadingProjects]=useState(false);
    const [activeProject,setActiveProject]=useState(null);
    const [loadingActiveProject,setLoadingActiveProject]=useState(false);
    const [chatLoading,setChatLoading]=useState(false);
    const [generatingProject,setGeneratingProject]=useState(false);
    const [activeFile,setActiveFile]=useState("/App.js")
    const [showCode,setShowCode]=useState(false)
    
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

    //function for logout
    const logout=async ()=>{
        try{
          await api.post("/api/auth/logout")
          setUser(null);
          setProjects([]);
          setActiveProject(null);
          toast.success("Logged out successfully");
          navigate("/login")
        }
        catch(error){
           console.log("Logout failed:",error)
           toast.error("Logout failed")
        }
    }

    //Projects Actions
    const loadProjects=async ()=>{
       if(!user) return;
       try{
         const {data}=await api.get("/api/projects")
         setProjects(data);
         console.log(data)
       }
       catch(err){
         console.log("Failed to list projects",err)
         toast.error("Failed to load projects list")
       }finally{
          setLoadingProjects(false)
       }
    }

    //Load the individual project
    const loadProject=useCallback(async(id,silent=false)=>{
          if(!user) return;
          if(!silent) setLoadingActiveProject(true)

          try{
            const {data}=await api.get(`/api/projects/${id}`)
            setActiveProject(data);

            //Default file selection
            const files=Object.keys(data.files);
            if(files.length > 0){
                setActiveFile((prev)=>{if(files.includes(prev)) return prev
                                   if(files.includes("/App.js")) return "/App.js"
                                   return files[0]
                })
            }
          }
          catch(err){
            console.log("Failed to load project",err)
            if(!silent){
                toast.error("Failed to load Project",err)
                navigate("/")
            }
          }finally{
             if(!silent) setLoadingActiveProject(false)
          }
    },[user, navigate])

    //Automatically polls active project status if generating or pending
    useEffect(()=>{
       if(!activeProject?._id || !user) return;

       const isOngoing= activeProject.status==="generating" || activeProject.status === "pending" || activeProject.status === "revising";

       if(isOngoing){
        setChatLoading(true);
        const interval=setInterval(()=>{
          loadProject(activeProject._id,true)
        },2000)
        return ()=>clearInterval(interval)
       }
       else{
        setChatLoading(false)
       }
    },[activeProject?._id,activeProject?.status,loadProject,user])


    //Creates a Function fro new AI project from user prompt, sets active state, and redirects to workspace
    const handleGenerate=useCallback(
      async(prompt)=>{
         if(!user){
          toast.error("Please log in to generate Project");
          navigate("/login")
          return;
         }

         setGeneratingProject(true);
         //logic for generating the project by prompt
         try{
            const {data}=await api.post("/api/projects",{prompt});
            toast.success("AI Agenet is planning structure...");
            navigate(`/builder/${data._id}`)
         }
         catch(err){
            console.error("Failed to generate project",err)
            toast.error(err?.response?.data?.error || "Failed to generate project")
         }finally{
           setGeneratingProject(false)
         }
      },[navigate,user]
    )

    //Function to delete the Particular Project
    const handleDelete=useCallback(
       async(id)=>{
         if(!user) return;
         //Logic for deletion
         try{
           await api.delete(`/api/projects/${id}`);
           setProjects((prev)=>prev.filter((p)=>p._id !== id))

          // If the deleted project is currently open in the active workspace, clear it
          if(activeProject?._id === id){
            setActiveFile("");
            navigate("/");
          }
           toast.success("Project deleted successfully")
         }
         catch(err){
           console.log("Failed to delete Project",err);
           toast.error("Failed to delete project");
         }
       },[user]
    )

    //FUnction to handle Chatting things with AI
    const handleChat=useCallback(
      async (prompt)=>{
        if(!user || !activeProject) return;

        setChatLoading(true);
        try{
          const {data}=await api.post(`/api/projects/${activeProject._id}/chat`,{prompt})

          setActiveFile(data);
          if(data.errors && data.errors.length > 0){
            toast.error(`${data.errors.length} revision patch(es) failed`)
          }else{
            toast.success(`Updated to version ${data.version}`)
          }
        }
        catch(err){
           console.log("Revision request failed:", err);
           toast.error(err?.response?.data?.error || 'Revision request failed')
        }finally{setChatLoading(false);}
      },[activeProject,user]
    )

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
    <AppContext.Provider value={{user,
       loadingUser,login,logout,register,projects,
       loadingProjects,activeProject,loadingActiveProject,
       generatingProject,activeFile,showCode,setActiveFile,
       setShowCode,loadProjects,loadProject,handleGenerate,
       handleDelete,chatLoading,handleChat}}>

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