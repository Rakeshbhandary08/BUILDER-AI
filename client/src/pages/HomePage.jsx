import React from 'react'
import { useAppContext } from '../context/AppContext';
import PromptInput from '../components/PromptInput';

const HomePage = () => {

  const {user}=useAppContext()

  return (
    <div className="bg-[url('/bg-img.png')] h-screen overflow-y-scroll text-white font-sans bg-cover bg-center bg-no-repeat">
         
         {/* Navigation bar */}
         <nav className='sticky top-0 z-10 px-6 py-4 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <img src={"/logo.svg"} alt="logo" className='size-6'/>
              <span className='text-xl font-semibold tracking-tight'>Builder AI</span>
            </div>
            <div className='flex items-center gap-4 text-[14px] font-medium text-zinc-300'>
               <span className=''>{user?.name}</span>
               <button className='py-1.5 px-3 border border-white/20 text-white hover:bg-white/10  rounded-md cursor-pointer bg-transparent'>Sign out</button>
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
               onSubmit={()=>{}} 
                loading={false}
                placeholder='Create a portfolio website'
                autoFocus />
             </div>

           </div>
         </div>
    </div>
  )
}

export default HomePage;