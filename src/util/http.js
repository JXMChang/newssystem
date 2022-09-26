import axios from 'axios'
import { store } from '../redux/store';
// import {store} from '../redux/store'
axios.defaults.baseURL="http://localhost:8000"

axios.interceptors.request.use((config) => {
  store.dispatch({
    type: "change_loading",
    payload: true
  });
  return config;
}, function (error) {
  return Promise.reject(error);
})

axios.interceptors.response.use((resp) => {
  store.dispatch({
    type: "change_loading",
    payload: false
  });
  return resp
}, function (error) {
  return Promise.reject(error);
})