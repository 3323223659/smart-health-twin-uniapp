<template>
  <view class="login-container">
    <view class="background-wrapper">
      <image 
        class="background-image"
        src="../../static/image/loginBackgroundImage.png" 
        mode="aspectFill"
      />
    </view>
    <view class="login-card">
      <!-- 标题 -->
      <text class="title">{{ isLogin ? '登录' : '注册' }}</text>
      
      <!-- 输入区域 -->
      <view class="input-group">
        <view class="input-item">
          <image class="icon"
            src="../../static/icon/phone.png"
            mode="scaleToFill"
          /> 
          <input 
            v-model="formData.phone"
            placeholder="请输入手机号"
            placeholder-class="placeholder"
            maxlength="11"
            class="input"
          />
        </view>
        <view class="input-item">
          <image class="icon"
            src="../../static/icon/password.png"
            mode="scaleToFill"
          />
          <input 
            type="password"
            v-model="formData.password"
            placeholder="请输入密码"
            placeholder-class="placeholder"
            maxlength="16"
            class="input"
          />
        </view>
        <view v-show="!isLogin" class="input-item">
          <image class="icon"
            src="../../static/icon/password.png"
            mode="scaleToFill"
          />
          <input 
            type="password"
            v-model="formData.confirmPassword"
            placeholder="确认密码"
            placeholder-class="placeholder"
            maxlength="16"
            class="input"
          />
        </view>
      </view>

      <!-- 提交按钮 -->
      <button class="submit-btn" @click="handleSubmit">
        {{ isLogin ? '登录' : '注册' }}
      </button>

      <!-- 切换登录/注册 -->
      <view class="signup-area">
        <text class="tip" @click="changeIsLogin">
          {{ isLogin ? '暂无账户,点击去注册' : '已有账户,点击去登录' }}
        </text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isLogin: true, // 登录/注册状态
      formData: {
        phone: '',
        password: '',
        confirmPassword: ''
      }
    };
  },
  computed: {
    // 手机号正则（11位，1开头）
    phoneReg() {
      return /^1[3-9]\d{9}$/;
    },
    // 密码正则（8-16位，包含大小写和数字）
    passwordReg() {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\w!@#$%^&*]{8,16}$/;
    }
  },
  methods: {
    // 表单验证方法
    validateForm() {
      // 手机号验证
      if (!this.formData.phone) {
        uni.showToast({ title: '手机号不能为空', icon: 'none' });
        return false;
      }
      if (!this.phoneReg.test(this.formData.phone)) {
        uni.showToast({ title: '手机号格式不正确', icon: 'none' });
        return false;
      }

      // 密码验证
      if (!this.formData.password) {
        uni.showToast({ title: '密码不能为空', icon: 'none' });
        return false;
      }
      if (!this.passwordReg.test(this.formData.password)) {
        uni.showToast({ 
          title: '密码需8-16位，包含大小写和数字',
          icon: 'none',
          duration: 2000
        });
        return false;
      }

      // 注册时的确认密码验证
      if (!this.isLogin) {
        if (this.formData.password !== this.formData.confirmPassword) {
          uni.showToast({ title: '两次密码输入不一致', icon: 'none' });
          return false;
        }
      }

      return true;
    },
    // 表单提交处理
    handleSubmit() {
      // 表单校验
      //if (!this.validateForm()) return;

      if (this.isLogin) {
        this.login();
      } else {
        this.signup();
      }
    },
    // 切换登录/注册状态
    changeIsLogin() {
      // 切换时清空表单
      Object.keys(this.formData).forEach(key => {
        this.formData[key] = '';
      });
      this.isLogin = !this.isLogin;
    },
    // 登录函数
    login() {
      uni.switchTab({
        url: '/pages/home/home'
      });
    },
    // 注册函数
    signup() {
      uni.switchTab({
        url: '/pages/home/home'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
/* 缩小输入区域 */
.login-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #000;
  overflow: scroll;
}

.background-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.1); /* 叠加半透明遮罩 */
  }
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.icon {
  width: 32rpx;
  height: 32rpx;
  left: 16rpx;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;      /* 确保图标层级高于输入框 */
}

.login-card {
  margin-top: 100rpx;
  width: 480rpx;     /* 240px → 480rpx */
  padding: 50rpx;    /* 30px → 60rpx */
  border-radius: 24rpx;  /* 12px → 24rpx */
  box-shadow: 0 8rpx 40rpx rgba(0,0,0,0.1); /* 4px→8rpx 20px→40rpx */
  background: #FFF;
  z-index: 1;
}

.title {
  display: block;
  margin-bottom: 48rpx;  /* 24px → 48rpx */
  font-size: 48rpx;       /* 24px → 48rpx */
  font-weight: 700;
  text-align: center;
  color: #000;
}

.input-group {
  margin-bottom: 40rpx;  /* 20px → 40rpx */
}

.input-item {
  position: relative;
  margin-bottom: 32rpx;  /* 16px → 32rpx */
  border-bottom: 2rpx solid #EEE;  /* 1px→2rpx */
}


.input {
  width: 100%;
  height: 72rpx;        /* 36px → 72rpx */
  padding-left: 56rpx; /* 28px → 56rpx */
  font-size: 28rpx;    /* 14px → 28rpx */
}

.placeholder {
  color: #AAA;
}

.submit-btn {
  width: 100%;
  height: 80rpx;       /* 40px → 80rpx */
  font-size: 30rpx;    /* 15px → 30rpx */
  border-radius: 16rpx;/* 8px → 16rpx */
  background: #6600FF;
  color: #FFF;
  transition: background-color 0.3s;  /* 修正颜色值错误 */
}

.submit-btn:active {
  background: #4D00CC;
}

.signup-area {
  margin-top: 40rpx;   /* 20px → 40rpx */
  text-align: center;
}

.tip {
  display: block;
  margin-bottom: 20rpx;/* 10px → 20rpx */
  font-size: 24rpx;    /* 12px → 24rpx */
  color: #666;
}

.signup-btn {
  width: 100%;
  height: 80rpx;       /* 40px → 80rpx */
  font-size: 30rpx;    /* 15px → 30rpx */
  border-radius: 16rpx;/* 8px → 16rpx */
  background: #333;
  color: #FFF;
  transition: background-color 0.3s;
}

.signup-btn:active {
  background: #4F4F4F;
}
</style>