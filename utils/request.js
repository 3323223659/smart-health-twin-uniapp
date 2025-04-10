// utils/request.js
const baseURL = 'http://localhost:8088'; // 开发环境
// const baseURL = 'https://api.yourdomain.com'; // 生产环境

// 存储用户store的引用
let userStore = null;

// 初始化方法
export const initRequestInterceptor = (store) => {
  userStore = store;
  
  const httpInterceptor = {
    invoke(options) {
      // 确保URL处理正确
      if (!options.url.startsWith('http')) {
        // 处理URL路径格式
        const path = options.url.startsWith('/') 
          ? options.url.slice(1) 
          : options.url;
        options.url = `${baseURL}/${path}`;
      }
      
      options.timeout = 100000;
      
      // 添加请求头
      options.header = {
        ...options.header,
        'source-client': 'miniapp',
        'Content-Type': 'application/json'
      };

      // 添加token（从store或本地存储获取）
      const token =  uni.getStorageSync('token');
	  console.log(token)
      if (token) {
        options.header.Authorization = `${token}`;
      }

      console.log('请求配置:', options);
    }
  };

  // 添加拦截器
  uni.addInterceptor('request', httpInterceptor);
  uni.addInterceptor('uploadFile', httpInterceptor);
};

// 封装的http方法
export const http = (options) => {
  return new Promise((resolve, reject) => {
    // 再次确保URL正确
    if (!options.url.startsWith('http')) {
      options.url = `${baseURL}/${options.url.replace(/^\//, '')}`;
    }

    uni.request({
      ...options,
      success(res) {
        console.log('响应数据:', res);
        if (res.statusCode >= 200 && res.statusCode < 300) {
		if(res.data.message && res.data.message !== 'success'){
			if(res.data.message === '用户信息不存在'){
				uni.showToast({
					title: '请填写您的基本信息',
					icon: 'none'
				});
			}else{
				uni.showToast({
					title: res.data.message,
					icon: 'none'
				});
			}			
		}			
          resolve(res.data);
        } else if (res.statusCode === 401) {
          uni.removeStorageSync('token');
          uni.navigateTo({ url: '/pages/login/login' });
          uni.showToast({
          	title: `登录信息过期请重新登录`,
          	icon: 'none'
          });
        } else {
          const errorMsg = res.data?.message || `请求错误: ${res.statusCode}`;
          uni.showToast({
            icon: 'none',
            title: errorMsg,
          });
          reject(new Error(errorMsg));
        }
      },
      fail(err) {
        console.error('请求失败:', err);
        uni.showToast({
          icon: 'none',
          title: '网络错误，请检查网络连接',
        });
        reject(err);
      },
    });
  });
};