import React, { useState,useEffect } from 'react'
import {Table,Tag,Button} from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

import axios from 'axios'
export default function RightList () {
  const [dataSource, setDataSource] = useState([ ])

  useEffect(() => {
    axios.get("http://localhost:8000/rights?_embed=children").then((resp) => {
      const list = resp.data

      list.forEach(item => {
        if (item.children.length === 0) {
          item.children = ""
        }
      })
      setDataSource(list);
    })
  }, [])
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'name',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'label',
      key: 'name',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      key: 'name',
      render: (key) => {
        return <Tag color="orange">{key}</Tag>
      }
    },
    {
      title: '操作',
      render: () => {
        return <div>
          <Button danger type="primary" shape="circle" icon={<DeleteOutlined />}></Button>
          <Button type="primary" shape="circle" icon={<EditOutlined />}></Button>
        </div>
      }
    }
  ];
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 4 }}/>
    </div>
  )
}
