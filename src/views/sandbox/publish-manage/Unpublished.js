import { Button } from 'antd';
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish';

export default function Unpublished() {
  const [dataSource, setDataSource] = useState([])
  const roleObj = {
    "1": "superadmin",
    "2": "admin",
    "3": "editor"
  }
  const { roleId, region, username } = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    axios.get('news?publish=1&_expand=category').then((res) => {
      console.log(res.data);
      const list = res.data
      // 如果是登录用户是超级管理员，可以检索整个list,否则把自己的和同一区域下的编辑检索出来
      setDataSource(roleObj[roleId] === "superadmin" ? list : [
        ...list.filter(item => item.author === username),
        ...list.filter(item => item.region === region && roleObj[item.roleId] === "admin")
      ])
    })
  }, [])
  return (
    <div>
      <NewsPublish
        dataSource={dataSource}
        button={(id) =>
          <Button type="primary">
            发布
          </Button>}
      >
        
      </NewsPublish>
    </div>
  )
}
