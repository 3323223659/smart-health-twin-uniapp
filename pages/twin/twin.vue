<template>
	<view class="page-container">
		<view class="navbar" :style="{ paddingTop: `${safeAreaInsets.top}px` }"></view>
		<view class="twin">
			<view>
				<canvas class='scene' id='scene' canvas-id="scene" type="webgl"
					:style="'width:'+mSceneWidth+'px; height:'+mSceneHeight+'px;'" @touchstart="touchStart"
					@touchmove="touchMove" @touchend="touchEnd">
				</canvas>
			</view>
		</view>
		<view style="position: fixed; width: 100%; height: 100%; top: 0; left: 0;">
			<van-popup :show="showPopup" @close="showPopup = false" style="height: 100rpx;width: 100rpx;">
				这里是弹窗内容
			</van-popup>
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
			this.mSceneHeight = uni.getWindowInfo().windowHeight;
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
					model.position.set(0, 0, 0); // 设置模型位置
					model.scale.set(16, 16, 16); // 设置模型大小
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
					console.log("点击了模型", intersects[0].object);
					this.showPopup = true;
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
	}

	.page-container {
		height: 550rpx;
		background: linear-gradient(to bottom,
				#55ceec 0%,
				rgba(255, 255, 255, 1) 100%);
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

	.twin {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.scene {
		background: transparent;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;

	}

	.van-popup {
		z-index: 9999 !important;
	}
</style>