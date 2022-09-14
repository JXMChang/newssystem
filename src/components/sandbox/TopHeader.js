import React, { useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined 
} from '@ant-design/icons';
import { Layout,Dropdown, Menu,Avatar  } from 'antd';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
const { Header } = Layout;
function TopHeader (props) {
  const [collapsed, setCollapsed] = useState(false);
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <span>
              超级管理员
            </span>
          ),
        },
        {
          key: '2',
          label: (
            <span  onClick={()=>{
              localStorage.removeItem("token")
              // console.log(props.history)
              props.history.replace("/login")
            }}>
              退出
            </span>
          ),
          danger: true,
        },
      ]}
    />
  );
  return (
    <Header
      className="site-layout-background"
      style={{
        padding: "0 16px",
      }}
    >
      {/* {
        collapsed ? <MenuUnfoldOutlined onClick={ () => setCollapsed(!collapsed) }/>:<MenuFoldOutlined  onClick={ () => setCollapsed(!collapsed) }/>
      } */}
      {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: () => setCollapsed(!collapsed),
      })}

      <div style={{float:"right"}}>
        <span>欢迎回来</span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}
export default withRouter(TopHeader)
