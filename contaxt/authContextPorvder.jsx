import React, { createContext, useEffect } from 'react'
import { useState } from 'react'

export const authContext = createContext()


export default function AuthContextPorvder({children}) {
    
    const [Token, setToken] = useState(null)
    
    let tokenFromLocal =localStorage.getItem("token")

    useEffect(()=>{

  if(tokenFromLocal!== null){

    setToken(tokenFromLocal)
}


    } , [])

  return (
    <authContext.Provider  value={{ Token , setToken}}>
    
    {children}

    </authContext.Provider>
  )
}
