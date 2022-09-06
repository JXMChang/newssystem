import React, { forwardRef, useState } from 'react'
import { Form, Input, Select,  } from 'antd'
const { Option } = Select;

const UserForm = forwardRef((props, ref) => {
  const [isDisabledOfRegion, setIsDisabledOfRegion] = useState(false)

  return (
    <Form
      ref={ref}
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      autoComplete="off"
      layout="vertical"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="region"
        name="region"
        rules={isDisabledOfRegion ? [] : [{ required: true, message: 'Please input your region!' }]}
      >
        <Select disabled={isDisabledOfRegion}>
          {
            props.regionList.map(item => {
              return <Option value={item.id} key={item.id}>{item.label}</Option>
            })
          }
        </Select>
      </Form.Item>

      <Form.Item
        label="roleId"
        name="roleId"
        rules={[{ required: true, message: 'Please input your roleId!' }]}
      >
        <Select onChange={(value) => {
          if(value == 1){
            setIsDisabledOfRegion(true);
            console.log(isDisabledOfRegion);
            ref.current.setFieldsValue({
                region:""
            })
          }else{
            setIsDisabledOfRegion(false);
          }
        }}>
          {
            props.roleList.map(item => {
              return <Option value={item.value} key={item.id}>{item.roleName}</Option>
            })
          }
        </Select>
      </Form.Item>
    </Form>
  )
})

export default UserForm
