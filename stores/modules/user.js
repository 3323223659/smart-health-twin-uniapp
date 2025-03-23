const userModule = {
  state: {
    userInfo: null,  // 用户信息
  },
  mutations: {
    // 设置用户信息
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    // 清除用户信息
    clearUserInfo(state) {
      state.userInfo = null;
    },
  },
  actions: {
    // 设置用户信息
    setUserInfo({ commit }, userInfo) {
      commit('setUserInfo', userInfo);
    },
    // 清除用户信息
    clearUserInfo({ commit }) {
      commit('clearUserInfo');
    },
  },
  getters: {
    // 获取用户信息
    userInfo: (state) => state.userInfo,
  },
  plugins: [
    // 使用持久化插件（通过 uni 的存储方式）
    (store) => {
      store.subscribe((mutation, state) => {
        if (mutation.type === 'setUserInfo') {
          uni.setStorageSync('userInfo', state.userInfo);  // 存储到 uni 的 localStorage
        }
        if (mutation.type === 'clearUserInfo') {
          uni.removeStorageSync('userInfo');  // 清除 uni 的 localStorage 中的用户信息
        }
      });

      // 恢复持久化的数据
      const userInfo = uni.getStorageSync('userInfo');
      if (userInfo) {
        store.commit('setUserInfo', userInfo);
      }
    },
  ],
};

export default userModule;
