import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, Row,List,Avatar, Drawer } from 'antd';
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

  const [visible, setvisible] = useState(false);
  const pieRef = useRef();
  // 防止多次初始化
  const [pieChart, setpieChart] = useState(null)
  const [allList, setAllList] = useState([])


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

      setAllList(res.data)
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
  
  const renderPieView = (obj) => {
    // 数据处理
    var currentList = allList.filter(item=>item.author == username)
    var groupObj = _.groupBy(currentList,item=>item.category.label)
    var list = []
    for(var i in groupObj) {
      list.push({
        name: i,
        value: groupObj[i].length
      });
    }

    // echart绘制
    var myChart;
    if (pieChart) {
      myChart = Echarts.init(pieRef.current);
      setpieChart(myChart);
    } else {
      myChart = pieChart
    }
    var myChart = Echarts.init(pieRef.current);
    var option;

    option = {
      title: {
        text: '当前用户新闻分类图示',
        // subtext: 'Fake Data',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);
  };

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
            <SettingOutlined key="setting" onClick={async () => {
              /* setTimeout(() => {
                  setvisible(true)

                  // init初始化
                  renderPieView()
                }, 0) */
              await setvisible(true);
              renderPieView();
          }}/>,
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
    
      <Drawer
        title="个人新闻分类"
        width="500px"
        placement="right"
        onClose={() => {
          setvisible(false)
        }}
        visible={visible}>
          <div ref={pieRef} style={{
            width: '100%',
            height: "300px",
            marginTop: "30px"
          }}></div>
      </Drawer>
      
      {/* 柱状图 */}
      <div ref={barRef} style={{
        width: '100%',
        height: "300px",
        marginTop: "30px"
      }}></div>
    </div>
  )
}
