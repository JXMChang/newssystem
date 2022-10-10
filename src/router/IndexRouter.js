import React from 'react'
import {HashRouter,Route,Switch,Redirect} from 'react-router-dom'
import Login from '../views/Login/Login'
import Detail from '../views/news/Detail'
import News from '../views/news/News'
import NewsSandBox from '../views/sandbox/NewsSandBox'
export default function IndexRouter() {
  return (
    <HashRouter>
      {/* V5：模糊匹配，使用Switch：匹配到一个之后就停止匹配 */}
      {/* <Route path="/login" component={Login}/>
      <Route path="/" component={NewsSandBox}/> */}
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/news" component={News} />
        <Route path="/detail/:id" component={Detail}/>

        {/* <Route path="/" component={NewsSandBox}/> */}
        <Route path="/" render={()=>
          localStorage.getItem("token")?
          <NewsSandBox ></NewsSandBox>:
          <Redirect to="/login"/>
        }/>

      </Switch>
    </HashRouter>
  )
}
