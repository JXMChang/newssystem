import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'

const { confirm } = Modal;
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
      render: (item) => {
        return <div>
          <Button danger type="primary" shape="circle" icon={<DeleteOutlined />} onClick={()=>{confirmMethod(item)}}></Button>

          <Popover content={<div style={{textAlign:"center"}}>
                              <Switch checked={item.pagepermisson} onChange={()=>switchMethod(item)}></Switch>
                            </div>}
             title="页面配置项" trigger={item.pagepermisson === undefined ? '' : 'click'}>

            <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson===undefined}></Button>
          </Popover>
        </div>
      }
    }
  ];
  
  const confirmMethod = (item) => {
    confirm({
      title: '你确定要删除?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk() {
          //   console.log('OK');
          deleteMethod(item)
      },
      onCancel() {
          //   console.log('Cancel');
      },
    });
  }

  const deleteMethod = (item) => {
    console.log(item);
    if (item.grade === 1) {
      // 一级权限
      setDataSource(dataSource.filter((data) => { return data.id != item.id }));
      axios.delete(`http://localhost:8000/rights/${item.id}`);
    } else {
      // 二级权限
      const parentRight = dataSource.filter((data) => { return data.id == item.rightId })
      parentRight[0].children = parentRight[0].children.filter((data) => { return data.id != item.id })
      console.log(dataSource);
      setDataSource([...dataSource])
      axios.delete(`http://localhost:8000/children/${item.id}`)
    }
    
  }

  const switchMethod = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
    console.log("switchMethod",dataSource);
    setDataSource([...dataSource])
    if(item.grade === 1){
      axios.patch(`http://localhost:8000/rights/${item.id}`, {
        pagepermisson: item.pagepermisson
      });
    }else{
      axios.patch(`http://localhost:8000/children/${item.id}`, {
        pagepermisson: item.pagepermisson
      });
    }
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 4 }} rowKey={ item => item.id }/>
    </div>
  )
}
