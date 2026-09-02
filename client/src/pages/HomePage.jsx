import React from 'react'
import { useAppContext } from '../context/AppContext';
import PromptInput from '../components/PromptInput';
import { homeTags } from '../assets/assets';
import { useEffect } from 'react';
import { ArrowRightIcon, ClockIcon, Trash2Icon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import moment from "moment";

const HomePage = () => {

  const navigate=useNavigate()

  const {user,loadingUser,login,logout,register,projects,loadingProjects,
    activeProject,loadingActiveProject,generatingProject,activeFile,showCode,
    setActiveFile,setShowCode,loadProjects,loadProject,handleGenerate,handleDelete}=useAppContext()

    useEffect(()=>{
      loadProjects()
    },[user])

  return (
    <div className="bg-[url('/bg-img.png')] h-screen overflow-y-scroll text-white font-sans bg-cover bg-center bg-no-repeat">
         
         {/* Navigation bar */}
         <nav className='sticky top-0 z-10 px-6 py-4 flex items-center justify-between'>
            <div className='flex items-center gap-2 shrink-0'>
              <img src={"/logo.svg"} alt="logo" className='size-6 '/>
              <span className='text-xl font-semibold tracking-tight'>Builder AI</span>
            </div>
            <div className='flex items-center gap-2 sm:gap-4 text-[14px] font-medium text-zinc-300 min-w-0 max-sm:ml-2'>
               <span className='truncate max-w-[120px] sm:max-w-[200px]' title={user?.name}>{user?.name}</span>
               <button onClick={logout} className='py-1.5 px-3 border border-white/20 text-white hover:bg-white/10  rounded-md cursor-pointer bg-transparent shrink-0'>Sign out</button>
            </div>
         </nav>

         {/* Hero Section */}
         <div className=' flex-1 flex flex-col items-center justify-center px-6 pb-20 mt-8 xl:mt-28'>
           <div className='w-full max-w-2xl flex flex-col items-center'>

             {/* Promo Badge */}
             <div className='flex items-center gap-2 p-1.5 pr-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[14px] text-white/90'>
              <span className='bg-red-700 px-3 py-1 text-[11px] rounded-full font-medium'>PROMO</span>
              <span>Create your first project for free</span>
             </div>

             {/* Title */}
             <h1 className='text-4xl md:text-6xl text-center font-medium tracking-tight mt-4 max-w-2xl'>Let's build your app together</h1>
             <p className='text-center text-sm md:text-base max-w-xl mt-4 text-white/65 leading-relaxed'>Describe your idea and watch AI design, Structure and launch your website instantly. No coding required.</p>

             {/* Prompt input with glassmorphic effect and variant */}
             <div className='w-full mt-6'>
               <PromptInput 
               variant='glass'
               onSubmit={handleGenerate} 
                loading={generatingProject}
                placeholder='Create a portfolio website'
                autoFocus />
             </div>

             {/* Scrolling Marquee tags */}
             <div className='masked-marquee w-full mt-4 max-w-2xl overflow-hidden'>
               <div className='animate-marquee gap-3'>
                  {
                    homeTags.map((tag,i)=>{
                      return(
                        <button key={i} onClick={()=>handleGenerate(tag)} disabled={generatingProject} 
                         className='bg-white/10 px-4 py-1.5 border rounded-full text-sm text-white border-white/25 hover:bg-white/20 transition cursor-pointer shrink-0 font-medium'>
                          {tag}
                        </button>
                      )
                    })
                  }
               </div>
             </div>

             {/* All Projects */}
             {
               !loadingProjects && projects.length > 0 && (
                <div className=' w-full mt-12  '>
                  
                  <div className='flex items-center justify-between pb-3 mb-3 border-b border-white/10'>
                    <p className='text-[14px] font-medium uppercase text-zinc-100 tracking-widest'>all Projects</p>
                    <span className='text-[14px] text-zinc-100 font-normal'>{projects.length} {projects.length === 1 ? "Project" : "Projects"}</span>
                  </div>
  
                  <div className='space-y-2 max-h-[80vh] overflow-y-auto pr-1'>
                    {
                      projects.map((p)=>{
                        return(
                          <div className='bg-white/5 border border-white/10 rounded-lg px-4 py-3 flex items-center justify-between group
                           hover:border-white/20 hover:bg-white/10 cursor-pointer backdrop-blur-md transition-all'
                            onClick={()=>navigate(`/builder/${p._id}`)} key={p._id}> 

                            <div className='flex-1 min-w-0'>
                              <p className='text-sm font-medium text-white truncate'>{p.name}</p>
                              <div className='flex items-center items-center gap-3 mt-0.5'>
                                <span className='text-xs text-zinc-300 flex items-center gap-1'><ClockIcon size={10}/>{moment(p.updatedAt || p.createdAt).fromNow()}</span>
                                <span className='text-xs text-white/60 font-medium'>{p.version}</span>
                              </div>
                            </div>
                            
                            <div className='flex items-center gap-2'>
                              <button onClick={(e)=>{e.stopPropagation();handleDelete(p._id)}}
                                className='p-1.5 rounded-md text-zinc-200 hover:text-red-400 hover:bg-white/10 opacity-0 group-hover:opacity-100 cursor-pointer'>
                                <Trash2Icon size={14}/></button>
                              <ArrowRightIcon size={14} className='text-zinc-200 group-hover:text-white '/>
                            </div>

                          </div>
                        )
                      })
                    }
                  </div>
                </div>
               )
             }

           </div>
         </div>
    </div>
  )
}

export default HomePage;