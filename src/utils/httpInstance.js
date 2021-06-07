import axios from 'axios';
import { BASE_URL } from './url';

// 导入NProgress包对应的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置请求的根路径
const httpInstance = axios.create({
  timeout: 5000,
  baseURL: BASE_URL,
  // 跨域请求需要添加这行代码
  // withCredentials: true,
})

// 在请求拦截器中，展示进度条NProgress.start()
httpInstance.interceptors.request.use(config => { // axios的请求拦截器
  NProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem('token');
  // 在最后必须return config
  return config;
})

// 在响应拦截器中，隐藏进度条NProgress.done()
httpInstance.interceptors.response.use(config => {
  NProgress.done()
  return config;
})

export default httpInstance