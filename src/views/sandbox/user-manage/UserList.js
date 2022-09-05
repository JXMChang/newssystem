import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Table, Switch, Button, Modal } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
const { confirm } = Modal;
export default function UserList() {
  const [dataSource, setdataSource] = useState([])

  useEffect(() => {
    axios.get("http://localhost:8000/users").then((resp) => {
      setdataSource(resp.data)
    })
  }, [])

  const columns = [
    {
        title: '区域',
        dataIndex: 'region',
        render: (region) => {
            return <b>{region === "" ? '全球' : region}</b>
        }
    },
    {
        title: '角色名称',
        dataIndex: 'roleId',
    },
    {
        title: "用户名",
        dataIndex: 'username',
    },
    {
        title: "用户状态",
        dataIndex: 'roleState',
        render: () => {
            return <Switch></Switch>
        }
    },
    {
        title: "操作",
        render: (item) => {
          return <div>
            <Button danger shape="circle" icon={<DeleteOutlined />}/>
            <Button type="primary" shape="circle" icon={<EditOutlined />}/>
          </div>
        }
    }
  ];
  
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
            pageSize: 5
        }}
        rowKey={item => item.id}
      />
    </div>
  )
}
