# 🍓 莓莓与共——草莓大棚数字孪生交互操作平台

> 基于 React + Three.js + TypeScript 构建的现代化数字孪生农业管理平台

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![Three.js](https://img.shields.io/badge/Three.js-0.171.0-000000)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178c6)
![Vite](https://img.shields.io/badge/Vite-6.0.6-646cff)
![License](https://img.shields.io/badge/license-MIT-green)

## 📖 项目简介

"莓莓与共"是一个面向智慧农业的**草莓大棚数字孪生交互操作平台**，通过 3D 可视化、实时数据监控和智能设备控制，为现代温室大棚提供全方位的数字化管理解决方案。

本项目采用 **Mock 数据驱动**，内置完整的实时模拟引擎，适合用于：
- 🎯 路演展示与产品原型验证
- 🎓 数字农业技术教学演示
- 💡 数字孪生概念验证（PoC）
- 🛠️ 农业物联网系统前端框架参考

## ✨ 核心特性

### 🎮 3D 数字孪生场景
- 基于 **Three.js** 和 **@react-three/fiber** 构建真实感 3D 温室场景
- 支持鼠标拖拽旋转、滚轮缩放、右键平移等交互操作
- 实时展示大棚结构（拱形骨架、透明外壳）、草莓排、传感器、设备、人员、AGV 小车等对象
- 脉冲动画标记、状态标签、粒子特效、环境热力图等视觉效果

### 📊 多维度数据监控
- **环境监测**: 温度、湿度、光照、CO₂、风速、辐射强度、热舒适指数等 8 项核心指标
- **传感器状态**: 实时数值、状态预警（正常/预警/严重/离线）、阈值范围展示
- **能耗管理**: 太阳能发电、风力发电、储能电池（SOC/SOH）、实时功率、能耗分布
- **趋势图表**: 基于 Recharts 的 24 小时环境数据趋势可视化

### 🔧 智能设备控制
- 支持 **7 种设备类型**: 除湿器、加湿器、灌溉阀、补光灯、循环风机、降温空调、土壤加热器
- 自动/手动模式无缝切换
- 模拟开关控制、目标值/上下限滑块调节
- **联动规则引擎**: 根据环境数据自动判断设备启停状态
- 设备在线率、运行数量、实时功率统计

### 🤖 AI 种植建议
- 设备联动建议（如：联动补水 8 分钟、除湿器切换中档等）
- AI 种植策略推荐（如：灰霉病风险预警、CO₂ 供给策略、采摘窗口预测等）

### 👥 人员与任务管理
- 实时人员定位（巡检人员、采摘人员、维修人员）
- 机械臂草莓采摘小车 AGV 路径展示与 SLAM 定位信息
- 任务状态跟踪与角色管理

### 🚨 告警中心
- 多维度告警类型：温度异常、湿度异常、土壤湿度异常、光照异常、设备离线、能耗异常、人员安全异常
- 四级告警级别：普通、一般、严重、紧急
- 3D 场景告警标记与交互处理（支持标记已处理）

## 🏗️ 技术架构

### 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **React** | 18.3.1 | UI 框架与组件化开发 |
| **TypeScript** | 5.7.2 | 类型安全与代码提示 |
| **Three.js** | 0.171.0 | 3D 渲染引擎 |
| **@react-three/fiber** | 8.17.10 | React 集成 Three.js |
| **@react-three/drei** | 9.122.0 | Three.js 实用工具集（Environment、OrbitControls、Html 等） |
| **Zustand** | 5.0.2 | 轻量级全局状态管理 |
| **Recharts** | 2.15.0 | 数据可视化图表 |
| **Lucide React** | 0.468.0 | 现代化图标库 |
| **Tailwind CSS** | 3.4.17 | 原子化 CSS 样式 |
| **Vite** | 6.0.6 | 极速开发与构建工具 |

### 项目结构

```
📁 莓莓与共-草莓大棚数字孪生交互操作平台/
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 charts/              # 图表组件
│   │   │   ├── EnergyChart.tsx     # 能耗分布图表
│   │   │   └── TrendChart.tsx      # 环境趋势折线图
│   │   ├── 📁 greenhouse/          # 3D 场景组件
│   │   │   ├── Greenhouse3D.tsx    # 3D Canvas 容器与配置
│   │   │   └── GreenhouseScene.tsx # 3D 场景核心渲染逻辑
│   │   ├── 📁 layout/              # 布局组件
│   │   │   ├── MetricStrip.tsx     # 底部关键指标条
│   │   │   ├── ModuleNavigationBar.tsx # 顶部模块导航栏
│   │   │   └── TopBar.tsx          # 顶部系统信息栏
│   │   ├── 📁 panels/              # 功能面板组件
│   │   │   ├── AIAdvicePanel.tsx           # AI 种植建议面板
│   │   │   ├── AlarmCenterPanel.tsx        # 告警中心面板
│   │   │   ├── DeviceControlPanel.tsx      # 设备控制面板
│   │   │   ├── EnergyDashboardPanel.tsx    # 能源管理面板
│   │   │   ├── EnvironmentMonitorPanel.tsx # 环境监测面板
│   │   │   ├── EnvironmentTrendPanel.tsx   # 环境趋势面板
│   │   │   ├── InfoPanel.tsx               # 对象详情面板（核心交互）
│   │   │   ├── LayerControlPanel.tsx       # 3D 图层控制面板
│   │   │   ├── ModulePanel.tsx             # 模块面板容器
│   │   │   └── StrawberryRowsPanel.tsx     # 草莓排管理面板
│   │   └── RealtimeMockEngine.tsx          # 实时 Mock 数据引擎
│   ├── 📁 data/
│   │   └── mockData.ts             # 全量 Mock 数据定义
│   ├── 📁 store/
│   │   └── useAppStore.ts          # Zustand 全局状态管理
│   ├── 📁 types/
│   │   └── index.ts                # TypeScript 类型定义
│   ├── 📁 utils/
│   │   └── format.ts               # 工具函数（状态样式、类名合并）
│   ├── App.tsx                     # 主应用组件（布局编排）
│   ├── main.tsx                    # 应用入口
│   ├── index.css                   # 全局样式（Tailwind + 自定义主题）
│   └── vite-env.d.ts               # Vite 类型声明
├── 📁 public/                      # 静态资源
├── index.html                      # HTML 入口
├── package.json                    # 项目依赖与脚本
├── vite.config.ts                  # Vite 构建配置
├── tailwind.config.ts              # Tailwind CSS 配置
├── postcss.config.js               # PostCSS 配置
├── tsconfig.json                   # TypeScript 根配置
├── tsconfig.app.json               # 应用 TypeScript 配置
└── tsconfig.node.json              # Node TypeScript 配置
```

## 📐 架构设计

### 三栏式布局
项目采用**三栏式响应式布局**：

```
┌─────────────────────────────────────────────────────────────────┐
│                         TopBar (顶部信息栏)                       │
├─────────────────────────────────────────────────────────────────┤
│                   ModuleNavigationBar (模块导航)                  │
├──────────────┬──────────────────────────────┬───────────────────┤
│              │                              │                   │
│  InfoPanel   │     Greenhouse3D (3D场景)     │   ModulePanel     │
│  (对象详情)  │                              │   (功能面板)       │
│   320px      ├──────────────────────────────┤    366px          │
│              │    MetricStrip (指标条)       │                   │
│              │                              │                   │
└──────────────┴──────────────────────────────┴───────────────────┘
```

### 数据流架构

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Mock 数据   │────▶│  Zustand     │────▶│  UI 组件     │
│  mockData.ts │     │  useAppStore │     │  Components  │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │ RealtimeMock │
                     │   Engine     │
                     │ (2.4s 刷新)  │
                     └──────────────┘
```

## 🔧 状态管理

项目使用 **Zustand** 进行全局状态管理，状态定义清晰、操作简洁：

### 核心状态

```typescript
type AppStore = {
  // UI 状态
  activeModule: ModuleKey;              // 当前激活的功能模块
  selectedTarget: SelectedTarget;       // 当前选中的 3D 对象
  layers: Record<LayerKey, boolean>;    // 3D 图层开关状态
  
  // 实时数据
  liveEnvironment: EnvironmentSnapshot; // 实时环境数据
  liveRows: StrawberryRow[];            // 实时草莓排数据
  liveSensors: SensorPoint[];           // 实时传感器数据
  liveDevices: ControlDevice[];         // 实时设备数据
  liveEnergySummary: EnergySummary;     // 实时能源汇总
  liveTrend: TrendPoint[];              // 实时趋势数据
  liveUpdatedAt: string;                // 最后更新时间
  
  // 交互状态
  deviceOverrides: Record<string, Partial<ControlDevice>>; // 设备控制覆盖值
  resolvedAlarms: Record<string, boolean>;                 // 已处理告警
}
```

### 核心操作

```typescript
setActiveModule(module: ModuleKey)      // 切换功能模块
selectTarget(target: SelectedTarget)    // 选中 3D 对象
toggleLayer(layer: LayerKey)            // 切换图层开关
tickRealtime()                          // 触发实时数据更新
updateDevice(id, patch)                 // 更新设备状态
resolveAlarm(id)                        // 标记告警已处理
```

### 实时模拟引擎

`RealtimeMockEngine` 组件每 **2.4 秒** 触发一次数据更新，通过以下机制模拟真实数据：

```typescript
tickRealtime() {
  // 1. 正弦波模拟周期性变化
  const wave = Math.sin(sequence / 5);
  
  // 2. 环境数据波动（带边界限制）
  temperature: clamp(24.4 + wave * 1.1 + jitter(0.4), 18, 30)
  
  // 3. 设备状态根据环境数据自动判断
  autoEnabled: {
    dehumidifier: env.airHumidity > device.upperLimit,
    humidifier: env.airHumidity < device.lowerLimit,
    irrigationValve: env.soilHumidity < device.lowerLimit,
    // ...
  }
  
  // 4. 草莓排健康评分动态计算
  healthScore: clamp(score + jitter(1.2) - (abnormal ? 0.4 : -0.2), 62, 98)
}
```

## 📋 功能模块详解

### 1. 首页驾驶舱 (`dashboard`)
- 全局态势概览（温度、湿度、土壤、CO₂、在线人员、活跃告警、今日能耗、草莓健康）
- 24 小时环境趋势图表
- AI 建议摘要

### 2. 三维大棚总览 (`greenhouse`)
- 3D 场景交互操作指南
- 7 个图层开关控制（人员、传感器、设备、能源、草莓排、告警、热力图）
- 点击 3D 对象查看详情

### 3. 草莓分排管理 (`strawberryRows`)
- 8 个草莓排状态监控（品种、生长阶段、株数、健康评分）
- 环境数据与阈值对比分析
- 健康评分趋势图表
- 设备联动建议与 AI 种植建议

### 4. 环境监测中心 (`environment`)
- 8 项环境指标实时卡片（带状态标识）
- 传感器点位状态列表
- 环境趋势图表
- 异常预警提示

### 5. 设备监测与控制 (`devices`)
- 设备在线率、运行数量、实时功率统计
- 设备开关控制（ON/OFF）
- 自动/手动模式切换
- 目标值/下限/上限滑块调节
- 联动规则展示

### 6. 能源管理 (`energy`)
- 太阳能发电、风力发电实时数据
- 储能电池状态（SOC 电量、SOH 健康度）
- 能耗分布分析（照明、制冷、风机、灌溉、除湿、传感器网关）
- 节能优化建议

### 7. 人员与任务 (`personnel`)
- 实时人员定位与角色展示
- 任务状态跟踪
- AGV 采摘小车路径规划与 SLAM 定位信息

### 8. 告警中心 (`alarms`)
- 告警列表与筛选
- 告警详情（级别、类型、位置、当前值、阈值、发生时间）
- 标记告警已处理
- 3D 场景联动定位

### 9. 参数设置 (`settings`)
- 阈值策略说明（温度、湿度、光照、CO₂ 上下限）
- 接口接入预留（MQTT/WebSocket）
- 联动规则说明

## 🎨 设计风格

### 暗色主题
- 深色背景 (`#031111`) + 霓虹绿光效果，科技感十足
- 径向渐变与线性渐变叠加的背景设计

### 玻璃拟态 (Glassmorphism)
```css
.glass-panel {
  @apply border border-leaf-300/20 bg-field-900/70 shadow-panel backdrop-blur-xl;
}
```

### 自定义配色系统

| 色彩名称 | 色值 | 用途 |
|---------|------|------|
| `leaf-300` | `#70f2a1` | 正常状态、主色调 |
| `pollen-400` | `#f5ce5b` | 预警状态 |
| `berry-400` | `#ff4e72` | 严重/告警状态 |
| `skytech-400` | `#51d6ff` | 信息/离线状态 |
| `field-900` | `#0a151b` | 背景深色 |
| `field-950` | `#031111` | 背景最深色 |

### 状态标识系统

```typescript
const statusClass = {
  normal:   'text-leaf-300 bg-leaf-500/10 border-leaf-400/30',    // 正常
  warning:  'text-pollen-400 bg-pollen-400/10 border-pollen-400/30', // 预警
  critical: 'text-berry-400 bg-berry-500/10 border-berry-400/40',   // 严重
  offline:  'text-slate-300 bg-slate-500/10 border-slate-400/20'    // 离线
}
```

## 📝 数据模型

项目包含完整的 TypeScript 类型定义：

### 核心类型

```typescript
// 模块类型
type ModuleKey = 'dashboard' | 'greenhouse' | 'strawberryRows' | 'environment' 
               | 'devices' | 'energy' | 'personnel' | 'alarms' | 'settings';

// 图层类型
type LayerKey = 'personnel' | 'sensors' | 'devices' | 'energy' | 'rows' | 'alarms' | 'heatmap';

// 对象分类
type ObjectCategory = 'greenhouse' | 'row' | 'sensor' | 'device' | 'energy' | 'personnel' | 'vehicle' | 'alarm';

// 状态级别
type StatusLevel = 'normal' | 'warning' | 'critical' | 'offline';
```

### 数据实体

```typescript
// 草莓排
interface StrawberryRow {
  id: string;           // 排 ID
  code: string;         // 排编号 (R-01, R-02...)
  variety: string;      // 品种 (红颜、章姬、妙香7号...)
  plantedAt: string;    // 种植日期
  growthStage: string;  // 生长阶段 (开花期、膨果期、转色期、成熟采摘期)
  plantCount: number;   // 株数
  position: Vector3Tuple; // 3D 位置
  env: EnvironmentSnapshot; // 环境数据
  bounds: MetricBounds;     // 阈值范围
  abnormal: boolean;        // 是否异常
  healthScore: number;      // 健康评分
  deviceAdvice: string[];   // 设备联动建议
  aiAdvice: string[];       // AI 种植建议
  trend: TrendPoint[];      // 趋势数据
}

// 控制设备
interface ControlDevice {
  id: string;           // 设备 ID
  name: string;         // 设备名称
  type: DeviceType;     // 设备类型
  position: Vector3Tuple; // 3D 位置
  online: boolean;      // 是否在线
  enabled: boolean;     // 是否开启
  mode: DeviceMode;     // 自动/手动
  power: number;        // 实时功率 (kW)
  targetValue: number;  // 目标值
  lowerLimit: number;   // 下限
  upperLimit: number;   // 上限
  unit: string;         // 单位
  linkedRule: string;   // 联动规则描述
  status: StatusLevel;  // 状态
}

// 传感器
interface SensorPoint {
  id: string;
  name: string;
  type: SensorType;     // airHumidity | soilHumidity | light | temperature | co2
  position: Vector3Tuple;
  value: number;
  unit: string;
  min: number;          // 下限
  max: number;          // 上限
  status: StatusLevel;
}

// 告警
interface Alarm {
  id: string;
  level: AlarmLevel;    // 普通 | 一般 | 严重 | 紧急
  type: AlarmType;      // 温度异常 | 湿度异常 | ...
  target: string;       // 告警目标
  location: string;     // 告警位置
  currentValue: string; // 当前值
  threshold: string;    // 阈值范围
  occurredAt: string;   // 发生时间
  handled: boolean;     // 是否已处理
  position: Vector3Tuple; // 3D 位置
}
```

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.0
- **npm** >= 9.0 或 **yarn** >= 1.22

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173` 查看效果（默认配置 `--host 0.0.0.0` 支持局域网访问）。

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

### 预览生产版本

```bash
npm run preview
```

## ⚙️ 配置说明

### Vite 配置

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // 允许局域网访问
  },
})
```

### Tailwind CSS 配置

```typescript
// tailwind.config.ts
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'leaf': { /* 绿色系 */ },
        'pollen': { /* 黄色系 */ },
        'berry': { /* 红色系 */ },
        'skytech': { /* 蓝色系 */ },
        'field': { /* 背景色系 */ },
      },
      boxShadow: {
        glow: '0 0 20px rgba(112, 242, 161, 0.15)',
        panel: '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(112, 242, 161, 0.05) 1px, transparent 1px), ...',
      },
    },
  },
  plugins: [],
}
```

## 📊 数据接入指南

### Mock 数据替换

当前项目使用 `src/data/mockData.ts` 提供全量 Mock 数据。如需接入真实数据，可按以下步骤操作：

1. **创建 API 服务层**
   ```typescript
   // src/services/api.ts
   export const getEnvironmentData = () => fetch('/api/environment').then(res => res.json());
   export const getDeviceData = () => fetch('/api/devices').then(res => res.json());
   ```

2. **修改 Zustand Store**
   ```typescript
   // src/store/useAppStore.ts
   import { getEnvironmentData } from '../services/api';
   
   // 替换 tickRealtime 中的 mock 逻辑
   tickRealtime: async () => {
     const data = await getEnvironmentData();
     set({ liveEnvironment: data });
   }
   ```

3. **接入 MQTT/WebSocket**（推荐用于实时数据）
   ```typescript
   // src/services/mqtt.ts
   import mqtt from 'mqtt';
   
   const client = mqtt.connect('ws://your-mqtt-broker:8083');
   client.subscribe('greenhouse/+/sensor');
   client.on('message', (topic, message) => {
     // 更新 Zustand Store
   });
   ```

### 实时数据接口预留

| 接口类型 | 用途 | 预留状态 |
|---------|------|---------|
| MQTT | 传感器数据订阅、设备状态推送 | ✅ 预留 |
| WebSocket | 实时数据推送、控制指令下发 | ✅ 预留 |
| REST API | 历史数据查询、配置管理 | ✅ 预留 |
| LoRa | 传感器数据采集（边缘侧） | ✅ 预留 |

## 🔌 后续扩展

项目已为以下功能预留接口：

- **MQTT 接入**: 替换 mock 数据，订阅真实传感器状态
- **WebSocket 实时推送**: 设备控制指令下发与状态同步
- **数据库集成**: 历史数据存储与查询（InfluxDB/TimescaleDB 时序数据库）
- **用户认证**: JWT 认证、多角色权限管理（管理员、操作员、访客）
- **告警推送**: 邮件、短信、企业微信/钉钉通知
- **数据导出**: CSV/PDF 报表生成与下载
- **3D 模型优化**: 替换基础几何体为真实 3D 模型（GLTF/GLB）
- **地图集成**: 接入高德/百度地图显示大棚地理位置
- **视频流**: 接入大棚内摄像头实时监控画面

## 🐛 常见问题

### 1. 启动时报错 `Cannot find module`
确保已执行 `npm install` 安装所有依赖。

### 2. 3D 场景不显示
- 检查浏览器是否支持 WebGL
- 打开浏览器控制台查看是否有 Three.js 相关错误

### 3. 数据不刷新
- 检查 `RealtimeMockEngine` 组件是否正常加载
- 打开浏览器控制台查看是否有 Zustand Store 相关错误

### 4. 样式异常
- 确保 Tailwind CSS 已正确配置
- 检查 `postcss.config.js` 是否包含 `tailwindcss` 插件

## 📄 License

本项目仅供学习和演示使用。

## 👨‍💻 开发团队

由 AI 驱动开发，基于现代化 Web 技术栈构建。

---

**🌐 在线演示**: 暂无

**📧 联系方式**: 15234240469
