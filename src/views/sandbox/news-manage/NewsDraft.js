import React, { useState, useEffect } from 'react'
import { Table, Button, Modal,} from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined,UploadOutlined } from '@ant-design/icons'
import axios from 'axios'

const { confirm } = Modal;
export default function NewsDraft () {
  const [dataSource, setDataSource] = useState([ ])
  const {username}  = JSON.parse(localStorage.getItem("token"))

  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then((resp) => {
      const list = resp.data
      setDataSource(list);
    })
  }, [username])
  
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
      title: '新闻标题',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: '作者',
      dataIndex: 'author'
    },
    {
        title: '分类',
        dataIndex: 'category',
        render:(category)=>{
            return category.label
        }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger type="primary" shape="circle" icon={<DeleteOutlined />} onClick={()=>{confirmMethod(item)}}></Button>
          <Button shape="circle" icon={<EditOutlined />}></Button>

          <Button type="primary" shape="circle" icon={<UploadOutlined />}></Button>

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
    setDataSource(dataSource.filter((data) => { return data.id != item.id }));
      axios.delete(`/news/${item.id}`);
    
  }


  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 4 }} rowKey={ item => item.id }/>
    </div>
  )
}
