import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 树状表依赖项的导入
import TreeTable from 'vue-table-with-tree-grid'
// 文本编辑的依赖导入
import VueQuillEditor from 'vue-quill-editor'
// 导入文本编辑样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入进度条控制的包
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8081/'

// 在request拦截其中展示进度条NProgress.start();
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  config.headers.AuthorRole = window.sessionStorage.getItem('role')
  return config
})

// 在response拦截其中隐藏进度条NProgress.done();
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false
// 父文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)

Vue.component('tree-table', TreeTable)
Vue.filter('dataFormat', function(originValue) {
  const dt = new Date(originValue)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDay() + '').padStart(2, '0')
  return `${y}-${m}-${d}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
