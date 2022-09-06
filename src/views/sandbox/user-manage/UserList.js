import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Table, Switch, Button, Modal  } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm';
const { confirm } = Modal;
export default function UserList() {
  const [dataSource, setdataSource] = useState([]);
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [roleList, setRoleList] = useState([]);
  const [regionList, setRegionList] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/users?_expand=role").then((resp) => {
      setdataSource(resp.data);
    });
  }, [])

  useEffect(() => {
    axios.get("http://localhost:8000/regions").then(resp => {
      setRegionList(resp.data)
      console.log(regionList);
    })
  }, [])

  useEffect(() => {
    axios.get("http://localhost:8000/roles").then(resp => {
      setRoleList(resp.data)
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
        title: 'roleId',
        dataIndex: 'roleId',
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role?.roleName;
      }
    },
    {
        title: "用户名",
        dataIndex: 'username',
    },
    {
        title: "用户状态",
        dataIndex: 'roleState',
        render: (roleState,item) => {
          return <Switch checked={roleState} disabled={item.default} onChange={()=>handleChange(item)}></Switch>
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
  const handleChange = (item) => {
    item.roleState = !item.roleState;
    setdataSource([...dataSource]);

    axios.patch(`http://localhost:8000/users/${item.id}`, {
      roleState: item.roleState
    });
  }

  const addFormOK = () => {
    
  }


  return (
    <div>
      <Button type="primary" onClick={() => {
          setIsAddVisible(true)
      }}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
            pageSize: 5
        }}
        rowKey={item => item.id}
      />

      <Modal
        visible={isAddVisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
            setIsAddVisible(false)
        }}
        onOk={() => addFormOK()}
      >
        <UserForm regionList={regionList} roleList={roleList} ></UserForm>
      </Modal>
    </div>
  )
}
