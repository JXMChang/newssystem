import React, { useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined 
} from '@ant-design/icons';
import { Layout,Dropdown, Menu,Avatar  } from 'antd';
const { Header } = Layout;
export default function TopHeader () {
  const [collapsed, setCollapsed] = useState(false);
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
              超级管理员
            </a>
          ),
        },
        {
          key: '2',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
              退出
            </a>
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
