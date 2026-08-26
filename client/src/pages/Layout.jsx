import React from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import  {useAppContext} from "../context/AppContext"
import Loading from '../components/Loading'


export function AuthLayout(){
    const {user,loadingUser}=useAppContext()

    if(loadingUser){
       return <Loading/>
    }
    if(!user){
      return <Navigate to={"/login"} replace/>
    }

    return <Outlet/>
}

export function GuestLayout(){
    const {user,loadingUser}=useAppContext()
    if(loadingUser){
       return <Loading/>
    }
    if(user){  {/* If user is already logged in then redirect him/her to Home page6ghjklp\
      74856+ */}
      return <Navigate to={"/"} replace/>  //agar user hai matlab usko home page dikhao nahi ki login page
    }

    return (
    <>
    <Outlet/>

    </>
    )
    
}