// 自定义hooks
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function usePublish(type) {
  const [dataSource, setDataSource] = useState([])
  const roleObj = {
    "1": "superadmin",
    "2": "admin",
    "3": "editor"
  }
  const { roleId, region, username } = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    axios.get(`news?publish=${type}&_expand=category`).then((res) => {
      console.log('usePublish',res.data);
      const list = res.data
      // 如果是登录用户是超级管理员，可以检索整个list,否则把自己的和同一区域下的编辑检索出来
      setDataSource(roleObj[roleId] === "superadmin" ? list : [
        ...list.filter(item => item.author === username),
        ...list.filter(item => item.region === region && roleObj[item.roleId] === "admin")
      ])
    })
  }, [])
  
  return {
    dataSource
  }
}
