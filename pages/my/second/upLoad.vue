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
	      <view class="title-custom">导出报告</view>
	    </uni-nav-bar>
	  </view>
	  
	  <view class="content">
	    <view class="text-area"></view>
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
    // mounted生命周期钩子，组件挂载完成后执行的代码
  },
  methods: {
    // 返回上一页
    back() {
      uni.switchTab({
        url: "/pages/my/my",
      });
    }
  }
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
</style>