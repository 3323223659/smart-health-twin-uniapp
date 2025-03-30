<template>
	<view class="page-container">
		<view class="navbar" :style="{ paddingTop: `${safeAreaInsets.top}px` }"></view>
		<view class="chat">
			<view class="history" ref="chatHistoryContainer">
				<view style="width: 100%;" v-for="(message, index) in chatHistory" :key="index">
					<view v-if="message.isUser" style="display: flex; justify-content: flex-end;">
						<view
							style="width: auto; background-color: aliceblue; font-size: 20px; margin-top: 20rpx;  height: auto; padding: 10rpx; word-wrap: break-word; white-space: pre-wrap;">
							{{message.text}}
						</view>
					</view>
					<view v-else
						style="width: 70%; background-color: aliceblue; margin-top: 20rpx; font-size: 20px; padding: 10rpx; word-wrap: break-word; white-space: pre-wrap;">
						{{message.text}}
					</view>
				</view>
			</view>
		</view>
		<!-- 输入框和发送按钮 -->
		<view class="input-container">
			<input v-model="userInput" placeholder="请输入您的问题..." class="input" />
			<button type="primary" @click="sendMessage">发送</button>
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
					
				] // 聊天记录
			};
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

				try {
					// 等待 AI 回复
					const aiResponse = await this.getAIResponse(userMessage);

					// AI 消息
					this.chatHistory.push({
						isUser: false,
						text: aiResponse // 处理请求失败的情况
					});

				} catch (error) {
					console.error("获取 AI 回复失败:", error);
					this.chatHistory.push({
						isUser: false,
						text: "AI 回复失败，请稍后重试"
					});
				}

				console.log("历史聊天", this.chatHistory);
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
			}
		}
	};
</script>


<style lang="scss">
	page {
		width: 100%;
		height: 100%;

	}

	.page-container {
		height: 100vh;
		/* 设置为视口高度 */
		background: linear-gradient(to bottom, #ed9bc7 0%, rgba(255, 255, 255, 1) 100%);
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
		padding-top: 20px;
		margin-top: 130rpx;
	}

	.chat {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		flex-grow: 1;
		padding: 10rpx;
		margin-bottom: 200rpx;
		overflow-y: auto;
		/* 启用垂直滚动 */
	}

	.history {
		display: flex;
		flex-direction: column;
		margin-bottom: 200rpx;
	}

	.input-container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 20rpx;
		background-color: white;
		z-index: 10;
		display: flex;
		justify-content: space-between;
	}

	.input {
		flex: 1;
		padding: 10rpx;
		border-radius: 10rpx;
		border: 1px solid #ccc;
	}

	button {
		padding: 10rpx 20rpx;
		border-radius: 10rpx;
		background-color: #007bff;
		color: white;
		border: none;
		cursor: pointer;
	}
</style>