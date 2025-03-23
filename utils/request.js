import { useUserStore } from '../stores/index';

const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net';

const httpInterceptor = {
  invoke(options) {
    // 在请求之前，统一拼接请求的域名
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url;
    }
    options.timeout = 10000;
    console.log('请求拦截器', options);

    // 添加请求头
    options.header = {
      ...options.header,
      'source-client': 'miniapp',
    };

    // 获取 token 并添加到请求头
    const userStore = useUserStore();
    const token = userStore.userInfo.token;
    if (token) {
      options.header.Authorization = token;
    }

    console.log('请求拦截器', options);
  },
};

// 添加请求拦截器
uni.addInterceptor('request', httpInterceptor);
uni.addInterceptor('uploadFile', httpInterceptor);

// 响应拦截器
export const http = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          const userStore = useUserStore();
          userStore.clearProfile();
          uni.navigateTo({ url: '/pages/login/login' });
          reject(res);
        } else {
          uni.showToast({
            icon: 'none',
            title: res.data.msg || '请求错误',
          });
          reject(res);
        }
      },
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误',
        });
        reject(err);
      },
    });
  });
};