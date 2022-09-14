import React, { useEffect, useState } from 'react'

import {HashRouter,Route,Switch,Redirect} from 'react-router-dom'

import Home from '../../views/sandbox/home/Home'
// import Nopermission from '../../views/sandbox/nopermission/Nopermission'
import RightList from '../../views/sandbox/right-manage/RightList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import UserList from '../../views/sandbox/user-manage/UserList'
import NotFound from '../../views/error/NotFound'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview'
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate'
import axios from 'axios'

const LocalRouterMap = {
  "/home": Home,
  "/user-manage/list": UserList,
  "/right-manage/role/list": RoleList,
  "/right-manage/right/list": RightList,
  "/news-manage/add": NewsAdd,
  "/news-manage/draft": NewsDraft,
  "/news-manage/category": NewsCategory,
  "/news-manage/preview/:id": NewsPreview,
  "/news-manage/update/:id": NewsUpdate,
  "/audit-manage/audit": Audit,
  "/audit-manage/list": AuditList,
  "/publish-manage/unpublished": Unpublished,
  "/publish-manage/published": Published,
  "/publish-manage/sunset": Sunset
}

export default function NewsRouter () {
  const [backRouteList, setBackRouteList] = useState([])

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8000/rights"),
      axios.get("http://localhost:8000/children"),
    ]).then(resp => {
      setBackRouteList([...resp[0].data, ...resp[1].data])

      // console.log(backRouteList)

    })
  }, [])
  
  // 判断在权限列表中是否打开开关
  const checkRoute = (item) => {
    return LocalRouterMap[item.key] && item.pagepermisson
    
  }

  const { role: { rights } } = JSON.parse(localStorage.getItem("token"));
  // console.log("rights",rights);

  // 判断当前登录用户的权限
  const checkUserPermission = (item) => {
    // 当前用户权限列表是否包含
    return rights.includes(item.key)
  }
  return (
    <Switch>
      {
        backRouteList.map(item => {
          if (checkRoute(item) && checkUserPermission(item)) {
            
            return <Route path={item.key} key={item.key} component={LocalRouterMap[item.key]} exact/>
          }
          // return <NotFound/>
          return null
        })
      }
      
      <Redirect from="/" to="/home" exact/>
      {/* <Route path="*" component={NotFound} /> */}
      {/* 防止backRouteList未准备好，先把NotFound渲染出来了 */}
      {
        backRouteList.length >=0 && <Route path="*" component={NotFound} />
      }
    </Switch>
  )
}
