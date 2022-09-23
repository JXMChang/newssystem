// 自定义hooks
import { useEffect, useState } from 'react'
import axios from 'axios'
import { notification } from 'antd';

export default function usePublish(type) {
  const [dataSource, setDataSource] = useState([])
  const roleObj = {
    "1": "superadmin",
    "2": "admin",
    "3": "editor"
  }
  const { roleId, region, username } = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    axios.get(`news?publishState=${type}&_expand=category`).then((res) => {
      console.log('usePublish',res.data);
      const list = res.data
      // 如果是登录用户是超级管理员，可以检索整个list,否则把自己的和同一区域下的编辑检索出来
      setDataSource(roleObj[roleId] === "superadmin" ? list : [
        ...list.filter(item => item.author === username),
        ...list.filter(item => item.region === region && roleObj[item.roleId] === "admin")
      ])
    })
  }, [])

  const handlePublish = (id) => {
    setDataSource(dataSource.filter(item => item.id !== id))

    axios.patch(`/news/${id}`, {
      "publishState": 2,
      "publishTime": Date.now()
    }).then(res => {
      notification.info({
        message: `通知`,
        description:
          `您可以到【发布管理/已经发布】中查看您的新闻`,
        placement: "bottomRight"
      });
    })
  };

  const handleSunset = (id) => {
    setDataSource(dataSource.filter(item => item.id !== id))

    axios.patch(`/news/${id}`, {
      "publishState": 3,
    }).then(res => {
      notification.info({
        message: `通知`,
        description:
          `您可以到【发布管理/已下线】中查看您的新闻`,
        placement: "bottomRight"
      });
    })
  };

  const handleDelete = (id) => {
    setDataSource(dataSource.filter(item => item.id !== id))

    axios.delete(`/news/${id}`).then(res => {
      notification.info({
        message: `通知`,
        description:
          `您已经删除了已下线的新闻`,
        placement: "bottomRight"
      });
    })

  };
  
  return {
    dataSource,
    handlePublish,
    handleSunset,
    handleDelete
  }
}
