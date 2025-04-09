<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="box-bg">
      <uni-nav-bar shadow backgroundColor="#44cf9a" left-icon="left" @clickLeft="handleBack" :status-bar="true">
        <view class="title-custom">个人信息</view>
        <template v-slot:right>
          <view v-if="isEditMode" class="save-nav-btn" @click="saveChanges">保存</view>
        </template>
      </uni-nav-bar>
    </view>

    <!-- 主内容区 -->
    <view class="content">
      <!-- 个人信息卡片 -->
      <view class="info-card">
        <!-- 头像区域 -->
        <view class="avatar-section">
          <!-- 非编辑模式：显示头像 -->
          <view v-if="!isEditMode" class="avatar-wrapper">
            <image class="avatar" :src="userInfo.avatar || '../../../static/image/avatar.png'"
                   mode="aspectFill"></image>
          </view>

          <!-- 编辑模式：显示上传组件 -->
          <view v-else class="avatar-upload-container" @click="chooseImage">
            <image v-if="avatar" :src="avatar" mode="aspectFill" :class="imageStyles"></image>
            <uni-icons v-else type="plusempty" size="50" color="#999"></uni-icons>
          </view>

          <text class="username">{{ userInfo.username }}</text>
          <text class="user-id">ID: {{ userInfo.userId }}</text>
        </view>

        <!-- 信息列表 -->
        <view class="info-list">
          <!-- 姓名 -->
          <view class="info-item">
            <view class="info-label">
              <uni-icons type="person" size="30"></uni-icons>
              <text>姓名</text>
            </view>
            <view class="info-value">
              <text v-if="!isEditMode" class="display-value">{{ userInfo.username }}</text>
              <input v-else type="text" v-model="userInfo.username" placeholder="请输入姓名" />
            </view>
          </view>

          <!-- 性别 -->
          <view class="info-item">
            <view class="info-label">
              <uni-icons type="staff" size="30"></uni-icons>
              <text>性别</text>
            </view>
            <view class="info-value">
              <text v-if="!isEditMode" class="display-value">{{ userInfo.gender === 1 ? "男": "女" }}</text>
              <picker v-else mode="selector" :range="genderOptions" @change="handleGenderChange">
                <view class="picker-value">{{ userInfo.gender === 1 ? "男": "女" }}</view>
              </picker>
            </view>
          </view>

          <!-- 年龄 -->
          <view class="info-item">
            <view class="info-label">
              <uni-icons type="contact" size="30"></uni-icons>
              <text>年龄</text>
            </view>
            <view class="info-value">
              <text v-if="!isEditMode" class="display-value">{{ userInfo.age }}</text>
              <view v-else class="number-stepper">
                <view class="stepper-btn minus" @click="decrementAge">
                  <uni-icons type="minus" size="20" color="#64748b"></uni-icons>
                </view>
                <text class="stepper-value">{{ userInfo.age }}</text>
                <view class="stepper-btn plus" @click="incrementAge">
                  <uni-icons type="plus" size="20" color="#64748b"></uni-icons>
                </view>
              </view>
            </view>
          </view>

          <!-- 城市 -->
          <view class="info-item">
            <view class="info-label">
              <uni-icons type="location" size="30"></uni-icons>
              <text>城市</text>
            </view>
            <view class="info-value">
              <text v-if="!isEditMode" class="display-value">{{ userInfo.city }}</text>
              <picker v-else mode="region" @change="handleCityChange">
                <view class="picker-value">{{ userInfo.city }}</view>
              </picker>
            </view>
          </view>

          <!-- 身体健康状态 - 不可编辑 -->
          <view class="info-item">
            <view class="info-label">
              <van-icon name="like-o" size="26px" />
              <text>健康状态</text>
            </view>
            <view class="info-value">
              <text class="display-value">{{ userInfo.healthStatus === 1 ? "健康" :"生病" }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 编辑按钮 -->
      <button class="edit-btn" :class="{ 'cancel-btn': isEditMode }" @click="toggleEditMode">
        <uni-icons v-if="!isEditMode" type="compose" size="18" color="#ffffff"></uni-icons>
        <text>{{ isEditMode ? '取消' : '编辑个人信息' }}</text>
      </button>

      <!-- 保存按钮 -->
      <button v-if="isEditMode" class="save-button" @click="saveChanges">
        <uni-icons type="save" size="18" color="#ffffff"></uni-icons>
        <text>保存修改</text>
      </button>
    </view>
  </view>
</template>

<script>
import { getUserInfoAPI, updateUserInfoAPI } from '@/api/user';
import { uploadAPI } from '@/api/system';

export default {
  data() {
    return {
      // 获取系统安全区域信息
      safeAreaInsets: uni.getSystemInfoSync().safeAreaInsets,
      // 是否处于编辑模式
      isEditMode: false,
      // 用户信息
      userInfo: {
        gender: 1,
        age: '20',
        city: '未知',
        healthStatus: '',
        avatar: '../../../static/image/avatar.png'
      },
      // 性别选项
      genderOptions: ['女', '男', '保密'],
      // 编辑前的备份数据
      avatar: null,
      // 选择的头像文件
      selectedFile: null,
      // 文件选择器样式配置
      imageStyles: {
        width: 120,
        height: 120,
        border: {
          color: '#44cf9a',
          width: 2,
          style: 'dashed',
          radius: '5px'
        }
      }
    };
  },
 
  methods: {
	  // 选择图片
	  chooseImage() {
	    uni.chooseImage({
	      count: 1, // 默认9
	      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
	      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
	      success: (res) => {
	        // 获取图片临时路径
	        this.avatar = res.tempFilePaths[0];
	        this.uploadStatus = '';
	      },
	      fail: (err) => {
	        console.error('选择图片失败:', err);
	        uni.showToast({
	          title: '选择图片失败',
	          icon: 'none'
	        });
	      }
	    });
	  },
    // 返回上一页
    handleBack() {
      if (this.isEditMode) {
        uni.showModal({
          title: '提示',
          content: '确定要放弃编辑吗？',
          success: (res) => {
            if (res.confirm) {
              this.cancelEdit();
              uni.switchTab({
                url: "/pages/my/my"
              });
            }
          }
        });
      } else {
        uni.switchTab({
          url: "/pages/my/my"
        });
      }
    },

    // 切换编辑模式
    toggleEditMode() {
      if (this.isEditMode) {
        // 取消编辑，恢复数据
        this.cancelEdit();
      } else {
        // 进入编辑模式，先备份数据
        this.backupUserInfo = JSON.parse(JSON.stringify(this.userInfo));
        this.isEditMode = true;
      }
    },

    // 取消编辑
    cancelEdit() {
      // 恢复备份的数据
      if (this.backupUserInfo) {
        this.userInfo = JSON.parse(JSON.stringify(this.backupUserInfo));
      }
      this.isEditMode = false;
      this.selectedFile = null;

      // 重置文件选择器
      if (this.$refs.filePicker) {
        this.$refs.filePicker.clearFiles();
      }
    },

    // 处理文件选择事件
    handleFileSelect(e) {
      this.selectedFile = e.tempFiles[0];
    },

    // 处理文件删除事件
    handleFileDelete() {
      this.selectedFile = null;
    },

    // 保存更改到后端
    saveChanges() {
      // 数据验证
      if (!this.userInfo.username.trim()) {
        uni.showToast({
          title: '姓名不能为空',
          icon: 'none'
        });
        return;
      }

      // 显示加载
      uni.showLoading({
        title: '保存中...'
      });

      // 构建要发送的用户数据
      let userData = {
        userId: this.userInfo.userId,
        username: this.userInfo.username,
        gender: this.userInfo.gender,
        age: this.userInfo.age,
        city: this.userInfo.city,
        avatar: this.userInfo.avatar
      };

      // 如果有选择新头像，先上传头像文件
      if (this.avatar) {
        this.uploadAvatar(this.avatar, userData);
      } else {
        // 没有新头像，直接保存用户信息
        this.submitUserInfo(userData);
      }
    },

    // 上传头像到服务器
    async uploadAvatar(filePath, userData) {
		try {
		  uni.showLoading({
		    title: '上传中',
		    mask: true
		  });
		  
		  // 调用上传API
		  const resData = await uploadAPI(this.avatar);
		  
		  // 上传成功处理
		  this.uploadStatus = '上传成功';
		  uni.showToast({
		    title: '上传成功',
		    icon: 'success'
		  });
		  userData.avatar = resData.data.value
		  console.log("头像信息：",userData.avatar)
		  // 保存用户信息到服务器
		  this.submitUserInfo(userData);
		  
		} catch (error) {
		  console.error('上传失败:', error);
		  this.uploadStatus = '上传失败';
		  uni.showToast({
		    title: '上传失败',
		    icon: 'none'
		  });
		} finally {
		  uni.hideLoading();
		}
    },

    // 提交用户信息到后端
    async submitUserInfo(userData) {
	   await updateUserInfoAPI(userData)
	   uni.showToast({
	     title: '个人信息保存成功',
	     icon: 'success'
	   });
	   
	   // 将新头像更新到用户信息中
	   if (this.selectedFile && userData.avatar) {
	     this.userInfo.avatar = userData.avatar;
	   }
	   
	   // 更新备份数据
	   this.backupUserInfo = JSON.parse(JSON.stringify(this.userInfo));
	   this.isEditMode = false;
	   this.selectedFile = null;
	   
	   // 重置文件选择器
	   if (this.$refs.filePicker) {
	     this.$refs.filePicker.clearFiles();
	   }
    },

    // 处理错误
    handleError(message) {
      uni.hideLoading();
      uni.showToast({
        title: message,
        icon: 'none'
      });
    },

    // 性别选择器变更
    handleGenderChange(e) {
		console.log("性别是：",e)
      const index = e.detail.value;
      this.userInfo.gender =index
    },

    // 城市选择器变更
    handleCityChange(e) {
      const cityArray = e.detail.value;
      // 省市区，只取市级
      this.userInfo.city = cityArray[1];
    },

    // 年龄增加
    incrementAge() {
      const currentAge = parseInt(this.userInfo.age);
      if (currentAge < 120) { // 设置最大年龄限制
        this.userInfo.age = (currentAge + 1).toString();
      }
    },

    // 年龄减少
    decrementAge() {
      const currentAge = parseInt(this.userInfo.age);
      if (currentAge > 1) { // 设置最小年龄限制
        this.userInfo.age = (currentAge - 1).toString();
      }
    },
	async getUserInfo() {
		const {data} = await getUserInfoAPI()
		this.userInfo=data
	},
  },
  onLoad() {
    // 页面加载时从服务器获取用户信息
    this.getUserInfo()
  }
};
</script>

<style lang="scss">
page {
  width: 100%;
  height: 100%;
  background-color: #f7f8fa;
}

.container {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  width: 100%;
}

/* 自定义导航条 */
.box-bg {
  background-color: #44cf9a;
  position: relative;
  width: 100%;
}

/* 自定义标题样式 */
.title-custom {
  color: #000;
  /* 黑色字体 */
  text-align: center;
  /* 居中显示 */
  font-size: 16px;
  /* 字体大小 */
  font-weight: 600;
  flex: 1;
  /* 占据剩余空间 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.save-nav-btn {
  font-size: 14px;
  color: #000;
  padding: 6px 12px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.3);
}

/* 主内容区 */
.content {
  flex: 1;
  padding: 20px 16px;
}

/* 个人信息卡片 */
.info-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

/* 头像区域 */
.avatar-section {
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: #f0f9ff;
}

.avatar-wrapper {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid white;
  box-shadow: 0 4px 10px rgba(14, 165, 233, 0.15);
  margin-bottom: 12px;
  position: relative;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 头像上传容器 - 极简版本 */
.avatar-upload-container {
  width: 120px;
  height: 120px;
  border: 1px solid #ddd; /* 浅灰色边框 */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* 确保图片不溢出 */
  background-color: #f5f5f5; /* 浅灰色背景 */
  
  /* 图片样式 - 等比例填充 */
  image {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 关键属性：等比例填充容器 */
  }
  
  /* 加号图标样式 */
  .uni-icons {
    color: #999; /* 灰色图标 */
  }
}

.username {
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;
}

.user-id {
  font-size: 13px;
  color: #64748b;
}

/* 信息项 */
.info-list {
  padding: 8px 0;
}

.info-item {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f1f5f9;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 16px;
  color: #334155;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.info-label .uni-icons,
.info-label van-icon {
  margin-right: 8px;
}

.info-value {
  font-size: 16px;
  color: #64748b;
  display: flex;
  align-items: center;
}

.info-value input {
  text-align: right;
  height: 24px;
  min-height: 24px;
  line-height: 24px;
  color: #64748b;
}

.picker-value {
  color: #64748b;
}

/* 数字步进器 */
.number-stepper {
  display: flex;
  align-items: center;
}

.stepper-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.stepper-value {
  margin: 0 12px;
  font-size: 16px;
  color: #64748b;
  min-width: 30px;
  text-align: center;
}

/* 编辑按钮 */
.edit-btn {
  background: #44cf9a;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 14px 0;
  font-size: 16px;
  font-weight: 600;
  width: 100%;
  margin-top: 20px;
  box-shadow: 0 4px 12px rgba(68, 207, 154, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn .uni-icons {
  margin-right: 8px;
}

.cancel-btn {
  background: #ef4444;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
}

/* 保存按钮 */
.save-button {
  background: #10b981;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 14px 0;
  font-size: 16px;
  font-weight: 600;
  width: 100%;
  margin-top: 16px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}

.save-button .uni-icons {
  margin-right: 8px;
}

/* 自定义uni-file-picker组件样式 */
:deep(.uni-file-picker__container) {
  display: flex;
  justify-content: center;
}

:deep(.uni-file-picker__list) {
  margin-top: 0;
  margin-bottom: 0;
}
</style>
