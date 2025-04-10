import { http } from "../utils/request";

// 用户登录
export const loginAPI = (data) => {
  return http({
    url: '/sht/user/login',
    method: 'POST',
    data,
  });
};

//注册
export const registerAPI = (data) => {
  return http({
    url: '/sht/user/register',
    method: 'POST',
    data,
  });
};

// 获取用户信息
export const getUserInfoAPI = () => {
  return http({
    url: '/sht/user/info',
    method: 'GET',
  });
};

// 更新用户信息
export const updateUserInfoAPI = (data) => {
  return http({
    url: '/sht/user/info',
    method: 'POST',
    data
  });
};

//ocr
export const uploadHealthReport = (data) => {
  return http({
    url: '/sht/user/healthReportUpload',
    method: 'POST',
    data
  });
};

//获取健康信息
export const getHealthReport = () => {
  return http({
    url: '/sht/user/healthReport',
    method: 'GET',
    
  });
};

//获取健康建议
export const getHealthAdvice = () => {
  return http({
    url: '/sht/user/healthReport/suggestion',
    method: 'GET',
    
  });
};


