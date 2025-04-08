import { http } from "../utils/request";

export const uploadAPI = (filePath) => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: 'http://localhost:8088/sht/user/file', // 使用完整URL
      filePath: filePath,
      name: 'file', // 必须与后端@RequestParam名称一致
      formData: {
        // 可以添加其他表单参数
        'userId': '123'
      },
      success: (uploadRes) => {
        if (uploadRes.statusCode === 200) {
          try {
            resolve(JSON.parse(uploadRes.data));
          } catch (e) {
            resolve(uploadRes.data);
          }
        } else {
          reject(new Error(`上传失败: ${uploadRes.statusCode}`));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

// chat
export const chatAPI = (data) => {
  return http({
    url: '/chat',
    method: 'POST',
    data,
  });
};
