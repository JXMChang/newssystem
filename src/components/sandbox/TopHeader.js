import React, { useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined 
} from '@ant-design/icons';
import { Layout,Dropdown, Menu,Avatar  } from 'antd';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { connect } from 'react-redux';
const { Header } = Layout;
function TopHeader (props) {
  console.log("TopHeader",props);
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

/* 
  connect()执行完之后返回一个全新的高阶函数，再次包装withRouter；
    1）两层是因为像withRouter包装完之后，还需要借助props，例如props.history.push()
    2）两层包装完之后，可以让我们决定要通过哪个状态和属性获取值

  connect用法：
    connect(
      //  mapStateToProps：将redux中的状态映射成自己的属性，可以通过props.访问
      //  mapDispatchToProps：将redux中的Dispatch方法映射成自己的属性，可以通过props.访问
    )
*/

const mapStateToProps = ({CollApsedReducer:{isCollapsed}}) => {
  return {
    isCollapsed
  }
}

export default connect(mapStateToProps)(withRouter(TopHeader))
// export default connect(withRouter(TopHeader))
