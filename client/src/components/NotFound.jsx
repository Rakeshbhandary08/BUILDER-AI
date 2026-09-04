import React from 'react'

const NotFound = () => {
  return (
    <div className='flex flex-col items-center gap-1 p-10  justify-center min-h-screen'>
        <img className='h-30 sm:h-40 md:h-50  w-auto' src="https://assets.leetcode.com/static_assets/public/images/404_face.png"/>
        <h2 className='text-md sm:text-lg md:text-2xl font-bold'>Page Not Found</h2>
        
        <p className='text-[10px] md:text-[15px] text-gray-600 text-center'>Sorry, but we can't find the page you are <br/>looking for...</p>
        
    </div>
  )
}

export default NotFound