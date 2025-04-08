<template>
	<view>
		<view class="page-container">
			<view class="navbar" :style="{ paddingTop: `${safeAreaInsets.top}px` }"></view>
			<view class="content">
				<view class="text-area">
					<swiper class="swiper" style="height: 400rpx" :autoplay="true" :circular="true"
						:interval="3000" :duration="1000">
						<swiper-item class="swiper-item" v-for="(item, index) in swiperList" :key="index">
							<image class="swiper-image" :src="item.image" mode="aspectFill" />
						</swiper-item>
					</swiper>
				</view>

				<!-- 图标部分 -->
				<view class="icon-container" style="margin-top: 80rpx;">
					<view class="icon" @click="handleTypeClick('member')">
						<image class="icon-image" src="../../static/image/vip.jpg" />
						<text class="icon-text">会员权益</text>
					</view>
					<view class="icon" @click="handleTypeClick('health')">
						<image class="icon-image" src="../../static/image/health.jpg" />
						<text class="icon-text">健康中心</text>
					</view>
					<view class="icon" @click="handleTypeClick('wellness')">
						<image class="icon-image" src="../../static/image/wellness.jpeg" />
						<text class="icon-text">养生知识</text>
					</view>
					<view class="icon" @click="handleTypeClick('shopping')">
						<image class="icon-image" src="../../static/image/shop.png" />
						<text class="icon-text">购物中心</text>
					</view>
				</view>
				
				<!-- 健康服务部分 -->
				<view class="section">
					<view class="section-header">
						<text class="section-title">健康服务</text>
						<text class="section-more" @click="showMore('health-service')">更多 ></text>
					</view>
					
					<scroll-view class="health-cards" scroll-x="true" show-scrollbar="false">
						<view class="health-card teal-gradient" @click="handleServiceClick('体检解读')">
							<text class="card-title">智能体检报告解读</text>
							<text class="card-desc">上传体检报告，AI智能分析健康风险</text>
							<view class="card-btn">立即体检</view>
						</view>
						<view class="health-card blue-gradient" @click="handleServiceClick('数字人')">
							<text class="card-title">3D孪生数字人</text>
							<text class="card-desc">大模型分析健康风险提出建议</text>
							<view class="card-btn">查看分析</view>
						</view>
						<view class="health-card orange-gradient" @click="handleServiceClick('导出报告')">
							<text class="card-title">导出健康报告</text>
							<text class="card-desc">导出您的健康报告</text>
							<view class="card-btn">导出报告</view>
						</view>
<!-- 						<view class="health-card green-gradient" @click="handleServiceClick('作息信息')">
							<text class="card-title">构建作息信息</text>
							<text class="card-desc">构建你的个性化作息时间信息供以分析</text>
							<view class="card-btn">构建作息</view>
						</view> -->
						<view class="health-card pink-gradient" @click="handleServiceClick('健康打卡')">
							<text class="card-title">每日健康打卡</text>
							<text class="card-desc">记录您的活跃信息</text>
							<view class="card-btn">开始打卡</view>
						</view>
						<view class="health-card purple-gradient" @click="handleServiceClick('专家咨询')">
							<text class="card-title">专家在线咨询</text>
							<text class="card-desc">随时随地向医疗专家咨询健康问题</text>
							<view class="card-btn">预约咨询</view>
						</view>
					</scroll-view>
				</view>
				
				<!-- 健康小工具部分 -->
				<view class="section">
					<view class="section-header">
						<text class="section-title">健康小工具</text>
						<text class="section-more" @click="showMore('health-tools')">全部 ></text>
					</view>
					
					<view class="tools-grid">
						<view class="tool-item" v-for="(tool, index) in healthTools" :key="index" @click="handleToolClick(tool.name)">
							<view class="tool-icon" :class="tool.bgClass">
								<text class="tool-icon-text">{{tool.icon}}</text>
							</view>
							<text class="tool-name">{{tool.name}}</text>
						</view>
					</view>
				</view>
				
				<!-- 健康资讯部分 -->
				<view class="section" id="health-news">
					<view class="section-header">
						<text class="section-title">健康资讯</text>
						<text class="section-more" @click="showMore('health-news')">更多 ></text>
					</view>
					
					<view class="news-list">
						<view class="news-item" @click="handleNewsClick('AI技术')">
							<view class="news-content">
								<text class="news-title">AI技术如何改变医疗健康行业的未来发展</text>
								<view class="news-info">
									<text class="news-tag">前沿科技</text>
									<text class="news-reads">5678阅读</text>
								</view>
							</view>
							<view class="news-image">
								<image mode="aspectFill" style="width: 100%; height: 100%;" src="../../static/image/yiliao3.jpeg" />
							</view>
						</view>
						
						<view class="news-item" @click="handleNewsClick('夏季养生')">
							<view class="news-content">
								<text class="news-title">夏季养生指南：如何在炎热天气保持健康</text>
								<view class="news-info">
									<text class="news-tag">养生</text>
									<text class="news-reads">3456阅读</text>
								</view>
							</view>
							<view class="news-image">
								<image mode="aspectFill" style="width: 100%; height: 100%;" src="../../static/image/content2.jpg" />
							</view>
						</view>
						
						<view class="news-item" @click="handleNewsClick('营养推荐')">
							<view class="news-content">
								<text class="news-title">营养师推荐：每日必吃的五种超级食物</text>
								<view class="news-info">
									<text class="news-tag">营养</text>
									<text class="news-reads">4321阅读</text>
								</view>
							</view>
							<view class="news-image">
								<image mode="aspectFill" style="width: 100%; height: 100%;" src="../../static/image/content3.jpg" />
							</view>
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
				swiperList: [{
						image: '/static/image/yiliao.jpeg'
					},
					{
						image: '/static/image/yiliao2.jpeg'
					},
					{
						image: '/static/image/yiliao3.jpeg'
					}
				],
				safeAreaInsets: uni.getSystemInfoSync().safeAreaInsets || {
					top: 0
				},
				healthTools: [
					{ name: '用药提醒', icon: '💊', bgClass: 'bg-blue' },
					{ name: '健康检测', icon: '📈', bgClass: 'bg-green' },
					{ name: '膳食计划', icon: '🥗', bgClass: 'bg-orange' },
					{ name: '喝水提醒', icon: '💧', bgClass: 'bg-purple' },
					{ name: '运动记录', icon: '🏃', bgClass: 'bg-blue' },
					{ name: '睡眠分析', icon: '😴', bgClass: 'bg-green' },
					{ name: '心率监测', icon: '❤️', bgClass: 'bg-orange' },
					{ name: '预约挂号', icon: '📅', bgClass: 'bg-purple' }
				]
			};
		},
		methods: {
			handleTypeClick(type) {
				if (type === 'health') {
					uni.switchTab({
						url: '/pages/twin/twin'
					});
				}else if (type === 'wellness') {
					uni.createSelectorQuery().select('#health-news').boundingClientRect(rect => {
						uni.pageScrollTo({
							duration: 300,
							scrollTop: rect.top - 50 // 减去50是为了留出一些顶部空间
						});
					}).exec();
				} else{
					uni.showToast({
						title: `跳转到${type}页面，暂未实现`,
						icon: 'none'
					});
				}
			},
			showMore(section) {
				uni.showToast({
					title: `查看${section}更多内容，暂未实现`,
					icon: 'none'
				});
			},
			handleServiceClick(service) {
				if (service === '体检解读') {
					uni.navigateTo({
						url: '/pages/my/second/physical'
					});
				} else if (service === '健康打卡') {
					uni.showToast({
						title: '今日打卡成功!',
						icon: 'none'
					});
				} else if (service === '专家咨询') {
					uni.switchTab({
						url: '/pages/chat/chat',
					});
				}else if (service === '数字人') {
					uni.switchTab({
						url: '/pages/twin/twin',
					});
				}else if (service === '作息信息') {
					uni.navigateTo({
						url: '/pages/my/second/clock',
					});
				} else {
					uni.showToast({
						title: `您点击了${service}服务，暂未实现`,
						icon: 'none'
					});
				}
			},
			handleToolClick(tool) {
				if (tool === '运动记录' || tool === '心率监测') {
					uni.switchTab({
						url: '/pages/twin/twin'
					});
				}else if (tool === '健康检测') {
					uni.navigateTo({
						url: '/pages/home/second/Health-index'
					});
				}else{
					uni.showToast({
						title: `您启动了${tool}功能，暂未实现`,
						icon: 'none'
					});
				}
			},
			handleNewsClick(news) {
				uni.showToast({
					title: `您正在阅读关于${news}的文章，暂未实现`,
					icon: 'none'
				});
			}
		}
	};
</script>

<style lang="scss">
	.page-container {
	  height: 100rpx;
	  background: linear-gradient(
	    to bottom,
	    #165DFF 0%,
	    /* 浅青色起始 */ rgba(255, 255, 255, 1) 100% /* 纯白结束 */
	  );
	  position: absolute;
	  top: 0;
	  left: 0;
	  right: 0;
	  z-index: 0;
	}

	.navbar {
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.content {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: 30rpx;
	}

	.text-area {
		width: 100%;
		height: 350rpx;
	}

	.swiper {
		width: 100%;
		height: 350rpx;
	}

	.swiper-item {
		width: 100%;
		height: 100%;
	}

	.swiper-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* 图标容器 */
	.icon-container {
		display: flex;
		justify-content: space-around;
		width: 100%;
		margin-top: 30rpx;
		padding: 30rpx 0;
		background-color: #ffffff;
	}

	.icon {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;  /* 使图标和文字居中 */
		justify-content: center;  /* 垂直居中 */
	}

	.icon-image {
		width: 100rpx;
		height: 100rpx;
		margin-bottom: 10rpx;
		border-radius: 50%;
	}

	.icon-text {
		font-size: 28rpx;
		color: #333;
	}
	
	/* 各板块通用样式 */
	.section {
		width: 100%;
		margin-top: 20rpx;
	}
	
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 30rpx 20rpx;
	}
	
	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	
	.section-more {
		font-size: 24rpx;
		color: #999;
	}
	
	/* 健康服务卡片 */
	.health-cards {
		width: 100%;
		white-space: nowrap;
		padding: 0 20rpx;
	}
	
	.health-card {
		display: inline-block;
		width: 70%;
		height: 300rpx;
		margin-right: 20rpx;
		border-radius: 20rpx;
		padding: 30rpx;
		box-sizing: border-box;
		position: relative;
	}
	
	.teal-gradient {
		background: linear-gradient(135deg, #43cea2, #185a9d);
	}
	
	.blue-gradient {
		background: linear-gradient(135deg, #1CD3F3, #6CC2D1);
	}
	
	.orange-gradient {
		background: linear-gradient(135deg, #CFA412, #E3EA7D);
	}
	
	.green-gradient {
		background: linear-gradient(135deg, #06F121, #68EE77);
	}
	
	.pink-gradient {
		background: linear-gradient(135deg, #ff9a9e, #fad0c4);
	}
	
	.purple-gradient {
		background: linear-gradient(135deg, #a18cd1, #fbc2eb);
	}
	
	.card-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #ffffff;
		margin-bottom: 20rpx;
		display: block;
	}
	
	.card-desc {
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.8);
		margin-bottom: 40rpx;
		display: block;
	}
	
	.card-btn {
		display: inline-block;
		background: rgba(255, 255, 255, 0.3);
		color: #ffffff;
		padding: 12rpx 30rpx;
		border-radius: 50rpx;
		font-size: 24rpx;
	}
	
	/* 健康小工具 */
	.tools-grid {
		display: flex;
		flex-wrap: wrap;
		padding: 0 20rpx 20rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
		margin: 0 20rpx;
	}
	
	.tool-item {
		width: 25%;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 30rpx;
	}
	
	.tool-icon {
		width: 90rpx;
		height: 90rpx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 10rpx;
	}
	
	.tool-icon-text {
		font-size: 40rpx;
	}
	
	.bg-blue {
		background-color: #e6f7ff;
	}
	
	.bg-green {
		background-color: #f6ffed;
	}
	
	.bg-orange {
		background-color: #fff7e6;
	}
	
	.bg-purple {
		background-color: #f9f0ff;
	}
	
	.tool-name {
		font-size: 24rpx;
		color: #666;
	}
	
	/* 健康资讯 */
	.news-list {
		background-color: #ffffff;
		padding: 0 30rpx;
	}
	
	.news-item {
		display: flex;
		padding: 30rpx 0;
		border-bottom: 1px solid #f0f0f0;
	}
	
	.news-content {
		flex: 1;
		padding-right: 20rpx;
	}
	
	.news-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		margin-bottom: 10rpx;
	}
	
	.news-info {
		display: flex;
		align-items: center;
	}
	
	.news-tag {
		display: inline-block;
		background-color: #f0f7ff;
		color: #2575fc;
		padding: 4rpx 12rpx;
		border-radius: 8rpx;
		font-size: 22rpx;
		margin-right: 16rpx;
	}
	
	.news-reads {
		font-size: 24rpx;
		color: #999;
	}
	
	.news-image {
		width: 160rpx;
		height: 160rpx;
		background-color: #eee;
		border-radius: 12rpx;
	}
</style>