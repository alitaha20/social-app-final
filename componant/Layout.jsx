import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

export default function layout() {
  return (
    <> 
    
    <Navbar/>

   <div className=' bg-slate-500 p-10 flex items-center justify-center '>
    <Outlet/>

    </div>    

    <Footer/>
    
    
    </>
  )
}
