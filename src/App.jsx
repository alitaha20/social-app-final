import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import AuthRoute from '../componant/AuthRoute'
import Layout from '../componant/Layout'
import ProtectMode from '../componant/ProtectMode'
import AuthContextPorvder from '../contaxt/authContextPorvder'
import Home from '../pages/Home/Home'
import Login from '../pages/Login/Login'
import PostDetils from '../pages/PostDetils/PostDetils'
import Rigister from '../pages/Rigister/Rigister'
import Profile from '../pages/profile/profile'

export default function App() {

  const router = createBrowserRouter([{path: "/" , element: <Layout/> 
    , children:[
    {index:true ,element : <Login/>}, 
    {path : "home" ,element : <ProtectMode> <Home/></ProtectMode> }, 
    {path: "login" ,element : <AuthRoute> <Login/> </AuthRoute>}, 
    {path : "rigister" ,element :<AuthRoute> <Rigister/> </AuthRoute>}, 
    {path : "profile" ,element :<ProtectMode><Profile/>  </ProtectMode>}, 
    {path : "PostDetils/:postid" ,element :<ProtectMode> <PostDetils/> </ProtectMode>}, 
    
  ]
}])

let client = new QueryClient()

  return (
<>

<QueryClientProvider client={client}>

  <AuthContextPorvder>


    <ToastContainer />

<RouterProvider router={router}/>
  
</AuthContextPorvder>

</QueryClientProvider>


</>
  )
}
