<template>
  <view class="page-container">
    <view
      class="navbar"
      :style="{ paddingTop: `${safeAreaInsets.top}px` }"
    ></view>
    <view class="twin">
      <!-- 其他内容 -->
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
  },
  computed: {
    // 如果你有需要从 Vuex 获取其他数据的逻辑，可以在这里处理
    // 示例：用户信息
    userInfo() {
      return this.$store.getters['user/userInfo']
    }
  },
  methods: {
    // 你可以在这里添加其他方法，例如设置或清除用户信息
    setUserInfo(userInfo) {
      this.$store.dispatch('user/setUserInfo', userInfo)
    },
    clearUserInfo() {
      this.$store.dispatch('user/clearUserInfo')
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

.page-container {
  height: 550rpx;
  background: linear-gradient(
    to bottom, 
    #ed9bc7 0%,
    rgba(255,255,255,1) 100%  /* 纯白结束 */
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
.twin {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
