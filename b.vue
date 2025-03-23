<template>
	<view>
		<canvas class='scene' id='scene' canvas-id="scene" type="webgl"
			:style="'width:'+mSceneWidth+'px; height:'+mSceneHeight+'px;'" @touchstart="touchStart"
			@touchmove="touchMove" @touchend="touchEnd">
		</canvas>
		
	</view>
</template>

<script>
	// 导入 threejs
	import * as THREE from '../../lib/three.weapp.js'
	import {
		OrbitControls
	} from '../../lib/OrbitControls.js'
	import GLTF from '../../lib/GLTFLoader.js'

	export default {
		data() {
			return {
				mSceneWidth: 0, // 手机屏幕宽度
				mSceneHeight: 0, // 手机屏幕高度

				worldFocus: null, // 世界焦点（模型放置，相机围绕的中心）

				mCanvasId: null,
				mSence: null,
				mCamera: null,

				renderAnimFrameId: null, // 渲染帧动画id
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
			// 获取 canvas 元素, 初始化 Three
			uni.createSelectorQuery().select('#scene').node().exec((res) => {
				// 获取 canvasId
				this.mCanvasId = res[0].node._canvasId;
				// 注册画布
				const mCanvas = THREE.global.registerCanvas(this.mCanvasId, res[0].node);
				// 开始初始化
				this.init(mCanvas);
			});
		},
		// 页面卸载时
		onUnload() {
			// 清理渲染帧动画
			THREE.global.canvas && THREE.global.canvas.cancelAnimationFrame(this.renderAnimFrameId);
			// 清理canvas对象
			THREE.global.unregisterCanvas(this.mCanvasId);
			console.log("Unload");
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

				// 创建渲染器
				const renderer = new THREE.WebGLRenderer({
					antialias: true,
					alpha: true
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
				// 微信小程序不允许加载本地模型，必须通过 https 获取
				loader.load("https://threejs.org/examples/models/gltf/Stork.glb", (gltf) => {
					const model = gltf.scene;
					model.position.set(0, 0, 0); // 设置模型位置
					model.scale.set(0.1, 0.1, 0.1); // 设置模型大小
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
				THREE.global.touchEventHandlerFactory('canvas', 'touchstart')(e)
			},
			// 触摸移动中
			touchMove(e) {
				THREE.global.touchEventHandlerFactory('canvas', 'touchmove')(e)
			},
			// 触摸结束
			touchEnd(e) {
				THREE.global.touchEventHandlerFactory('canvas', 'touchend')(e)
			},
		}
	}
</script>

<style lang="scss">
</style>