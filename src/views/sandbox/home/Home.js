import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, Row,List,Avatar } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as Echarts from 'echarts'
import _ from 'lodash'

const { Meta } = Card;

export default function Home () {
  
  const [viewList, setViewList] = useState([]);
  const [starList, setStarList] = useState([]);

  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem("token"))

  const barRef = useRef();

  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6").then(res => {
      // console.log(res.data)
      setViewList(res.data);
    })
  }, []);

  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6").then(res => {
      // console.log(res.data)
      setStarList(res.data);
    })
  }, []);

  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category").then(res => {
      console.log(res.data)
      console.log(_.groupBy(res.data, item => item.category.label))
      renderBarView(_.groupBy(res.data, item => item.category.label))

      // setallList(res.data)
    })
    
    return () => {
      window.onresize = null;
    }
    
  }, []);

  const renderBarView = (obj) => {
    // 基于准备好的dom，初始化echarts实例
    var myChart = Echarts.init(barRef.current);

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: "45", // 解决宽度太小显示不全问题
          interval: 0 // 强制显示所有标签
        }
      },
      yAxis: {
        minInterval: 1,
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map(item => item.length)
          
        }
      ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    // 响应式
    window.onresize = () => {
      console.log("resize")
      myChart.resize();
    }
  }
  
  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
          <List
            size="small"
            dataSource={viewList}
              renderItem={(item) => <List.Item>
                <a href={`#/news-manage/preview/${item.id}`}>{item.label}</a>
              </List.Item>}
          />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              size="small"
              dataSource={starList}
              renderItem={(item) => <List.Item>
                <a href={`#/news-manage/preview/${item.id}`}>{item.label}</a>
              </List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
        <Card
          cover={
            <img
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
          }
          actions={[
            <SettingOutlined key="setting" />,
            <EditOutlined key="edit" />,
            <EllipsisOutlined key="ellipsis" />,
          ]}
        >
          <Meta
            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
            title={username}
            description={
              <div>
                <b>{region ? region : "全球"}</b>
                <span style={{
                    paddingLeft: "30px"
                }}>{roleName}</span>
              </div>
            }
          />
        </Card>
        </Col>
      </Row>
    
      <div ref={barRef} style={{
        width: '100%',
        height: "300px",
        marginTop: "30px"
      }}></div>
    </div>
  )
}
