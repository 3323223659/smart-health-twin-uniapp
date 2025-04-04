<template>
	<view class="page-container">
		<!-- 顶部导航栏 -->
		<view  class="navbar" :style="{ paddingTop: `${safeAreaInsets.top}px` }">
			<view class="navbar-content">
				<view class="navbar-left">
					<text class="iconfont icon-menu">≡</text>
				</view>
				<view class="navbar-title">AI助手聊天</view>
				<view class="navbar-right">
					<text class="iconfont icon-comment">💬</text>
				</view>
			</view>
		</view>
		
		<view style="margin-top: 100rpx;">
			<!-- 聊天内容区域 -->
			<scroll-view  class="chat-container" scroll-y="true" 
				:scroll-top="scrollTop" @scrolltolower="onScrollToLower" 
				:style="{ paddingBottom: `${inputHeight}px` }">
				<view class="chat-list">
					<!-- 聊天记录 -->
					<view class="message-item" v-for="(message, index) in chatHistory" :key="index">
						
						<!-- 用户消息 -->
						<view v-if="message.isUser" class="user-message">
							<view class="message-content user-content">
								<view class="message-text">{{message.text}}</view>
							</view>
						</view>
						<!-- AI消息 -->
						<view v-else class="ai-message">
							<view class="avatar ai-avatar">
								<image src="../../static/icon/ai.png" mode="aspectFill"></image>
							</view>
							<view class="message-content ai-content">
								<view class="message-text">{{message.text}}</view>
							</view>
						</view>
					</view>
			
				</view>
			</scroll-view>
		</view>
		
		<!-- 底部输入区域 -->
		<view class="input-container" :style="{ bottom: `${keyboardHeight}px` }">
			<view class="input-wrapper">
				<textarea 
					v-model="userInput" 
					class="input" 
					placeholder="询问小助手问题" 
					confirm-type="send"
					:adjust-position="false"
					:auto-height="true"
					:maxlength="-1"
					@focus="onInputFocus"
					@blur="onInputBlur"
					@confirm="sendMessage"
				/>
				<view class="send-btn" @click="sendMessage">
					<text class="iconfont icon-send">📤</text>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import {
		http
	} from '../../utils/request';

	export default {
		data() {
			return {
				safeAreaInsets: uni.getSystemInfoSync().safeAreaInsets, // 适配安全区
				userInput: '', // 用户输入的内容
				chatHistory: [
				
				], // 聊天记录
				scrollTop: 0, // 滚动位置
				isLoading: false, // 是否正在加载AI回复
				keyboardHeight: 0, // 键盘高度
				inputHeight: 120 // 输入区域高度
			};
		},
		onLoad() {
			
			// 监听键盘高度变化
			uni.onKeyboardHeightChange(res => {
				this.keyboardHeight = res.height;
			});
		},
		methods: {
			// 发送消息
			async sendMessage() {
				if (!this.userInput.trim()) return;

				// 用户消息
				this.chatHistory.push({
					isUser: true,
					text: this.userInput
				});

				// 保存输入内容，清空输入框
				const userMessage = this.userInput;
				this.userInput = '';
				
				// 滚动到底部
				this.scrollToBottom();
				
				// 显示加载状态
				this.isLoading = true;

				try {
					// 等待 AI 回复
					const aiResponse = await this.getAIResponse(userMessage);

					// 隐藏加载状态
					this.isLoading = false;
					
					// AI 消息
					this.chatHistory.push({
						isUser: false,
						text: aiResponse
					});
					
					// 再次滚动到底部以显示新消息
					this.$nextTick(() => {
						this.scrollToBottom();
					});

				} catch (error) {
					console.error("获取 AI 回复失败:", error);
					this.isLoading = false;
					this.chatHistory.push({
						isUser: false,
						text: "AI 回复失败，请稍后重试"
					});
					this.scrollToBottom();
				}
			},

			// 发送请求获取 AI 回复
			async getAIResponse(input) {
				console.log("问题是：", input);
				try {
					const res = await http({
						url: `/learn?message=${encodeURIComponent(input)}`,
						method: 'GET',
					});

					console.log("获取的数据:", res);
					return res; // 确保返回 AI 的文本内容
				} catch (err) {
					console.error("请求失败:", err);
					return "错误！"; // 失败时返回 null
				}
			},
			
			// 滚动到底部
			scrollToBottom() {
				setTimeout(() => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.chat-list').boundingClientRect(data => {
						if (data) {
							this.scrollTop = data.height;
						}
					}).exec();
				}, 100);
			},
			
			// 输入框获取焦点
			onInputFocus() {
				this.scrollToBottom();
			},
			
			// 输入框失去焦点
			onInputBlur() {
				this.keyboardHeight = 0;
			},
			
			// 滚动到底部事件
			onScrollToLower() {
				// 可以加载更多历史消息
			}
		}
	};
</script>

<style lang="scss">
	page {
		width: 100%;
		height: 100%;
		background-color: #f5f5f5;
	}

	.page-container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	/* 顶部导航栏 */
	.navbar {
		background-color: #fff;
		border-bottom: 1px solid #eee;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		
		.navbar-content {
			height: 100rpx;
			display: flex;
			align-items: center;
			padding: 0 30rpx;
			
			.navbar-left, .navbar-right {
				width: 60rpx;
				display: flex;
				justify-content: center;
			}
			
			.navbar-title {
				flex: 1;
				text-align: center;
				font-size: 32rpx;
				font-weight: 500;
				color: #333;
			}
		}
	}

	/* 聊天区域 */
	.chat-container {
		flex: 1;
		padding: 30rpx;
		padding-top: calc(130rpx + var(--status-bar-height));
		box-sizing: border-box;
	}

	.chat-list {
		width: 100%;
		white-space: pre-wrap;
	}

	/* 欢迎消息样式 */
	.welcome-container {
		display: flex;
		justify-content: center;
		margin: 40rpx 0;
		
		.welcome-bubble {
			background-color: #eef6ff;
			padding: 20rpx 40rpx;
			border-radius: 30rpx;
			font-size: 28rpx;
			color: #666;
		}
	}

	/* 消息项样式 */
	.message-item {
		margin-bottom: 40rpx;
	}

	/* AI消息样式 */
	.ai-message {
		display: flex;
		margin-bottom: 30rpx;
		
		.ai-avatar {
			margin-right: 20rpx;
		}
		
		.ai-content {
			background-color: #fff;
			border-radius: 20rpx;
			max-width: 70%;
		}
	}

	/* 用户消息样式 */
	.user-message {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 30rpx;
		
		.user-content {
			background-color: #d9f0ff;
			border-radius: 20rpx;
			max-width: 70%;
		}
	}

	/* 头像样式 */
	.avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		overflow: hidden;
		flex-shrink: 0;
		
		image {
			width: 100%;
			height: 100%;
		}
	}

	/* 消息内容样式 */
	.message-content {
		padding: 20rpx;
		
		.message-text {
			font-size: 30rpx;
			color: #333;
			word-break: break-word;
			line-height: 1.5;
		}
		
		.message-actions {
			display: flex;
			margin-top: 20rpx;
			
			.action-btn {
				font-size: 24rpx;
				color: #999;
				margin-right: 30rpx;
			}
		}
	}

	/* 加载中样式 */
	.loading-message {
		display: flex;
		align-items: flex-start;
		margin-bottom: 30rpx;
		
		.loading-dots {
			display: flex;
			align-items: center;
			margin-left: 20rpx;
			background-color: #fff;
			padding: 20rpx;
			border-radius: 20rpx;
			
			.dot {
				width: 12rpx;
				height: 12rpx;
				background-color: #ccc;
				border-radius: 50%;
				margin: 0 6rpx;
				display: inline-block;
				animation: dot-flashing 1s infinite alternate;
				
				&:nth-child(2) {
					animation-delay: 0.2s;
				}
				
				&:nth-child(3) {
					animation-delay: 0.4s;
				}
			}
		}
	}

	@keyframes dot-flashing {
		0% {
			opacity: 0.3;
		}
		100% {
			opacity: 1;
		}
	}

	/* 底部输入区域 */
	.input-container {
		position: fixed;
		left: 0;
		right: 0;
		background-color: #fff;
		z-index: 99;
		padding: 20rpx 30rpx;
		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
		transition: bottom 0.3s;
		
		.input-wrapper {
			display: flex;
			align-items: center;
			background-color: #f5f6fa;
			border-radius: 40rpx;
			padding: 10rpx 20rpx;
			
			.input {
				flex: 1;
				min-height: 80rpx;
				max-height: 240rpx;
				font-size: 30rpx;
				padding: 15rpx;
				background-color: transparent;
			}
			
			.send-btn {
				width: 80rpx;
				height: 80rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 50%;
				background-color: #4a90e2;
				color: #fff;
				font-size: 40rpx;
			}
		}
		
	
	}
</style>