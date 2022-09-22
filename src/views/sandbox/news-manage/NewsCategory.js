import React, { useState, useEffect,useRef,useContext } from 'react'
import { Button, Table, Modal,Form,Input } from 'antd'
import axios from 'axios'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
const { confirm } = Modal

export default function NewsCategory() {
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    axios.get("/categories").then(res => {
      console.log(res.data);
      setDataSource(res.data)
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
      title: '栏目名称',
      dataIndex: 'label',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'label',
        title: '栏目名称',
        handleSave: handleSave,
      }),
  
    },
    {
      title: "操作",
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
        </div>
      }
    }
  ];
  const handleSave = (record) => {

    /* setDataSource(dataSource.map(item => {
      if (item.id === record.id) {
        return {
          id: item.id,
          label: record.label,
          value: record.title
        }
      }
      return item
    })) */
    // 找到后停止查找
    let currentObj = dataSource.find(item => { return item.id == record.id })
    currentObj.label = record.label;
    currentObj.value = record.value;
    setDataSource(dataSource);


    axios.patch(`/categories/${record.id}`, {
      label: record.label,
      value: record.title
    })
  };

  const confirmMethod = (item) => {
    confirm({
      title: '你确定要删除?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk () {
        //   console.log('OK');
        deleteMethod(item)
      },
      onCancel () {
        //   console.log('Cancel');
      },
    });

  };
//删除
  const deleteMethod = (item) => {
    // console.log(item)
    // 当前页面同步状态 + 后端同步
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/categories/${item.id}`)
  };

  const EditableContext = React.createContext(null);
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
  
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
  
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
    let childNode = children;

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
          <div
            className="editable-cell-value-wrap"
            style={{
              paddingRight: 24,
            }}
            onClick={toggleEdit}
          >
            {children}
          </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
  };

  return (
    <div>
      <div>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 4 }}
          rowKey={item => item.id}
          components={{
            body: {
              row: EditableRow,
              cell: EditableCell,
          },}}
        />
      </div>
    </div>
  )
}
