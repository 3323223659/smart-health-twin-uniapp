<template>
  <view>
	  <view
	    class="navbar"
	    :style="{
	      paddingTop: `${safeAreaInsets.top}px`
	    }"
	  ></view>
	  
	  <view class="box-bg">
	    <uni-nav-bar shadow backgroundColor="#44cf9a" left-icon="left" @clickLeft="back">
	      <view class="title-custom">设置</view>
	    </uni-nav-bar>
	  </view>
	  
	  <view class="content">
	    <view class="text-area">
	      <view class="section">
	        <view class="row" @click="showLogoutConfirm">
	          <view class="left">
	            <image
	              class="icon"
	              src="../../../static/icon/login-out.png"
	              mode="scaleToFill"
	            />
	            <view class="text">退出登录</view>
	          </view>
	          <view class="right">
	            <uni-icons type="right" color="" size="24" />
	          </view>
	        </view>
	      </view>
	    </view>
	  </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 获取系统安全区域信息
      safeAreaInsets: uni.getSystemInfoSync().safeAreaInsets
    };
  },
  mounted() {
    // 在组件挂载后执行的代码
  },
  methods: {
    // 返回上一页
    back() {
      uni.switchTab({
        url: "/pages/my/my",
      });
    },

    // 显示退出登录确认框
    showLogoutConfirm() {
      uni.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        confirmText: "确定",
        cancelText: "取消",
        success: (res) => {
          if (res.confirm) {
            this.loginOut();
          }
        },
      });
    },

    // 退出登录
    loginOut() {
      uni.redirectTo({
        url: "/pages/login/login",
      });
    },
  },
};
</script>

<style lang="scss">
page {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* 自定义导航条 */
.navbar {
  background-color: #44cf9a;
  background-size: cover;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 20px;
}

/* 自定义标题样式 */
.title-custom {
  color: #000; /* 黑色字体 */
  text-align: center; /* 居中显示 */
  font-size: 16px; /* 字体大小 */
  flex: 1; /* 占据剩余空间 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.text-area {
  display: flex;
  justify-content: center;
}

.section {
  width: 690rpx;
  margin: 30rpx auto;
  border: 1px solid #eee;
  border-radius: 30rpx;
  box-shadow: 0 0 30rpx rgba(0, 0, 0, 0.1);
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30rpx;
    height: 100rpx;
    border-bottom: 1px solid #eee;
    position: relative;
    .customer {
      position: absolute;
      top: 0;
      left: 0;
      height: 100rpx;
      width: 100%;
      opacity: 0;
    }
    &:last-child {
      border-bottom: 0;
    }
    .right {
      display: flex;
      align-items: center;
    }
    .left {
      display: flex;
      align-items: center;
      .icon {
        width: 48rpx;
        height: 48rpx;
      }
      .text {
        padding-left: 20rpx;
        color: #333;
        font-size: 30rpx;
      }
    }
  }
}
</style>