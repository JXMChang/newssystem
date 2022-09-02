import React from 'react'
import { Routes,Route, Navigate } from "react-router-dom";
import Login from '../views/login/Login';
export default function IndexRouter() {
  return (
      <Routes>
        <Route path="/login" element={<Login/>}></Route>
        {/* <Route path="/" element={<NewsSandBox/>}></Route> */}
        {/* <Route path="/" element={<AuthComponent>
                {<Home/>}
            </AuthComponent>}></Route> */}
        {/* <Route path="/" element={<Navigate to="/home"/>}></Route> */}
        <Route path="/" element={localStorage.getItem("token") ? <Navigate to="/home"/>:<Navigate to="/login"/>}></Route>
        
      </Routes>
  )
}
function AuthComponent({children}){
  const isLogin = localStorage.getItem("token")
  return isLogin?children:<Navigate to="/login"/>
}
