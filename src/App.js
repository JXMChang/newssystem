// import Child from "./Child";
import './App.css'
import {useEffect} from 'react'
import axios from "axios";
import IndexRouter from "./router/IndexRouter";
import { Provider } from 'react-redux';
import { store,persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
function App () {
  /* useEffect(() => {
    axios.get("/api/mmdb/movie/v3/list/hot.json?ct=%E6%B7%B1%E5%9C%B3&ci=30&channelId=4").then(res => {
      console.log(res);
    })
  }, []) */
  return (
    // 原理：context跨级通讯，往所有connect组件中进行传入
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>

        <IndexRouter/>
      </PersistGate>
    </Provider>
  );
}

export default App;
