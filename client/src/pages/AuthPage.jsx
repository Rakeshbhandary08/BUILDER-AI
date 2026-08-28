import React, { useState } from 'react'
import LoginLeft from '../components/LoginLeft'
import { Link, useNavigate } from 'react-router-dom'
import { EyeIcon, EyeOff, EyeOffIcon, Loader2Icon } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

const AuthPage = ({mode}) => {
  const navigate=useNavigate()
  const {login,register}=useAppContext()

  const handleSubmit=async (e)=>{
     e.preventDefault();

     setError("");
     setLoading(true);

     try{
      if(mode === "login"){
        await login(email,password)
      }
      else{
        await register(name,email,password)
      }
     }
     catch(err){
      setError(err.message || (mode === "login" ? "Invalid email or password" : "Registeration Failed"))
     }finally{
       setLoading(false)
     }
  }

  const [error,setError]=useState("")
  const [loading,setLoading]=useState("")
  const isLogin=mode ==="login"

  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [showPassword,setShowPassword]=useState(false);

  return (
    <div className='min-h-screen bg-white flex text-zinc-900 font-sans'>
      {/* Left Panel - Branding */}
      <LoginLeft/>

      {/* Right Panel - Branding */} 
      <div className=' flex-1 flex justify-center items-center p-8'>
        <div>
          <div className='mb-8'>
            <h1 className='text-3xl font-medium tracking-tight text-zinc-900 mb-1.5 font-sans'>
              {isLogin ? "Sign In" : "Create an account"}
            </h1>
            <p className='text-sm text-zinc-400'>
              {isLogin ? "Enter your credentials to access your website builder." : "Get started by entering your registeration details."}
            </p>
          </div>

         {error && <div className='mb-6 p-3 border border-red-200 bg-red-50'>{error}</div>}

         <form className='space-y-5' onSubmit={handleSubmit}>
           {
            !isLogin && (
            <div>
              <label className='block text-[13px]  font-semibold text-zinc-400 uppercase tracking-widest mb-1'>Full Name</label>
              <input type="text" value={name} onChange={(e)=>setName(e.target.value)} required
               className='w-full pl-1 py-2 border-b border-zinc-200 focus:outline-none focus:border-zinc-950 text-sm text-zinc-900 bg-transparent placeholder-zinc-300 transition-colors' placeholder='Rakesh kumar'/>
            </div>)
           }
           <div>
              <label className='block text-[13px] font-semibold text-zinc-400 uppercase tracking-widest mb-1'>Email</label>
              <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required
               className='w-full pl-1 py-2 border-b border-zinc-200 focus:outline-none focus:border-zinc-950 text-sm text-zinc-900 bg-transparent placeholder-zinc-300 transition-colors' placeholder='example@gmail.com'/>
           </div>
           <div>
              <label className='block text-[13px] font-semibold text-zinc-400 uppercase tracking-widest mb-1'>Password</label>
              <div className='relative'>
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e)=>setPassword(e.target.value)} required
               className='w-full pl-1 py-2 border-b border-zinc-200 focus:outline-none focus:border-zinc-950 text-sm text-zinc-900 bg-transparent placeholder-zinc-300 transition-colors' placeholder='●●●●●●●●●'/>
               <button type='button' onClick={()=>setShowPassword(!showPassword)} className='absolute right-2 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-600 flex items-center justify-center cursor-pointer transition-colors'>
                {showPassword ? <EyeOffIcon size={15}/> : <EyeIcon size={15}/>}</button>
              </div>
            </div>

            <button type='submit' disabled={loading} className='bg-linear-to-br from-red-600 to-amber-600 w-full py-2.5 text-white font-semibold hover:scale-102 disabled:opacity-40 flex items-center justify-center cursor-pointer mt-2 rounded-lg  transform-gpu transition-all duration-400'>{loading && <Loader2Icon className='animate-spin h-3.5 w-3.5 mr-2'/>} {isLogin ? "Sign In" : "Sign Up"}</button>
         </form>

         {/** User can switch their login and signUp */}
         <p className='text-sm text-zinc-300 mt-5 pt-3 border-t border-zinc-100 font-sans'>{isLogin ?
          (<>New to BuilderAI? {" "} <Link to="/register" className='text-zinc-900 font-medium underline underline-offset-2'>Create an account</Link></>):
          (<>Already have an acccount? {" "} <Link to="/login" className='text-zinc-900 font-medium underline underline-offset-2'>Sign in here</Link></>)}
        </p>
        </div>
      </div> 

    </div>
  )
}

export default AuthPage