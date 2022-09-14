import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Table, Tree, Button, Modal } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
const { confirm } = Modal;

export default function RoleList() {
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rightList, setRightList] = useState([]);
  const [currentRights, setCurrentRights] = useState([]);
  const [currentId, setCurrentId] = useState(0); // 记录id，以便点击OK时更新dataSource

  useEffect(() => {
    axios.get("/roles").then((resp) => {
      setDataSource(resp.data)
    })
  }, [])

  useEffect(() => {
    axios.get("/rights?_embed=children").then((resp) => {
      const list = resp.data

      list.forEach(item => {
        item.title = item.label;
        item.children.forEach(child => {
          child.title = child.label;
        })
      })
      setRightList(list);
    })
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
          return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName'
    },
    {
      title: "操作",
      render: (item) => {
        return <div>
            <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
          <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => {
            setIsModalVisible(true);
            setCurrentRights(item.rights);
            setCurrentId(item.id);
          }}/>
        </div>
      }
    }
  ]

  const confirmMethod = (item) => {
    confirm({
      title: '你确定要删除?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk () {
        //   console.log('OK');
        deleteMethod(item);
      },
      onCancel () {
        //   console.log('Cancel');
      },
    });

  };
  
  const deleteMethod = (item) => {
    // console.log(item)
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/roles/${item.id}`)
  };

  const handleOk = () => {
    setIsModalVisible(false);
    console.log(currentRights);
    //同步datasource，不影响原来的dataSource
    setDataSource(dataSource.map((item) => {
      if (item.id == currentId) {
        return {
          ...item,
          rights: currentRights
        };
      }
      return item;
    }))

    axios.patch(`/roles/${currentId}`, {
      rights:currentRights
    })

  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const onCheck = (checkkeys) => {
    // console.log(checkkeys,checkkeys.checked);
    setCurrentRights(checkkeys.checked);
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 4 }} rowKey={ item => item.id }/>

      <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          checkedKeys = {currentRights}
          treeData={rightList}
          onCheck={onCheck}
          checkStrictly = {true}
        />

      </Modal>
    </div>
  )
}
