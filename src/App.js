import Child from "./Child";
import './App.css'
import {useEffect} from 'react'
import axios from "axios";
function App () {
  useEffect(() => {
    axios.get("/api/mmdb/movie/v3/list/hot.json?ct=%E6%B7%B1%E5%9C%B3&ci=30&channelId=4").then(res => {
      console.log(res);
    })
  }, [])
  return (
    <div>
      app
      <ul>
        <li>111</li>
        <li>222</li>
       </ul>
       <Child/>
    </div>
  );
}

export default App;
