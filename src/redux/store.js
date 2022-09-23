// import {createStore} from 'redux'; // 已被弃用

import { legacy_createStore,combineReducers} from 'redux'; // 已被弃用
import {CollApsedReducer} from './reducers/CollapsedReducer'

const reducer = combineReducers({
  CollApsedReducer
})

const store = legacy_createStore(reducer);

export default store

/* store原理：订阅发布模式

  store.dispatch():分发，到reducer，reducer进行处理，接受老状态，返回新状态

  store.subsribe()：监听的回调函数就会被出发

  引入react-redux后，不需要自己去监听，可以让高阶组件connect生成的父组件创建好监听和dispatch操作

  connect组件如何知道store藏身之处的？？？在最外层根组件包上一层供应商组件Provider

*/