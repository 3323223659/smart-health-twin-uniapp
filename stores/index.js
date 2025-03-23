import Vue from 'vue'
import Vuex from 'vuex'
import userModule from './modules/user'  // 导入 user 模块

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user: userModule,  // 使用 user 模块
  },
})

export default store
