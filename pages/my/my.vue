<template>
  <view class="page-container">
    <view class="navbar" :style="{ paddingTop: `${safeAreaInsets.top}px` }"></view>
    <view class="my">
      <view class="userInfo">
        <view class="avatar">
          <image src="../../static/icon/avatar.png" mode="aspectFill" />
        </view>
        <view class="name">{{ userInfo ? userInfo.name : '未登录' }}</view>
        <view class="address">来自于: {{ userInfo ? userInfo.address : '未知' }}</view>
      </view>
      <view class="section">
        <navigator url="/pages/my/second/userInfo">
          <view class="row">
            <view class="left">
              <image class="icon" src="../../static/icon/my-info.png" mode="scaleToFill" />
              <view class="text">基本信息</view>
            </view>
            <view class="right">
              <uni-icons type="right" size="24" />
            </view>
          </view>
        </navigator>
        <navigator url="/pages/my/second/physical">
          <view class="row">
            <view class="left">
              <image class="icon" src="../../static/icon/physical.png" mode="scaleToFill" />
              <view class="text">体检信息</view>
            </view>
            <view class="right">
              <uni-icons type="right" size="24" />
            </view>
          </view>
        </navigator>
        <navigator url="/pages/my/second/clock">
          <view class="row">
            <view class="left">
              <image class="icon" src="../../static/icon/clock.png" mode="scaleToFill" />
              <view class="text">作息信息</view>
            </view>
            <view class="right">
              <uni-icons type="right" size="24" />
            </view>
          </view>
        </navigator>
      </view>
      <view class="section">
        <navigator url="/pages/my/second/upLoad">
          <view class="row">
            <view class="left">
              <uni-icons type="cloud-upload" color="#32CD32" size="24" />
              <view class="text">导出报告</view>
            </view>
            <view class="right">
              <uni-icons type="right" size="24" />
            </view>
          </view>
        </navigator>
      </view>
      <view class="section">
        <navigator url="/pages/my/second/setting">
          <view class="row">
            <view class="left">
              <uni-icons type="gear" color="#32CD32" size="24" />
              <view class="text">设置</view>
            </view>
            <view class="right">
              <uni-icons type="right" size="24" />
            </view>
          </view>
        </navigator>
      </view>
    </view>
    <view style="height: 100rpx"></view>
  </view>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('user', ['userInfo']),
    safeAreaInsets() {
      return uni.getSystemInfoSync().safeAreaInsets || { top: 0 };
    },
  },
  methods: {
    clickContact() {
      uni.makePhoneCall({ phoneNumber: '99999999999' });
    },
  },
};
</script>


<style lang="scss">
page {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.page-container {
  height: 550rpx;
  background: linear-gradient(
    to bottom,
    #44cf9a 0%,
    /* 浅青色起始 */ rgba(255, 255, 255, 1) 100% /* 纯白结束 */
  );
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 0;
}

.navbar {
  background-size: cover;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 60rpx;
}

.my {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.userInfo {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 90rpx 0 40rpx 0;
  .avatar {
    width: 180rpx;
    height: 180rpx;
    border-radius: 50%;
    box-shadow: 0 0 30rpx rgba(0, 0, 0, 0.15);
    overflow: hidden;
    image {
      width: 100%;
      height: 100%;
    }
  }
  .name {
    font-size: 45rpx;
    color: #333;
    padding: 20rpx 0 10rpx;
  }
  .address {
    font-size: 30rpx;
    color: #808080;
  }
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