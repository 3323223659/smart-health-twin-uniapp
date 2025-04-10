<template>
	<view>
		<view class="navbar" :style="{ paddingTop: safeAreaInsets.top + 'px' }"></view>


		<view class="box-bg">
			<uni-nav-bar shadow backgroundColor="#44cf9a" left-icon="left" @clickLeft="back">
				<view class="title-custom">体检信息</view>
			</uni-nav-bar>
		</view>

		<view class="content">
			<view class="text-area">
				<!-- 图片上传组件 -->
				<view class="upload-container">
					<view class="upload-title">上传体检报告图片</view>
					<view class="upload-area" @click="chooseImage">
						<image v-if="imageUrl" :src="imageUrl" mode="aspectFill" class="preview-image"></image>
						<uni-icons v-else type="plusempty" size="50" color="#999"></uni-icons>
					</view>
					<button class="upload-btn" type="primary" @click="uploadImage" :disabled="!imageUrl">上传图片</button>
					<text class="upload-tip">支持jpg、png格式，大小不超过5M</text>
					<text v-if="uploadStatus" class="upload-status">{{ uploadStatus }}</text>
				</view>
			</view>
			<view v-if="showReportAnalysis" class="report-analysis">
				<view class="report-title">体检报告分析：</view>
				<view class="report-content">
					<text v-for="line in reportAnalysisText.split('\n')" :key="line">{{ line }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		uploadAPI
	} from '@/api/system';
	import {
		uploadHealthReport,
		getHealthReport
	} from '@/api/user';

	export default {
		data() {
			return {
				// 获取系统安全区域信息
				safeAreaInsets: uni.getSystemInfoSync().safeAreaInsets,
				imageUrl: '', // 图片临时路径
				uploadStatus: '', // 上传状态提示
				HealthReporData: {
					filePath: ''
				},
				showReportAnalysis: false, // 控制是否显示分析
				reportAnalysisText: '' // 存放分析内容
			};
		},
		mounted() {
			this.initHealthReport()
		},
		methods: {
			// 返回上一页
			back() {
				uni.switchTab({
					url: "/pages/my/my"
				});
			},
			async initHealthReport() {
				const {
					data
				} = await getHealthReport()
				this.imageUrl = data.photoPath

			},
			// 选择图片
			chooseImage() {
				uni.chooseImage({
					count: 1, // 默认9
					sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success: (res) => {
						// 获取图片临时路径
						this.imageUrl = res.tempFilePaths[0];
						this.uploadStatus = '';
					},
					fail: (err) => {
						console.error('选择图片失败:', err);
						uni.showToast({
							title: '选择图片失败',
							icon: 'none'
						});
					}
				});
			},

			// 上传图片
			async uploadImage() {
				if (!this.imageUrl) {
					uni.showToast({
						title: '请先选择图片',
						icon: 'none'
					});
					return;
				}

				this.uploadStatus = '上传中...';

				try {
					uni.showLoading({
						title: '上传中',
						mask: true
					});

					const {
						data
					} = await uploadAPI(this.imageUrl);
					this.HealthReporData.filePath = data.value;
					await uploadHealthReport(this.HealthReporData);

					this.uploadStatus = '上传成功';
					uni.showToast({
						title: '上传成功',
						icon: 'success'
					});

					// 延迟2秒显示体检分析
					setTimeout(() => {
						this.reportAnalysisText =
							'性别：男，22。\n' +
							'- 身高168cm，体重70kg，BMI约24.9（超重边缘）。\n' +
							'- 血压正常（110/70mmHg）。\n' +
							'- 血常规、尿常规、肝功能、血糖、血脂均在正常范围内。\n\n' +
							'**异常项：**\n' +
							'- 血红蛋白略高（160g/L，正常范围约130-175g/L），需注意是否存在脱水或高原反应等情况。\n\n' +
							'**建议：**\n' +
							'- 控制体重，避免超重带来的健康风险。\n' +
							'- 定期复查血红蛋白，排查潜在原因。\n' +
							'- 保持健康生活方式，关注饮食均衡和适量运动。';
						this.showReportAnalysis = true;
					}, 1000);

				} catch (error) {
					console.error('上传失败:', error);
					this.uploadStatus = '上传失败';
					uni.showToast({
						title: '上传失败',
						icon: 'none'
					});
				} finally {
					uni.hideLoading();
				}
			}

		}
	};
</script>

<style lang="scss">
	page {
		width: 100%;
		height: 100%;
		overflow: auto;
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
		color: #000;
		/* 黑色字体 */
		text-align: center;
		/* 居中显示 */
		font-size: 16px;
		/* 字体大小 */
		flex: 1;
		/* 占据剩余空间 */
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
		width: 100%;
		padding: 20px;
		box-sizing: border-box;
	}

	/* 上传组件样式 */
	.upload-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.upload-title {
		font-size: 16px;
		color: #333;
		margin-bottom: 15px;
		font-weight: bold;
	}

	.upload-area {
		width: 200px;
		height: 200px;
		border: 1px dashed #ccc;
		border-radius: 8px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 15px;
		background-color: #f9f9f9;
		overflow: hidden;
	}

	.preview-image {
		width: 100%;
		height: 100%;
	}

	.upload-btn {
		width: 200px;
		margin-bottom: 10px;
	}

	.upload-tip {
		font-size: 12px;
		color: #999;
		margin-bottom: 5px;
	}

	.upload-status {
		font-size: 14px;
		color: #44cf9a;
		margin-top: 5px;
	}

	.report-analysis {
		margin-top: 20px;
		width: 90%;
		padding: 15px;
		background-color: #f6fefb;
		border: 1px solid #44cf9a;
		border-radius: 10px;
		color: #333;
		font-size: 14px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.report-title {
		font-weight: bold;
		color: #2c8f75;
		font-size: 16px;
		margin-bottom: 10px;
	}

	.report-content text {
		display: block;
		margin-bottom: 6px;
		white-space: pre-wrap;
	}
</style>
