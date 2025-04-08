<template>
	<view class="page-container">
		<!-- 顶部导航栏 -->
		<view class="navbar" :style="{ paddingTop: `${safeAreaInsets.top}px` }">
			<view class="navbar-content">
				<view class="navbar-left" @click="toggleSidebar">
					<uni-icons type="bars" color="#333" size="30" /> 
				</view>
				<view class="navbar-left" @click="clearChat">	
					<image
					  class="icon"
					  src="../../static/icon/session.png"
					  mode="scaleToFill"
					/>
				</view>
				<view class="navbar-title">AIR小智</view>
			</view>
		</view>
		
		<!-- 侧边栏 -->
		<view class="sidebar" v-if="showSidebar" @click="toggleSidebar">
			<view class="sidebar-content" @click.stop>
				<view class="sidebar-item" @click="doSomething('2025-4-8-2')">对话2025-4-8-2</view>
				<view class="sidebar-item" @click="doSomething('2025-4-8-1')">对话2025-4-8-1</view>
				<view class="sidebar-item" @click="doSomething('2025-4-7-1')">对话2025-4-7-1</view>
			</view>
		</view>
		
		<view style="">
			<!-- 聊天内容区域 -->
			<scroll-view class="chat-container" scroll-y="true" 
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
					placeholder="请输入询问内容" 
					confirm-type="send"
					:adjust-position="false"
					:auto-height="true"
					:maxlength="-1"
					@focus="onInputFocus"
					@blur="onInputBlur"
					@confirm="sendMessage"
				/>
				<view class="send-btn" @click="sendMessage">
					<uni-icons type="paperplane" color="#1296DB" size="30" /> 
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { chatAPI } from '@/api/system.js';
	
	export default {
	  data() {
	    return {
	      safeAreaInsets: uni.getSystemInfoSync().safeAreaInsets,
	      userInput: '',
	      chatHistory: [],
	      scrollTop: 0,
	      isLoading: false,
	      keyboardHeight: 0,
	      inputHeight: 120,
	      showSidebar: false,
	      initialMessage: {
	        isUser: false,
	        text: "你好，我是您的健康助手小智，你可以询问我生活等方面的问题，我将结合你的身体信息进行回答。"
	      }
	    };
	  },
	  onLoad() {
	    this.chatHistory.push(this.initialMessage);
	    
	    uni.onKeyboardHeightChange(res => {
	      this.keyboardHeight = res.height;
	    });
	  },
	  methods: {
	    async sendMessage() {
	      if (!this.userInput.trim()) {
	        uni.showToast({ title: '请输入内容', icon: 'none' });
	        return;
	      }
	
	      // 保存用户消息
	      const userMessage = this.userInput;
	      this.chatHistory.push({
	        isUser: true,
	        text: userMessage
	      });
	      
	      this.userInput = '';
	      this.scrollToBottom();
	      this.isLoading = true;
	
	      try {
	        // 添加加载中消息
	        const loadingIndex = this.chatHistory.push({
	          isUser: false,
	          text: "正在思考...",
	          isLoading: true
	        }) - 1;
	
	        // 调用API
	        const {data} = await chatAPI({ message: userMessage });
	        
	        // 替换加载中消息为实际回复
	        this.chatHistory[loadingIndex] = {
	          isUser: false,
	          text: data.value // 根据实际API返回结构调整
	        };
	        
	      } catch (error) {
	        console.error("AI回复失败:", error);
	        this.chatHistory.push({
	          isUser: false,
	          text: "回复失败: " + (error.message || "请检查网络连接")
	        });
	        uni.showToast({ title: '请求失败', icon: 'none' });
	      } finally {
	        this.isLoading = false;
	        this.$nextTick(this.scrollToBottom);
	      }
	    },
	    
	    // 清空聊天记录
	    clearChat() {
	      this.chatHistory = [this.initialMessage];
	      uni.showToast({
	        title: '新建对话',
	        icon: 'none'
	      });
	    },
	    
	    // 切换侧边栏显示
	    toggleSidebar() {
	      this.showSidebar = !this.showSidebar;
	    },
	    
	    // 侧边栏菜单项点击
	    doSomething(action) {
	      this.showSidebar = false;
	      uni.showToast({
	        title: `跳转到对话${action}`,
	        icon: 'none'
	      });
	      // 这里可以添加具体的菜单项处理逻辑
	    },
	    
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
	    
	    onInputFocus() {
	      this.scrollToBottom();
	    },
	    
	    onInputBlur() {
	      this.keyboardHeight = 0;
	    },
	    
	    onScrollToLower() {
	      // 加载更多历史消息的逻辑
	    }
	  }
	};
</script>

<style lang="scss">
	.page-container {
	  height: 200rpx;
	  background: linear-gradient(
	    to bottom,
	    #55ceec 0%,
	    rgba(255, 255, 255, 1) 100% /* 纯白结束 */
	  );
	  position: absolute;
	  top: 0;
	  left: 0;
	  right: 0;
	  z-index: 0;
	}

	/* 顶部导航栏 */
	.navbar {
		background-size: cover;
		position: relative;
		display: flex;
		flex-direction: column;
		
		.navbar-content {
			height: 100rpx;
			display: flex;
			align-items: center;
			padding: 0 30rpx;
			
			.navbar-left {
				width: 60rpx;
				display: flex;
				justify-content: center;
				
				.icon {
					width: 48rpx;
					height: 48rpx;
				}
			}
			
			.navbar-title {
				flex: 1;
				text-align: center;
				font-size: 32rpx;
				font-weight: 500;
				color: #333;
				margin-right: 120rpx;
			}
		}
	}

	/* 侧边栏样式 */
	.sidebar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 100;
		display: flex;
		
		.sidebar-content {
			width: 60%;
			height: 100%;
			background-color: #fff;
			padding-top: var(--status-bar-height);
			box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
			
			.sidebar-item {
				padding: 30rpx;
				font-size: 32rpx;
				border-bottom: 1px solid #f5f5f5;
				
				&:active {
					background-color: #f5f5f5;
				}
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
			margin-bottom: 40rpx;
			  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.2); /* 轻微阴影 */
			  border-radius: 12rpx;
			  padding: 20rpx;
			  background: #fff; /* 确保背景是白色 */
			max-width: 90%;
		}
	}

	/* 用户消息样式 */
	.user-message {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 30rpx;
		
		.user-content {
			margin-bottom: 40rpx;
			  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.2); /* 轻微阴影 */
			  border-radius: 12rpx;
			  padding: 20rpx;
			  background: #55ceec; /* 确保背景是白色 */
			max-width: 90%;
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
				min-height: 40rpx;
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
				color: #fff;
				font-size: 40rpx;
				
				.icon {
					width: 48rpx;
					height: 48rpx;
				}
			}
		}
	}
</style>