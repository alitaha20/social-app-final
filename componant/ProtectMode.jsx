import React, { useContext } from 'react'
import { authContext } from '../contaxt/authContextPorvder'
import { Navigate } from 'react-router-dom'

export default function ProtectMode({children}) {

   const {Token} =useContext(authContext)

   if(!Token){

    return <Navigate  to={"/login"} />
   }

  return (<>
  
  {children}
  </>
  )
}
