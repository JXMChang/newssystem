import { Button } from 'antd';
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish';
import usePublish from '../../../components/publish-manage/usePublish';

export default function Unpublished() {
  const { dataSource, handlePublish } = usePublish(1)
  console.log(dataSource);
  return (
    <div>
      <NewsPublish
        dataSource={dataSource}
        button={(id) =>
          <Button type="primary" onClick={()=>{handlePublish(id)}}>
            发布
          </Button>
        }
      >
        
      </NewsPublish>
    </div>
  )
}
