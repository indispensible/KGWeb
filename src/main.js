// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import router from './router'
import ElementUI from 'element-ui'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'element-ui/lib/theme-chalk/index.css'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import * as d3 from 'd3'
import echarts from 'echarts'
import 'echarts-wordcloud/dist/echarts-wordcloud'
import 'echarts-wordcloud/dist/echarts-wordcloud.min'

// import axios from 'axios'

Vue.use(codemirror)
Vue.use(d3)
Vue.use(ElementUI)
Vue.use(BootstrapVue)
Vue.use(VueRouter)
Vue.prototype.$echarts = echarts

// Vue.prototype.$axios = axios
// axios.defaults.baseURL = '/api'
// axios.defaults.headers.post['Content-Type'] = 'application/json'

Vue.config.productionTip = false

// const router = new VueRouter({
//   mode: 'history',
//   routes: routers
// })
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

// Vue.prototype.$addStorageEvent = function (key, data) {
//     // 创建一个StorageEvent事件
//     let newStorageEvent = document.createEvent('StorageEvent');
//     const storage = {
//       setItem: function (k, val) {
//         localStorage.setItem(k, val);
//         // 初始化创建的事件
//         newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);
//         // 派发对象
//         window.dispatchEvent(newStorageEvent);
//       }
//     }
//     return storage.setItem(key, data);
// }
