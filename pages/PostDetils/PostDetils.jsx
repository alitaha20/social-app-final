import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { authContext } from '../../contaxt/authContextPorvder'
import ProdactCard from '../ProdactCard/ProdactCard'
import LodingCard from '../ProdactCard/LodingCard'
import { useQuery } from '@tanstack/react-query'
import { h1 } from 'framer-motion/client'

export default function PostDetils() {


let {postid} =  useParams()



const {Token} = useContext(authContext)


async function getSingalPost (){

return axios.get (`https://route-posts.routemisr.com/posts/${postid}` , {
  headers :{
    token :Token
  }
})

}


function commentPost (){

  return axios.get(`https://route-posts.routemisr.com/posts/${postid}/comments?page=1&limit=10` , {
    headers : {
      token : Token 
    }
  })
}


const{data:commentData , isLoading: commentLoading }  =useQuery({
  queryKey : ['commentPost' , postid],
  queryFn: commentPost, 
})


 
  const {data , isLoading , isError}=  useQuery({
   queryFn : getSingalPost,
  queryKey: ["postid" , postid]  ,
  gcTime : 1000 * 60 * 4,
 })



if(isLoading){

return <LodingCard/>

}

if(isError){ 
  return <h1> hasl error</h1>
  
}


  return (
    <>
    <div className='flex-col items-center w-full '>
      {isLoading ? <LodingCard /> : <ProdactCard  post={data.data.data.post} commetn={commentData?.data.data.comments} /> }
    </div>
    </>
  )
}
