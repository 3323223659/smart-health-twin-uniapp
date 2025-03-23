import App from './App'


import Vue from 'vue'
import './uni.promisify.adaptor'
import store from './stores/index.js'  // 引入刚才创建的 Vuex store

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  store,  // 将 Vuex store 集成到 Vue 实例中
  render: h => h(App)
})

app.$mount()
