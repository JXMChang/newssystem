import axios from 'axios'
import React, { useState, useEffect, useRef } from 'react'
import { Table, Switch, Button, Modal  } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm';
const { confirm } = Modal;
export default function UserList() {
  const [dataSource, setdataSource] = useState([]);
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [roleList, setRoleList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const addFormRef = useRef(null);

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
            <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} disabled={item.default}/>
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
    console.log("addFormRef", addFormRef);
    addFormRef.current.validateFields().then(value => {
      console.log(value);
      setIsAddVisible(false);

      addFormRef.current.resetFields();

      //post到后端，生成id，再设置 datasource, 方便后面的删除和更新
      axios.post(`http://localhost:8000/users`, {
        ...value,
        "roleState": true,
        "default": false,
      }).then(res=>{
        console.log(res.data)
        setdataSource([...dataSource, {
          role:roleList.filter(item=>item.id===value.roleId)[0],
          ...res.data
        }])
      })
    }).catch(err => {
      console.log(err);
    })
  }

  const confirmMethod = (item) => {
    confirm({
      title: '你确定要删除?',
      // content: 'Some descriptions',
      onOk() {
        //   console.log('OK');
        deleteMethod(item);
      },
      onCancel() {
        //   console.log('Cancel');
      },
    });

  }
  //删除
  const deleteMethod = (item) => {
    // console.log(item)
    // 当前页面同步状态 + 后端同步
    setdataSource(dataSource.filter(data => data.id !== item.id));
    axios.delete(`http://localhost:8000/users/${item.id}`);
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
        <UserForm regionList={regionList} roleList={roleList} ref={addFormRef}></UserForm>
      </Modal>
    </div>
  )
}
