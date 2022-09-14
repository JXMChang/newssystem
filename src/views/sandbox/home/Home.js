import React from 'react'
import { Button } from 'antd';
import axios from 'axios';
export default function Home () {
  const getData = () => {
    // 取：get
    /* axios.get("/posts/1").then((resp) => {
      console.log(resp.data);
    }) */

    // 取：post
    /* axios.post("/posts", {
      title: "Eden post",
      author:"Eden"
    }) */

    // 修改：put，会将其他未传入的属性删除
    /* axios.put("/posts/1", {
      author:"Eden"
    }) */

    // 修改：put，只会更新传入的属性
    /* axios.patch("/posts/2", {
      author:"Eden"
    }) */

    // 删除：delete 会将有关联的数据表中的数据删除
    // axios.delete("/posts/2")

    // _embed：取有关联的数据表（向下关联：新闻——>评论）
    /* axios.get("/posts?_embed=comments").then((resp) => {
      console.log(resp);
    }) */

    // _expand：取有关联的数据表（向上关联：评论——>新闻）
    /* axios.get("/comments?_expand=post").then((resp) => {
      console.log(resp);
    }) */
  }
  return (
    <div>
      <Button type="primary" onClick={getData}>Primary Button</Button>
    </div>
  )
}
