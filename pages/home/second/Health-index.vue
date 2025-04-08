<template>
  <view class="page-container">
    <view
      class="navbar"
      :style="{
        paddingTop: `${safeAreaInsets.top}px`,
      }"
    ></view>
	
    <view class="box-bg">
      <uni-nav-bar 
        shadow="false" 
        :border="false"
        backgroundColor="rgba(0,0,0,0)" 
        left-icon="left" 
        @clickLeft="back"
      >
        <view class="title-custom">健康指数</view>
      </uni-nav-bar>
    </view>

    <view class="content">
      <!-- 健康指数卡片 -->
      <view class="health-card">
        <view class="health-score">{{ currentScore }}</view>
        <view class="health-label">当前健康指数</view>
        <view class="health-trend" :class="trendClass">
          {{ trendText }} <text class="trend-arrow">{{ trendArrow }}</text>
        </view>
      </view>
      
      <!-- 指标卡片 -->
      <view class="indicator-container">
        <view 
          class="indicator-card" 
          v-for="(item, index) in healthData.indicators" 
          :key="index"
          :class="item.status"
        >
          <view class="indicator-value">{{ item.value }}</view>
          <view class="indicator-name">{{ item.name }}</view>
          <view class="indicator-unit">{{ item.unit }}</view>
        </view>
      </view>
	  
	 
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 模拟健康数据
      healthData: {
        dates: ['4/1', '4/2', '4/3', '4/4', '4/5', '4/6', '4/7'],
        scores: [82, 85, 88, 86, 89, 92, 90],
        indicators: [
          { name: '心率', value: 72, unit: '次/分', status: 'normal' },
          { name: '血压', value: '118/76', unit: 'mmHg', status: 'normal' },
          { name: '步数', value: 2341, unit: '步', status: 'good' },
          { name: '睡眠', value: 7.5, unit: '小时', status: 'normal' }
        ]
      },
      // 当前健康指数
      currentScore: 0,
      // 趋势数据
      trendText: '',
      trendArrow: '',
      trendClass: '',
      // 安全区域
      safeAreaInsets: uni.getSystemInfoSync().safeAreaInsets
    };
  },
  mounted() {
    this.currentScore = this.healthData.scores[this.healthData.scores.length - 1];
    this.calculateTrend();
    this.indicators = this.healthData.indicators;
  },
  methods: {
    // 计算趋势
    calculateTrend() {
      const scores = this.healthData.scores;
      const last = scores[scores.length - 1];
      const prev = scores[scores.length - 2];
      const diff = last - prev;
      
      if (diff > 0) {
        this.trendText = `较昨日上升${diff}点`;
        this.trendArrow = '↑';
        this.trendClass = 'up';
      } else if (diff < 0) {
        this.trendText = `较昨日下降${Math.abs(diff)}点`;
        this.trendArrow = '↓';
        this.trendClass = 'down';
      } else {
        this.trendText = '与昨日持平';
        this.trendArrow = '→';
        this.trendClass = 'stable';
      }
    },
    
    // 返回上一页
    back() {
      uni.switchTab({
        url: "/pages/home/home",
      });
    }
  }
};
</script>

<style lang="scss">
page {
  width: 100%;
  height: 100%;
  /* 移除 overflow: hidden */
  background-color: #f8f8f8;
}

.page-container {
  min-height: 100%; /* 改为 min-height */
  background: linear-gradient(
    to bottom,
    #c1a8f0 0%,
    rgba(255, 255, 255, 1) 100%
  );
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 0;
  /* 添加 padding-bottom 确保内容可以滚动 */
  padding-bottom: 40rpx;
}

/* 自定义导航条 */
.navbar {
  background-size: cover;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 20px;
}

/* 自定义标题样式 */
.title-custom {
  color: #000;
  text-align: center;
  font-size: 16px;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  display: flex;
  flex-direction: column;
  padding: 20rpx;
  position: relative;
  z-index: 1;
  /* 确保内容可以扩展 */
  min-height: 100vh;
}

/* 健康指数卡片 */
.health-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 40rpx;
  margin: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  .health-score {
    font-size: 72rpx;
    font-weight: bold;
    color: #7c6ce6;
    margin-bottom: 10rpx;
  }
  
  .health-label {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 20rpx;
  }
  
  .health-trend {
    font-size: 26rpx;
    padding: 8rpx 20rpx;
    border-radius: 40rpx;
    
    &.up {
      color: #52c41a;
      background-color: rgba(82, 196, 26, 0.1);
    }
    
    &.down {
      color: #f5222d;
      background-color: rgba(245, 34, 45, 0.1);
    }
    
    &.stable {
      color: #faad14;
      background-color: rgba(250, 173, 20, 0.1);
    }
    
    .trend-arrow {
      margin-left: 6rpx;
    }
  }
}

/* 指标卡片 */
.indicator-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 20rpx;
  margin: 0 10rpx;
}

.indicator-card {
  width: 48%;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6rpx;
  }
  
  &.good::before {
    background-color: #52c41a;
  }
  
  &.normal::before {
    background-color: #1890ff;
  }
  
  &.bad::before {
    background-color: #f5222d;
  }
  
  .indicator-value {
    font-size: 40rpx;
    font-weight: bold;
    color: #7c6ce6;
    margin-bottom: 10rpx;
  }
  
  .indicator-name {
    font-size: 26rpx;
    color: #666;
    margin-bottom: 6rpx;
  }
  
  .indicator-unit {
    font-size: 24rpx;
    color: #999;
  }
}
</style>