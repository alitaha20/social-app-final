import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react"
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useContext, useRef, useState } from 'react'
import { FaFile } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { authContext } from '../../contaxt/authContextPorvder'
import LodingCard from '../ProdactCard/LodingCard'
import ProdactCard from '../ProdactCard/ProdactCard'




export default function Home() {

  
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [imageUrl, setImageUrl] = useState()
  
  const {Token} = useContext(authContext)

 const inputRef =  useRef(null)
  const textRef =  useRef(null)

 async function getAllPosts(){

  return axios.get("https://route-posts.routemisr.com/posts" , {
    headers : {
      token : Token
    }
  })

} 

function changePerview (){

const imagepreview = inputRef.current.files[0]

const imageUrl = URL.createObjectURL(imagepreview)


setImageUrl(imageUrl)
}


const{data ,isLoading ,isError , refetch} =useQuery({
  queryFn: getAllPosts,
  queryKey : "firstposts",
  gcTime : 1000*60*5 , 
})


function clearImage (){
   setImageUrl(null)
   inputRef.current.value = ""
}




function creatPost (){
  const inputValue = inputRef.current.files[0]
  const textValue = textRef.current.value


const formData = new FormData ()

if(inputValue){


  formData.append("image" , inputValue)
  
}


if(textValue){
  
  
  formData.append("body" , textValue)

}

return axios.post(`https://route-posts.routemisr.com/posts` , formData , {
  headers : {
    token : Token 
  }
})

}


// function updataPost (){
//   const inputValue = inputRef.current.files
//   const textValue = textRef.current.value


// const formData = new FormData ()

// if(inputValue){


//   formData.append("image" , inputValue)
  
// }


// if(textValue){
  
  
//   formData.append("body" , textValue)

// }

// return axios.put( `https://route-posts.routemisr.com/posts/${post.id}`, formData , {
//   headers : {
//     token : Token 
//   }
// })

// }



  
const {isPending , mutate} = useMutation({
mutationFn: creatPost , 
onSuccess : (data)=> {


  console.log(data)
clearImage()

refetch()

toast.success("post created" , 
  {position : 'top-center' })

onOpenChange(true)

textRef.current.value = ""

}, 
onError: (error)=> {
console.log (error)
  
}

})




if(isLoading){
  return <LodingCard/>

}

if(isError){
  return <h1> Error kber </h1>
}



  return (<>
<div className=' flex-col justify-center items-center mb-3'>
  <div className=' w-1/2 m-auto  flex justify-center'>
          <Button className=' font-semibold my-4 w-full' onPress={onOpen}>what are your opinon</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"> create a post</ModalHeader>
              <ModalBody>
                
                <textarea className='p-3 border-2 border-sky-300 rounded-2xl' ref={textRef} placeholder=' write a post ... ' id="textInput"></textarea>

                <input type="file" onChange={changePerview} ref={inputRef} className=' hidden' id='fileinput' />
                
                <label className=' bg-gray-300 border rounded-xl w-fit p-2 flex gap-2 items-center cursor-pointer'  htmlFor="fileinput"><FaFile /> select a file </label>       
                       </ModalBody>
             <div className=' relative'>
              {imageUrl && <Button onPress={clearImage} className='absolute p-2 top-0 bg-red-500 text-white right-2'> x </Button>}
                 <img  className='w-1/2 m-auto' src={imageUrl} />

             </div>
             
              <ModalFooter>

                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" disabled={isPending} onPress={mutate}>
                  {isPending ? "loading" : "creata post"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

  </div>

  { data.data.data.posts.map((post)=> <ProdactCard key={post.id} post={post}  onOpenChange={()=>{onOpenChange(true)}} />) }
  


  </div>  
  </>
  )
}
