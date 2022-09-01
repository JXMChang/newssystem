import React from 'react'
import {HashRouter,Route,Switch,Redirect} from 'react-router-dom'
import Login from '../views/Login/Login'
import NewsSandBox from '../views/sandbox/NewsSandBox'
export default function IndexRouter() {
  return (
    <HashRouter>
      {/* V5：模糊匹配，使用Switch：匹配到一个之后就停止匹配 */}
      {/* <Route path="/login" component={Login}/>
      <Route path="/" component={NewsSandBox}/> */}
      <Switch>
        <Route path="/login" component={Login} />
        {/* <Route path="/" component={NewsSandBox}/> */}
        <Route path="/" render={()=>
          localStorage.getItem("token")=="false"?
          <NewsSandBox ></NewsSandBox>:
          <Redirect to="/login"/>
        }/>

      </Switch>
    </HashRouter>
  )
}
