import React,{useState,useEffect} from 'react'
import axios from 'axios'
import {Table,Button,notification} from 'antd'
import _ from 'lodash'

export default function Audit() {
  const [dataSource, setDataSource] = useState([]);
  const { roleId, region, username } = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    const roleObj = {
      "1": "superadmin",
      "2": "admin",
      "3": "editor"
    }
    axios.get(`/news?auditState=1&_expand=category`).then(res => {
      const list = res.data
      // 如果是登录用户是超级管理员，可以检索整个list,否则把自己的和同一区域下的编辑检索出来
      setDataSource(roleObj[roleId] === "superadmin" ? list : [
        ...list.filter(item => item.author === username),
        ...list.filter(item => item.region === region && roleObj[item.roleId] === "editor")
      ])
    })
  }, [roleId, region, username]);
  useEffect(() => {
    console.log("lodash");
    axios.get("/news?publishState=2&_expand=category").then(res => {
      console.log(res.data);
      console.log(_.groupBy(res.data, item => item.category.label))
      console.log(Object.entries(_.groupBy(res.data, item => item.category.label)))
    })
}, [])
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'label',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author'
    },
    {
      title: "新闻分类",
      dataIndex: 'category',
      render: (category) => {
        return <div>{category.label}</div>
      }
    },
    {
      title: "操作",
      render: (item) => {
        return <div>
          <Button type="primary" onClick={() => handleAudit(item, 2, 1)}>通过</Button>
          <Button danger onClick={() => handleAudit(item, 3, 0)}>驳回</Button>
        </div>
      }
    }
  ];

  const handleAudit = (item, auditState, publishState) => {
    setDataSource(dataSource.filter(data => data.id !== item.id))

    axios.patch(`/news/${item.id}`, {
      auditState,
      publishState
    }).then(res => {
      notification.info({
        message: `通知`,
        description:
          `您可以到[审核管理/审核列表]中查看您的新闻的审核状态`,
        placement: "bottomRight"
      });
    })
  }

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
