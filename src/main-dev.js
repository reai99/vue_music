import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './common.js'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import axios from 'axios'
// NProgress拦截器 导入
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.config.productionTip = false
// 请求带上cookies
axios.defaults.withCredentials = true
// 设置默认地址
axios.defaults.baseURL = 'http://mapi.zreai.com:404/'
// axios 放入vue原型对象上
Vue.prototype.$request = axios
// 请求拦截器添加token，保证拥有获取数据权限 并开启进度条 NProgress.start()
axios.interceptors.request.use(config => {
  NProgress.start()
  return config
})
// response拦截器中隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  return `${y}-${m}-${d}`
})

Vue.filter('dataFormatMD', function (originVal) {
  const dt = new Date(originVal)
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  return `${m}月${d}日更新`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
