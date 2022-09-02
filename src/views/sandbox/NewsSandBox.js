import React from 'react'
import Home from './home/Home'
import RightList from './right-manage/RightList'
import RoleList from './right-manage/RoleList'
import UserList from './user-manage/UserList'
import { Routes,Route } from "react-router-dom";

export default function NewsSandBox() {
  return (
    <div>
      <Routes>
        <Route path="/home" element={<Home/>}></Route>
        <Route path="/user-manage/list" element={<UserList/>}></Route>
        <Route path="/right-manage/role/list" element={<RoleList/>}></Route>
        <Route path="/right-manage/right/list" element={<RightList/>}></Route>
        
      </Routes>
    </div>
  )
}

