<template>
	<view>
		<view class="page-container">
			<view class="navbar" :style="{ paddingTop: `${safeAreaInsets.top}px` }"></view>
			<view class="content">
				<view class="text-area">
					<swiper class="swiper" style="height: 400rpx; margin-top: 70rpx;" :autoplay="true" :circular="true"
						:interval="3000" :duration="1000">
						<swiper-item class="swiper-item" v-for="(item, index) in swiperList" :key="index">
							<image class="swiper-image" :src="item.image" mode="aspectFill" />
						</swiper-item>
					</swiper>
				</view>

				<!-- 图标部分 -->
				<view class="icon-container" style="margin-top: 180rpx;">
					<view class="icon" @click="navigateTo('member')">
						<image class="icon-image" src="../../static/image/hui.jpeg" />
						<text class="icon-text">会员权益</text>
					</view>
					<view class="icon" @click="navigateTo('health')">
						<image class="icon-image" src="../../static/image/health.png" />
						<text class="icon-text">健康中心</text>
					</view>
					<view class="icon" @click="navigateTo('shopping')">
						<image class="icon-image" src="../../static/image/wellness.jpeg" />
						<text class="icon-text">养生知识</text>
					</view>
					<view class="icon" @click="navigateTo('shopping')">
						<image class="icon-image" src="../../static/image/shopping.jpeg" />
						<text class="icon-text">购物中心</text>
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
				}
			};
		},
		methods: {
			navigateTo(type) {
				if (type === 'member') {
					uni.navigateTo({
						url: '/pages/member/member'
					});
				} else if (type === 'shopping') {
					uni.navigateTo({
						url: '/pages/shopping/shopping'
					});
				}
			}
		}
	};
</script>

<style lang="scss">
	.page-container {
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 0;
		background: #ffffff;
	}

	.navbar {
		position: relative;
		display: flex;
		flex-direction: column;
		padding-top: 20px;
	}

	.content {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
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
		/* 调整与轮播图之间的间隔 */
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
	}

	.icon-text {
		font-size: 28rpx;
		color: #333;
	}
</style>