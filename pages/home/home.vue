<template>
  <view>
	  <view class="page-container">
	    <view
	      class="navbar"
	      :style="{
	        paddingTop: `${safeAreaInsets.top}px`
	      }"
	    ></view>
	  
	    <view class="content">
	      <view class="text-area"> </view>
	    </view>
	  </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 获取系统信息，使用 uni.getSystemInfoSync
      safeAreaInsets: uni.getSystemInfoSync().safeAreaInsets
    }
  }
}
</script>
<style lang="scss">
page {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
// 背景图片样式
.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0; // 确保在底层
}

.page-container {
  height: 550rpx;
  background: linear-gradient(
    to bottom,
    #c1a8f0 0%,
    rgba(255, 255, 255, 1) 100% /* 纯白结束 */
  );
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 0;
}
/* 自定义导航条 */
.navbar {
  background-size: cover;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 20px;
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
</style>
