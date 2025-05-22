# smart-health-twin-uniapp（小程序端）

#### 介绍（此为项目详细介绍）
该项目是融合物联网、人工智能与数字孪生技术的智能健康管理系统，通过自主研发的ESP32-S3智能手表实时采集用户心率、血压、血氧、体温等12项生理指标（采样频率1Hz），解析体检报告PDF或者图片进行健康分析与建议告警，构建个人健康数字孪生模型。调用千问大模型进行慢性病风险预测（准确率85%）与健康AI助手问答功能，并基于构建3D虚拟数字人动态展示健康状态。平台包含微信小程序端与PC管理后台，微信小程序供用户使用绑定设备编号即可实现手表与页面数据互通，管理端供以查看数据与手表设备管理等功能，形成"硬件采集-云端分析-多端可视化"的完整闭环。

#### 关联项目：
管理端：https://github.com/3323223659/smart-health-twin-vue3

后端: https://github.com/3323223659/smart-health-twin-backEnd

#### 软件架构
UniApp+Vue2+ElementPlus+Echarts+Axios+Router+ThreeJS

#### 安装教程
pull 该项目
找到代码压缩包中smart-health-twin-uniapp-vue2\unpackage\dist\dev\mp-weixin，将这个mp-weixin 文件夹用微信开发者工具打开编译运行即可
