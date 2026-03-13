import { Avatar, Button } from '@heroui/react'
import axios from 'axios'
import React, { useContext } from 'react'
import { authContext } from '../../contaxt/authContextPorvder'
import { useMutation, useQuery } from '@tanstack/react-query'
import {Card, CardHeader, CardBody, Image} from "@heroui/react";
import LodingCard from '../ProdactCard/LodingCard'
import MyPosts from './MyPosts'

export default function Profile() {


const{Token}= useContext(authContext)


 async function myProfile (){


 return axios.get(`https://route-posts.routemisr.com/users/profile-data` , {
    headers : {
      token: Token 
    }
  })

}


  const {data , refetch ,isLoading , isError} = useQuery({
  queryKey : "myprofile",
  queryFn : myProfile
   })



       function getAllPost (){
   
           return axios.get(`https://route-posts.routemisr.com/users/${data?.data.data.user.id}/posts` , {
               headers : {
                   token : Token 
               }
           })
       }
   
   
       const {data:myposts , isLoading:postdata , isError:dataerror} =useQuery({
   
           queryFn: getAllPost  , 
           queryKey : "myposts"
       })
   
       if(postdata){
   
           return <LodingCard/>
       }
   
       if(dataerror ){
           <h1> hasl error</h1>
   
       }

   

   if(isLoading){

     return <LodingCard />
   }

   if(isError){


     return <h1> hasl error</h1>
   }


  return (<div className=' w-2/4 flex-col gap-2'>

   <Card className="py-4 my-2">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h4 className="text-tiny uppercase font-bold">  {data?.data.data.user.gender}</h4>
        <span className="text-default-500">{data?.data.data.user.email}</span>
        <p className="font-bold text-large">{data?.data.data.user.name}</p>
      </CardHeader>
      <div className=' flex justify-between'>
          <span className=' my-2 ms-2'> followers : {data?.data.data.user.name.followersCount}</span>
        <span className=' my-2 me-5'> following : {data?.data.data.user.name.followingCount}</span>
      </div>
      <CardBody className="overflow-visible py-2">
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src={data?.data.data.user.photo}
          width={270}
        />
      </CardBody>
    </Card>

{myposts?.data.data.posts.map((post)=> <MyPosts  key={post.id}  post={post}/>)}
  </div>
   
  )
}
