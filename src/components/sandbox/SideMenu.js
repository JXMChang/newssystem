import React, { useState,useEffect } from 'react'
import {withRouter} from 'react-router-dom'
import './index.css'


import { Layout, Menu } from 'antd';
import {
} from '@ant-design/icons';
import axios from 'axios';
const { Sider } = Layout;


function SideMenu (props) {
  const [collapsed] = useState(false);
  const [menu,setMenu] = useState([]);

  useEffect(() => {
    axios.get("/rights?_embed=children").then((resp) => {
      resp.data = resp.data.filter(item => item.pagepermisson);
      resp.data.forEach(item => {
        if (item.children.length == 0) {
          // delete item.children
          Reflect.deleteProperty(item, 'children')
        } else {
          /* item.children.forEach((child, index) => {
            console.log(child,child.pagepermisson);
            if (child.pagepermisson) {
              // item.children.splice(index, 1); // 继续循环时数组已经被改变了
            }
          }) */
          
          for(var i=0;i<item.children.length;i++){
            if(!item.children[i].pagepermisson){
              // 删除元素
              item.children.splice(i,1);
              if (item.children.length == 0) {
                // delete item.children
                Reflect.deleteProperty(item, 'children')
                break;
              }
              // 修改i的值！
              i--;
            }
            
          }
        }
      });
      console.log(resp.data);
      setMenu(resp.data)
    })
  }, [])

  /* const items = [UserOutlined, LaptopOutlined, NotificationOutlined].map((icon, index) => {
    const key = String(index + 1);
    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: `subnav ${key}`,
      children: new Array(4).fill(null).map((_, j) => {
        const subKey = index * 4 + j + 1;
        return {
          key: subKey,
          label: `option${subKey}`,
        };
      }),
    };
  }); */
  function getItem(label, key,  children) {
    return {
      key,
      children,
      label,
    };
  }
  
  const items = [
    getItem('首页', '/home'),
    getItem('用户管理', '/user-manage', [
      getItem('用户列表', '/user-manage/list')
    ]),
    getItem('权限管理', '/right-manage', [
      getItem('角色列表', '/right-manage/role/list'),
      getItem('权限列表', '/right-manage/right/list')
    ]),
    getItem('新闻管理', '/news-manage', [
      getItem('新闻列表', '/news-manage/list')
    ]) ,
    getItem('审核管理', 'sub4', [
      getItem('新闻列表', '4')
    ]),
    getItem('发布管理', 'sub5', [
      getItem('新闻列表', '4')
    ])
  ];

  
  const selectedKey = [props.location.pathname]
  const openKeys = ["/"+props.location.pathname.split("/")[1]]

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div style={{display:"flex",height:"100%","flexDirection":"column"}}>

        <div className="logo" >全球新闻发布管理系统</div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={selectedKey}
          defaultOpenKeys={openKeys}
          items={menu}
          onClick={(e) => {
            console.log(props,e.key);
            props.history.push(e.key)
          }}
          style={{flex:1,"overflow":"auto"}}
          />
      </div>
    </Sider>
  )
}
export default withRouter(SideMenu)
