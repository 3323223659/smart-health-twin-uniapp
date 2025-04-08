const userModule = {
	namespaced: true, // 确保开启命名空间
	state: {
		userInfo: null, // 用户信息
		token: null,
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
		// 设置token信息
		setToken(state, token) {
			state.token = token;
		},
		// 清除token信息
		clearToken(state) {
			state.token = null;
		},
	},
	actions: {
		// 设置用户信息
		setUserInfo({
			commit
		}, userInfo) {
			commit('setUserInfo', userInfo);
		},
		// 清除用户信息
		clearUserInfo({
			commit
		}) {
			commit('clearUserInfo');
		},
		// 设置token信息
		setToken({
			commit
		}, token) {
			commit('setToken', token);
		},
		// 清除token信息
		clearToken({
			commit
		}) {
			commit('clearToken');
		},
	},
	getters: {
		// 获取用户信息
		userInfo: (state) => state.userInfo,
		token: (state) => state.token,
	},
	plugins: [
		// 使用持久化插件（通过 uni 的存储方式）
		(store) => {
			store.subscribe((mutation, state) => {
				if (mutation.type === 'setUserInfo') {
					uni.setStorageSync('userInfo', state.userInfo); // 存储到 uni 的 localStorage
				}
				if (mutation.type === 'clearUserInfo') {
					uni.removeStorageSync('userInfo'); // 清除 uni 的 localStorage 中的用户信息
				}
				if (mutation.type === 'setToken') {
					uni.setStorageSync('token', state.token); // 存储到 uni 的 localStorage
				}
				if (mutation.type === 'clearToken') {
					uni.removeStorageSync('token'); // 清除 uni 的 localStorage 中的用户信息
				}
			});

			// 恢复持久化的数据
			const userInfo = uni.getStorageSync('userInfo');
			if (userInfo) {
				store.commit('setUserInfo', userInfo);
			}
			const token = uni.getStorageSync('token');
			if (token) {
				store.commit('setToken', token);
			}
		},
	],
};

export default userModule;