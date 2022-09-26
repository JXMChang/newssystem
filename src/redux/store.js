// import {createStore} from 'redux'; // 已被弃用

import { legacy_createStore,combineReducers,applyMiddleware,compose} from 'redux'; // 已被弃用
import {CollApsedReducer} from './reducers/CollapsedReducer'
import {LoadingReducer} from './reducers/LoadingReducer'

import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { persistStore, persistReducer } from 'redux-persist'

import reduxThunk from 'redux-thunk'
import reduxPromise from 'redux-promise'
 

const reducer = combineReducers({
  CollApsedReducer,
  LoadingReducer
})

// redux-persist：redux持久化，即与localStorage交互
const persistConfig = {
  key: 'isCollapsed',
  storage,
  whitelist:['CollApsedReducer']
  // blacklist: ['LoadingReducer'] 

}
// 把reducer按照persistConfig配置持久化
const persistedReducer = persistReducer(persistConfig,reducer)
// const store = legacy_createStore(persistedReducer);

// Redux开发者工具
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = legacy_createStore(persistedReducer,composeEnhancers(applyMiddleware(reduxThunk,reduxPromise)));

const persistor = persistStore(store);

export {
  store,
  persistor
}

/* store原理：订阅发布模式

  store.dispatch():分发，到reducer，reducer进行处理，接受老状态，返回新状态

  store.subsribe()：监听的回调函数就会被出发

  引入react-redux后，不需要自己去监听，可以让高阶组件connect生成的父组件创建好监听和dispatch操作

  connect组件如何知道store藏身之处的？？？在最外层根组件包上一层供应商组件Provider

*/