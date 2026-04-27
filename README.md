# 🍓 莓莓与共——草莓大棚数字孪生交互操作平台

> 基于 React + Three.js + TypeScript 构建的现代化数字孪生农业管理平台

## 项目简介

"莓莓与共"是一个面向智慧农业的草莓大棚数字孪生交互操作平台，通过 3D 可视化、实时数据监控和智能设备控制，为现代温室大棚提供全方位的数字化管理解决方案。

本项目采用 mock 数据驱动，适合用于路演展示、产品原型验证和数字农业技术演示。

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![Three.js](https://img.shields.io/badge/Three.js-0.171.0-000000)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178c6)

## ✨ 核心特性

### 🎮 3D 数字孪生场景
- 使用 **Three.js** 和 **@react-three/fiber** 构建真实感 3D 温室场景
- 支持鼠标拖拽旋转、滚轮缩放、右键平移等交互操作
- 实时展示大棚结构、草莓排、传感器、设备、人员等对象
- 脉冲动画标记、状态标签、热力图等视觉效果

### 📊 多维度数据监控
- **环境监测**: 温度、湿度、光照、CO₂、风速、辐射强度等 8 项指标
- **传感器状态**: 实时数值、状态预警、阈值范围展示
- **能耗管理**: 太阳能发电、风力发电、储能电池、实时功率
- **趋势图表**: 24 小时环境数据趋势可视化

### 🔧 智能设备控制
- 支持 **7 种设备类型**: 除湿器、加湿器、灌溉阀、补光灯、循环风机、降温空调、土壤加热器
- 自动/手动模式切换
- 模拟开关控制、目标值/上下限调节
- 联动规则引擎，根据环境数据自动控制设备

### 🤖 AI 种植建议
- 设备联动建议（如：联动补水、除湿、补光等）
- AI 种植策略推荐（如：灰霉病风险预警、CO₂ 供给策略等）

### 👥 人员与任务管理
- 实时人员定位（巡检人员、采摘人员、维修人员）
- 机械臂采摘小车 AGV 路径展示
- 任务状态跟踪

### 🚨 告警中心
- 多维度告警类型（温度异常、湿度异常、设备离线等）
- 四级告警级别（普通、一般、严重、紧急）
- 3D 场景告警标记与交互处理

## 🏗️ 技术架构

### 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.3.1 | UI 框架 |
| TypeScript | 5.7.2 | 类型安全 |
| Three.js | 0.171.0 | 3D 渲染引擎 |
| @react-three/fiber | 8.17.10 | React 集成 Three.js |
| @react-three/drei | 9.122.0 | Three.js 实用工具 |
| Zustand | 5.0.2 | 状态管理 |
| Recharts | 2.15.0 | 数据可视化图表 |
| Lucide React | 0.468.0 | 图标库 |
| Tailwind CSS | 3.4.17 | 原子化样式 |
| Vite | 6.0.6 | 构建工具 |

### 项目结构

```
📁 src/
├── 📁 components/
│   ├── 📁 charts/            # 图表组件
│   │   ├── EnergyChart.tsx   # 能耗图表
│   │   └── TrendChart.tsx    # 环境趋势图表
│   ├── 📁 greenhouse/        # 3D 场景组件
│   │   ├── Greenhouse3D.tsx  # 3D Canvas 容器
│   │   └── GreenhouseScene.tsx # 3D 场景对象（核心）
│   ├── 📁 layout/            # 布局组件
│   │   ├── MetricStrip.tsx   # 关键指标条
│   │   ├── ModuleNavigationBar.tsx # 模块导航栏
│   │   └── TopBar.tsx        # 顶部信息栏
│   ├── 📁 panels/            # 面板组件
│   │   ├── AIAdvicePanel.tsx           # AI 建议面板
│   │   ├── AlarmCenterPanel.tsx        # 告警中心
│   │   ├── DeviceControlPanel.tsx      # 设备控制
│   │   ├── EnergyDashboardPanel.tsx    # 能源管理
│   │   ├── EnvironmentMonitorPanel.tsx # 环境监测
│   │   ├── EnvironmentTrendPanel.tsx   # 环境趋势
│   │   ├── InfoPanel.tsx               # 对象详情面板
│   │   ├── LayerControlPanel.tsx       # 图层控制
│   │   ├── ModulePanel.tsx             # 模块面板容器
│   │   └── StrawberryRowsPanel.tsx     # 草莓排管理
│   └── RealtimeMockEngine.tsx          # 实时 Mock 数据引擎
├── 📁 data/
│   └── mockData.ts           # 所有 Mock 数据
├── 📁 store/
│   └── useAppStore.ts        # Zustand 全局状态管理
├── 📁 types/
│   └── index.ts              # TypeScript 类型定义
├── 📁 utils/
│   └── format.ts             # 工具函数
├── App.tsx                   # 主应用组件
├── main.tsx                  # 应用入口
└── index.css                 # 全局样式（Tailwind + 自定义）
```

## 🚀 快速开始

### 环境要求
- Node.js >= 18
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 `http://localhost:5173` 查看效果（支持局域网访问）。

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 📋 功能模块

### 1. 首页驾驶舱
- 全局态势概览
- 核心指标实时展示
- 24 小时环境趋势
- AI 建议摘要

### 2. 三维大棚总览
- 3D 场景交互操作
- 图层开关控制（人员、传感器、设备、能源、草莓排、告警、热力图）
- 对象点击查看详情

### 3. 草莓分排管理
- 8 个草莓排状态监控
- 品种、生长阶段、株数信息
- 环境数据与阈值对比
- 健康评分与趋势分析

### 4. 环境监测中心
- 8 项环境指标实时卡片
- 传感器点位状态
- 环境趋势图表
- 异常预警提示

### 5. 设备监测与控制
- 设备在线率与运行状态
- 实时功率统计
- 开关控制、模式切换
- 目标值/阈值调节
- 联动规则展示

### 6. 能源管理
- 太阳能发电监测
- 风力发电监测
- 储能电池状态（SOC、SOH）
- 能耗分布分析
- 节能建议

### 7. 人员与任务
- 实时人员定位
- 角色与任务状态
- AGV 采摘小车路径

### 8. 告警中心
- 告警列表与筛选
- 告警详情与处理
- 3D 场景联动定位

### 9. 参数设置（预留）
- 阈值策略配置
- 接口预留（MQTT/WebSocket）
- 联动规则管理

## 🎨 设计风格

- **暗色主题**: 深色背景 + 霓虹绿光效果，科技感十足
- **玻璃拟态**: Glassmorphism 面板设计，半透明模糊效果
- **状态色彩**:
  - 🟢 绿色 (#70f2a1) - 正常状态
  - 🟡 黄色 (#f5ce5b) - 预警状态
  - 🔴 红色 (#ff4e72) - 严重/告警状态
  - 🔵 蓝色 (#51d6ff) - 信息/离线状态

## 🔧 状态管理

项目使用 Zustand 进行全局状态管理，核心状态包括：

```typescript
- activeModule: 当前激活的功能模块
- selectedTarget: 当前选中的对象（用于详情面板）
- layers: 3D 图层开关状态
- liveEnvironment: 实时环境数据
- liveRows: 实时草莓排数据
- liveSensors: 实时传感器数据
- liveDevices: 实时设备数据
- liveEnergySummary: 实时能源数据
- liveTrend: 实时趋势数据
- deviceOverrides: 设备控制覆盖值
- resolvedAlarms: 已处理告警
```

### 实时数据模拟

`RealtimeMockEngine` 组件每 2.4 秒触发一次数据更新，通过正弦波和随机扰动模拟真实数据变化：

- 温度波动范围: 18-30°C
- 湿度波动范围: 50-86%RH
- 光照强度: 22,000-47,000 lux
- 设备状态根据环境数据自动判断

## 📝 数据模型

项目包含完整的 TypeScript 类型定义，涵盖：

- `StrawberryRow`: 草莓排信息
- `SensorPoint`: 传感器点位
- `ControlDevice`: 控制设备
- `EnergyDevice`: 能源设备
- `Personnel`: 人员信息
- `HarvestVehicle`: 采摘小车
- `Alarm`: 告警信息
- `EnvironmentSnapshot`: 环境快照
- `TrendPoint`: 趋势数据点

## 🔌 后续扩展

项目已为以下功能预留接口：

- **MQTT 接入**: 替换 mock 数据，订阅真实传感器状态
- **WebSocket 实时推送**: 设备控制指令下发
- **数据库集成**: 历史数据存储与查询
- **用户认证**: 多角色权限管理
- **告警推送**: 邮件/短信/微信通知
- **数据导出**: CSV/PDF 报表生成

## 📄 License

本项目仅供学习和演示使用。

## 👨‍💻 开发团队

由 AI 驱动开发，基于现代化 Web 技术栈构建。

---

**🌐 访问在线预览**: [GitHub Pages 链接]

**📧 联系我们**: [联系方式]
