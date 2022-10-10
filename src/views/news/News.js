import React, { useEffect, useState } from 'react'
import axios from 'axios'
import _ from 'lodash'
import { Card, Col, List, PageHeader, Row } from 'antd'

export default function News() {
  const [list, setList] = useState([])

  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category").then(res => {
      console.log("res",res.data);
      console.log("res",_.groupBy(res.data, item => item.category.label));
      setList(Object.entries(_.groupBy(res.data, item => item.category.label)))
      console.log("lodash",list)
    })
}, [])
  return (
    <div style={{
      width: "95%",
      margin: '0 auto'
    }}>
      <PageHeader
        className="site-page-header"
        title="全球大新闻"
        subTitle="查看新闻"
      />

      <div className="site-card-wrapper">
        <Row gutter={[16, 16]}>
          {
            list.map(item =>
              <Col span={8} key={item[0]}>
                <Card title={item[0]} bordered={true} hoverable={true}>
                  <List
                    size="small"
                    dataSource={item[1]}
                    pagination={{
                        pageSize: 3
                    }}
                    renderItem={data => <List.Item><a href={`#/detail/${data.id}`}>{data.label}</a></List.Item>}
                  />
                </Card>
              </Col>
            )
          }
        </Row>
      </div>
    </div>
  )
}
