<template>
	<view class="page-container">
		<view class="navbar" :style="{ paddingTop: `${safeAreaInsets.top}px` }"></view>
		<!-- 3D模型展示区 -->
		<view class="model-area">
			<view class="twin">
				<view>
					<canvas class='scene' id='scene' canvas-id="scene" type="webgl"
						:style="'width:'+mSceneWidth+'px; height:'+modelHeight+'px;'" @touchstart="touchStart"
						@touchmove="touchMove" @touchend="touchEnd">
					</canvas>
				</view>
			</view>
		</view>
		
		<!-- 数字人信息卡片 -->
		<view class="info-section">
			<view class="info-card">
				<view class="card-title">数字人信息</view>
				
				<!-- 健康数据 -->
				<view class="health-data">
					<view class="health-item">
						<view class="health-icon temp-icon">
							<text class="icon-text">🌡️</text>
						</view>
						<view class="health-name">体温</view>
						<view class="health-value">
							<text class="value-text">36.5</text>
							<text class="unit-text">°C</text>
						</view>
					</view>
					
					<view class="health-item">
						<view class="health-icon heart-icon">
							<text class="icon-text">❤️</text>
						</view>
						<view class="health-name">心率</view>
						<view class="health-value">
							<text class="value-text">72</text>
							<text class="unit-text">次/分钟</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 健康建议卡片 -->
			<view class="suggestion-card">
				<view class="suggestion-title">
					<view class="suggestion-icon">💡</view>
					<text>健康建议</text>
				</view>
				
				<view class="suggestion-item">
					<view class="bullet">1</view>
					<view class="suggestion-text">根据您的健康数据，建议您在接下来一周内坚持每天至少30分钟的有氧运动，如快走或慢跑。</view>
				</view>
				
				<view class="suggestion-item">
					<view class="bullet">2</view>
					<view class="suggestion-text">您的睡眠质量良好，建议保持规律的作息时间，避免睡前使用电子设备。</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as THREE from '../../lib/three.weapp.js'
	import {
		OrbitControls
	} from '../../lib/OrbitControls.js'
	import GLTF from '../../lib/GLTFLoader.js'

	export default {
		data() {
			return {
				mSceneWidth: 0,
				showPopup: false,
				mSceneHeight: 0,
				modelHeight: 280, // 3D模型区域高度
				worldFocus: null,
				mCanvasId: null,
				mScene: null,
				mCamera: null,
				renderer: null,
				renderAnimFrameId: null,
				closePopupTimer: null,
				safeAreaInsets: uni.getSystemInfoSync().safeAreaInsets || {
					top: 0
				}
			};
		},
		// 页面加载时
		onLoad(option) {
			// 获取手机屏幕宽高
			this.mSceneWidth = uni.getWindowInfo().windowWidth;
			this.mSceneHeight = this.modelHeight; // 设置3D模型区域高度
			// 设置世界中心
			this.worldFocus = new THREE.Vector3(0, 0, 0);
		},
		// 页面加载完毕后
		onReady() {
			uni.createSelectorQuery().select('#scene').node().exec((res) => {
				if (!res[0] || !res[0].node) {
					console.error("获取 canvas 失败");
					return;
				}
				this.mCanvasId = res[0].node._canvasId;
				console.log("mCanvasId:", this.mCanvasId);
				const mCanvas = THREE.global.registerCanvas(this.mCanvasId, res[0].node);
				this.init(mCanvas);
			});
		},
		// 页面卸载时
		onUnload() {
			console.log("Unload", this.mCanvasId);

			if (this.renderAnimFrameId && THREE.global.canvas) {
				THREE.global.canvas.cancelAnimationFrame(this.renderAnimFrameId);
			}

			if (this.mCanvasId) {
				THREE.global.unregisterCanvas(this.mCanvasId);
			} else {
				console.warn("mCanvasId 为空，跳过 unregisterCanvas");
			}
		},
		methods: {
			// 初始化
			init(canvas) {
				// 创建场景
				this.mScene = new THREE.Scene();
				this.mScene.background = new THREE.Color("#e6e6e6"); // 场景背景颜色

				// 创建摄像机
				this.mCamera = new THREE.PerspectiveCamera(75, this.mSceneWidth / this.mSceneHeight, 0.1, 100);
				this.mCamera.position.set(0, 0, 20);
				this.mCamera.lookAt(this.worldFocus);

				// 创建光线
				const light1 = new THREE.HemisphereLight(0xffffff, 0x444444); // 半球光（天空颜色，地面颜色，光照强度）
				light1.position.set(0, 20, 0);
				this.mScene.add(light1);
				const light2 = new THREE.DirectionalLight(0xffffff); // 平行光（颜色， 光照强度）
				light2.position.set(0, 0, 20);
				this.mScene.add(light2);
				this.mScene.background = null;


				// 创建渲染器
				const renderer = new THREE.WebGLRenderer({
					antialias: true,
					alpha: true,

				});
				renderer.setSize(this.mSceneWidth, this.mSceneHeight);

				// 创建控制器
				const controls = new OrbitControls(this.mCamera, renderer.domElement);
				controls.target.set(this.worldFocus.x, this.worldFocus.y, this.worldFocus.z); // 摄像机围绕旋转的中心
				controls.enablePan = false; // 禁止摄像机平移
				controls.enableDamping = true; // 设置阻尼，需要在 update 调用
				controls.dampingFactor = 0.09;

				// 创建 glb 加载器
				let GLTFloader = GLTF(THREE)
				const loader = new GLTFloader();
				// 异步加载模型
				// 微信小程序不允许加载本地模型，必须通过 https 获取https://threejs.org/examples/models/gltf/Stork.glb
				loader.load("https://soevereign.oss-cn-shenzhen.aliyuncs.com/man.gltf", (gltf) => {
					const model = gltf.scene;
					model.position.set(0, 5, 0); // 设置模型位置
					model.scale.set(25, 25, 25); // 设置模型大小
					model.userData.info = "这是一位虚拟人物，来自未来世界。";
					this.mScene.add(model);
					// 模型加载到场景后，开启渲染
					render();
				});

				// 渲染（闭包）
				var render = () => {
					// 帧动画
					this.renderAnimFrameId = canvas.requestAnimationFrame(render);

					//光源跟随相机
					var vector = this.mCamera.position.clone();
					light2.position.set(vector.x, vector.y, vector.z);

					// 控制器
					if (controls.enabled) controls.update();
					// 渲染场景
					renderer.render(this.mScene, this.mCamera);
				};
			},
			// 触摸开始
			touchStart(e) {
				const touch = e.touches[0];
				const raycaster = new THREE.Raycaster();
				const mouse = new THREE.Vector2();

				// 计算点击位置
				mouse.x = (touch.clientX / this.mSceneWidth) * 2 - 1;
				mouse.y = -(touch.clientY / this.mSceneHeight) * 2 + 1;

				// 计算射线
				raycaster.setFromCamera(mouse, this.mCamera);

				// 检测交叉点
				const intersects = raycaster.intersectObjects(this.mScene.children, true);
				if (intersects.length > 0) {
					const clickedObject = intersects[0].object;
					console.log("点击的对象:", clickedObject);
					console.log("点击对象的 userData:", clickedObject.userData);
				} else {
					console.log("未点击到模型");
				}

				THREE.global.touchEventHandlerFactory('canvas', 'touchstart')(e);
			},
			// 触摸移动中
			touchMove(e) {
				THREE.global.touchEventHandlerFactory('canvas', 'touchmove')(e)
			},
			// 触摸结束
			touchEnd(e) {
				// 如果之前有定时器，清除它
				if (this.closePopupTimer) {
					clearTimeout(this.closePopupTimer);
				}

				// 设置新的定时器，延迟关闭弹框
				this.closePopupTimer = setTimeout(() => {
					this.showPopup = false; // 关闭弹框
				}, 1500); // 1.5秒后关闭弹框
			}
		}
	};
</script>

<style lang="scss">
	page {
		width: 100%;
		height: 100%;
		overflow: hidden;
		background-color: #f5f7fa;
	}

	.page-container {
		height: 100%;
		display: flex;
		flex-direction: column;
		background-color: #f5f7fa;
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
	}
	
	/* 3D模型展示区域 */
	.model-area {
		width: 100%;
		height: 280px;
		background: rgba(230, 236, 245, 0.5);
		margin-bottom: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	
	.model-title {
		font-size: 16px;
		color: #333;
		margin-bottom: 4px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		z-index: 0;
	}
	
	.model-subtitle {
		font-size: 12px;
		color: #999;
		position: absolute;
		top: 58%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		z-index: 0;
	}

	.twin {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.scene {
		background: transparent;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
	}
	
	/* 信息卡片区域 */
	.info-section {
		padding: 0 16px;
		flex: 1;
	}
	
	.info-card {
		background-color: #fff;
		border-radius: 16px;
		padding: 20px;
		margin-bottom: 16px;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
	}
	
	.card-title {
		font-size: 18px;
		font-weight: 600;
		color: #333;
		margin-bottom: 16px;
	}
	
	/* 健康数据样式 */
	.health-data {
		display: flex;
		justify-content: space-between;
	}
	
	.health-item {
		width: 48%;
		background: rgba(245, 247, 250, 0.8);
		border-radius: 12px;
		padding: 16px;
	}
	
	.health-icon {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 10px;
	}
	
	.icon-text {
		font-size: 24px;
	}
	
	.temp-icon {
		background: linear-gradient(135deg, #FF9A9E 0%, #F6416C 100%);
	}
	
	.heart-icon {
		background: linear-gradient(135deg, #FDA085 0%, #F6D365 100%);
	}
	
	.health-name {
		font-size: 14px;
		color: #666;
		margin-bottom: 6px;
	}
	
	.health-value {
		display: flex;
		align-items: flex-end;
	}
	
	.value-text {
		font-size: 24px;
		font-weight: 600;
		color: #333;
	}
	
	.unit-text {
		font-size: 12px;
		color: #999;
		margin-left: 4px;
		margin-bottom: 4px;
	}
	
	/* 健康建议卡片 */
	.suggestion-card {
		background-color: #fff;
		border-radius: 16px;
		padding: 20px;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
	}
	
	.suggestion-title {
		display: flex;
		align-items: center;
		font-size: 18px;
		font-weight: 600;
		color: #333;
		margin-bottom: 16px;
	}
	
	.suggestion-icon {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		margin-right: 8px;
		font-size: 16px;
	}
	
	.suggestion-item {
		display: flex;
		margin-bottom: 12px;
		padding-bottom: 12px;
		border-bottom: 1px solid #f0f0f0;
	}
	
	.suggestion-item:last-child {
		margin-bottom: 0;
		padding-bottom: 0;
		border-bottom: none;
	}
	
	.bullet {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: rgba(106, 17, 203, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		color: #6a11cb;
		margin-right: 12px;
		flex-shrink: 0;
	}
	
	.suggestion-text {
		font-size: 14px;
		line-height: 1.6;
		color: #666;
		flex: 1;
	}
</style>