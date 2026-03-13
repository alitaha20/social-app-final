import { Spinner } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Eye } from 'iconsax-reactjs'
import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import * as z from "zod"
import { authContext } from '../../contaxt/authContextPorvder'



const schema = z.object({
    email : z.email() ,
    password : z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{8,}$/ , "password not valid",), 
})



export default function Login() {

const [show , setShow] = useState (false)
const [ erorrSignUp, setErorrSignUp] = useState ()

const {setToken} = useContext(authContext)

const router = useNavigate()

function hnadelpass (){

  setShow(!show)

}



const {handleSubmit , register , formState } =  useForm({
  resolver : zodResolver(schema), 
  defaultValues : {
    email : " ",
    password : '', 

  }
})
 


 async function sendDataTo (values) {

  try {
    const {data} = await axios (`${import.meta.env.VITE_API_URL}/users/signin`, 
      {
        method : "POST" , 
        data : values ,
      }
    )

    localStorage.setItem("token", data.data.token)


    setToken(data.data.token)



    router ("/Home")

  } catch (error) {

    setErorrSignUp(error.response.data.error)
    
  }
  
 }


  return (
    <>
    <div className=' bg-slate-500 h-screen flex justify-center items-center ' >
      <div className=' card p-9 bg-white text-center rounded-2xl shadow-2xl'> 
        <h1 className=' font-semibold text-xl text-blue-500'> creat a new account</h1>
        <p className='my-2'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti.</p>
      <form className='text-start' onSubmit={handleSubmit(sendDataTo)}> 

        {/* email */}
                <div> 
          <label className='text-lg' htmlFor="email"> email</label>
          <input  className="input"  {...register("email" )} type="email" name='email' id='email' placeholder='email'/>
                 { formState.errors.email && <p className='text-red-600 font-bold'>{formState.errors.email.message}</p> }

        </div>
        {/* password */}
                <div> 
          <label className='text-lg' htmlFor="password"> password</label>
          <div className='relative'>
            <input  className="input " {...register("password" )} type={show ? "text" : "password" } name='password' id='password' placeholder='password'/>
             { formState.errors.password && <p className='text-red-600 font-bold'>{formState.errors.password.message}</p>}
            <Eye className='absolute end-2 top-[50%] translate-y-[-50%] cursor-pointer' onClick={hnadelpass}/>
          </div>
        </div>

        <p className=' text-red-800 font-semibold'>{erorrSignUp}</p>
        <button className='btn'>login {formState.isSubmitting &&  <Spinner /> } </button>
        
      </form>
      <p className=' mt-4'> you dont have  acc ? <Link className='text-blue-600' to={"/Rigister"}> register</Link></p>
      </div>
    </div>
    </>
  )
}
