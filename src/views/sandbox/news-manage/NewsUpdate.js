import { Button, PageHeader, Steps, Form, Input,Select, message, notification } from 'antd'
import axios from 'axios';

import React, { useEffect, useRef, useState } from 'react'
import NewsEditor from '../../../components/news-manage/NewsEditor';
import style from './News.module.css'
const { Step } = Steps;
const { Option } = Select;

export default function NewsUpdate (props) {
  const [current, setCurrent] = useState(0);
  const [categoryList, setCategoryList] = useState([])

  const [formInfo, setFormInfo] = useState({})
  const [content, setContent] = useState("")


  const NewsForm = useRef(null)


  useEffect(() => {
    axios.get("/categories").then(res => {
      // console.log(res.data)
      setCategoryList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
      // setNewsInfo(res.data)

      // 显示：content、formInfo
      let { label, categoryId, content } = res.data;

      NewsForm.current.setFieldsValue({
        label,
        categoryId
      })
      setContent(content)
    })
  }, [props.match.params.id])

  const handleNext = () => {
    if (current == 0) {
      NewsForm.current.validateFields().then(res => {
        console.log(res)
        setFormInfo(res)
        setCurrent(current + 1)
      }).catch(error => {
        console.log(error)
      })
    } else {
      // 从来没点过：空字符串；写了之后又删除了：带相关标签
      if (content === "" || content.trim() === "<p></p>") {
        message.error("新闻内容不能为空")
      } else {
        setCurrent(current + 1)
      }
    }
  }
  const handlePrevious = () => {
    setCurrent(current - 1)
  }
  const User = JSON.parse(localStorage.getItem("token"))

  const handleSave = (auditState) => {
    axios.patch(`/news/${props.match.params.id}`, {
      ...formInfo,
      "content": content,
      "auditState": auditState,
  }).then(res => {
      props.history.push(auditState===0?'/news-manage/draft':'/audit-manage/list')

      notification.info({
        message: `通知`,
        description:
          `您可以到${auditState===0?'草稿箱':'审核列表'}中查看您的新闻`,
        placement:"bottomRight"
      });
    })
  }

  const onFinish = () => {
    
  }

  const onFinishFailed = () => {
    
  }
  
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="更新新闻"
        onBack={()=>props.history.goBack()}
        subTitle="This is a subtitle"
      />

      <Steps current={current}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主体内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>
      
      {/* 用样式控制而不是判断组件是否渲染/销毁，避免返回上一步之前填写的数据不见了 */}
      <div className={current==0 ? '':style.active}  style={{ marginTop: "50px" }}>
        <Form
          name="basic"
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 20,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          ref={NewsForm}
        >
          <Form.Item
            label="新闻标题"
            name="label"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="新闻分类"
            name="categoryId"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Select>
              {
                categoryList.map(item =>
                  <Option value={item.id} key={item.id}>{item.label}</Option>
                )
              }
            </Select>
          </Form.Item>
        </Form>
      </div>

      <div className={current === 1 ? '' : style.active}>
        <NewsEditor getContent={(value) => {
          // console.log(value)
          setContent(value)
        }} content={content}></NewsEditor>
      </div>

      <div style={{ marginTop: "50px" }}>
        {
            current === 2 && <span>
                <Button type="primary" onClick={() => handleSave(0)}>保存草稿箱</Button>
                <Button danger onClick={() => handleSave(1)}>提交审核</Button>
            </span>
        }
        {
            current < 2 && <Button type="primary" onClick={handleNext}>下一步</Button>
        }
        {
            current > 0 && <Button onClick={handlePrevious}>上一步</Button>
        }
      </div>

    </div>
  )
}
