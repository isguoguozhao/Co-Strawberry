import type {
  Alarm,
  ControlDevice,
  EnergyDevice,
  EnergySummary,
  EnvironmentSnapshot,
  GreenhouseInfo,
  HarvestVehicle,
  MetricCard,
  Personnel,
  SensorPoint,
  StrawberryRow,
  TrendPoint
} from '../types';

export const greenhouseInfo: GreenhouseInfo = {
  id: 'greenhouse-main',
  name: '莓莓与共 A1 智慧草莓大棚',
  builtAt: '2025-09-18',
  area: '3,200 m²',
  structure: '双层膜拱形温室 + 环境分区控制 + 边缘计算网关',
  rows: 8,
  gateway: 'Edge-GW-A1 / LoRa + 5G 双链路',
  network: 'MQTT 预留、WebSocket 预留、传感器 LoRa 预留',
  description:
    '用于路演展示的草莓大棚数字孪生原型，当前使用 mock 数据驱动三维场景、图层、对象详情和关键指标。'
};

export const currentEnvironment: EnvironmentSnapshot = {
  temperature: 24.8,
  airHumidity: 72,
  soilHumidity: 61,
  light: 36800,
  co2: 685,
  windSpeed: 1.6,
  radiation: 420,
  comfortIndex: 82
};

export const trend24h: TrendPoint[] = Array.from({ length: 24 }, (_, index) => {
  const hour = `${String(index).padStart(2, '0')}:00`;
  const wave = Math.sin((index / 24) * Math.PI * 2);
  const daylight = Math.max(0, Math.sin(((index - 6) / 14) * Math.PI));

  return {
    time: hour,
    temperature: Number((23.5 + wave * 2.8 + daylight * 1.6).toFixed(1)),
    airHumidity: Math.round(70 - wave * 5 + (1 - daylight) * 3),
    soilHumidity: Math.round(59 + Math.sin(index / 4) * 4),
    light: Math.round(8000 + daylight * 38000),
    co2: Math.round(650 + Math.cos(index / 5) * 55),
    energy: Number((18 + daylight * 16 + Math.max(0, wave) * 8).toFixed(1))
  };
});

const rowPositions = [-6.3, -4.5, -2.7, -0.9, 0.9, 2.7, 4.5, 6.3];
const varieties = ['红颜', '章姬', '妙香 7 号', '越秀', '宁玉', '甜查理', '粉玉', '隋珠'];
const stages = ['开花期', '膨果期', '转色期', '成熟采摘期'];

export const strawberryRows: StrawberryRow[] = rowPositions.map((x, index) => {
  const abnormal = index === 2 || index === 6;
  const baseTemperature = 23.8 + index * 0.25;
  const baseSoil = 62 - index;

  return {
    id: `row-${index + 1}`,
    code: `R-${String(index + 1).padStart(2, '0')}`,
    variety: varieties[index],
    plantedAt: `2025-${String(9 + (index % 3)).padStart(2, '0')}-${String(
      10 + index
    ).padStart(2, '0')}`,
    growthStage: stages[index % stages.length],
    plantCount: 128 + index * 6,
    position: [x, 0.35, 0],
    env: {
      temperature: Number((baseTemperature + (abnormal ? 2.4 : 0)).toFixed(1)),
      airHumidity: 69 + index + (abnormal ? 8 : 0),
      soilHumidity: baseSoil - (abnormal ? 8 : 0),
      light: 35200 + index * 900,
      co2: 640 + index * 14
    },
    bounds: {
      temperature: [18, 28],
      airHumidity: [55, 78],
      soilHumidity: [48, 72],
      light: [25000, 45000],
      co2: [450, 900]
    },
    abnormal,
    healthScore: abnormal ? 78 - index : 91 - index,
    deviceAdvice: abnormal
      ? ['联动补水 8 分钟', '除湿器切换中档', '补光灯维持 30% 输出']
      : ['维持自动模式', '保留当前灌溉节律', '夜间降温 1.5°C'],
    aiAdvice: abnormal
      ? ['建议检查滴灌支路压力，土壤湿度低于邻近排 9%。', '花果混合期注意灰霉病风险，优先降低冠层湿度。']
      : ['长势均衡，可保持当前 CO₂ 供给策略。', '采摘窗口预计在 36 小时后进入高峰。'],
    trend: trend24h.map((point) => ({
      ...point,
      temperature: Number((point.temperature + index * 0.16).toFixed(1)),
      soilHumidity: point.soilHumidity - index
    }))
  };
});

export const sensors: SensorPoint[] = [
  {
    id: 'sensor-air-1',
    name: '空气湿度监测器 H-01',
    type: 'airHumidity',
    position: [-5.5, 3.2, -7.5],
    value: 74,
    unit: '%RH',
    min: 55,
    max: 78,
    status: 'normal'
  },
  {
    id: 'sensor-soil-1',
    name: '土壤湿度监测器 S-03',
    type: 'soilHumidity',
    position: [-2.7, 0.9, 4.8],
    value: 46,
    unit: '%',
    min: 48,
    max: 72,
    status: 'warning'
  },
  {
    id: 'sensor-light-1',
    name: '光照传感器 L-02',
    type: 'light',
    position: [2.7, 4.2, -3.8],
    value: 36800,
    unit: 'lux',
    min: 25000,
    max: 45000,
    status: 'normal'
  },
  {
    id: 'sensor-temp-1',
    name: '温度监测器 T-01',
    type: 'temperature',
    position: [5.9, 3.1, 5.2],
    value: 26.9,
    unit: '°C',
    min: 18,
    max: 28,
    status: 'normal'
  },
  {
    id: 'sensor-co2-1',
    name: 'CO₂ 传感器 C-01',
    type: 'co2',
    position: [0, 3.6, 8.2],
    value: 685,
    unit: 'ppm',
    min: 450,
    max: 900,
    status: 'normal'
  }
];

export const controlDevices: ControlDevice[] = [
  {
    id: 'device-dehumidifier-1',
    name: '除湿器 D-01',
    type: 'dehumidifier',
    position: [-7.7, 1.1, -7.8],
    online: true,
    enabled: true,
    mode: 'auto',
    power: 1.8,
    targetValue: 68,
    lowerLimit: 55,
    upperLimit: 78,
    unit: '%RH',
    linkedRule: '空气湿度高于上限，自动开启除湿器。',
    status: 'normal'
  },
  {
    id: 'device-humidifier-1',
    name: '加湿器 M-01',
    type: 'humidifier',
    position: [7.7, 1.1, -7.4],
    online: true,
    enabled: false,
    mode: 'auto',
    power: 0.9,
    targetValue: 66,
    lowerLimit: 55,
    upperLimit: 78,
    unit: '%RH',
    linkedRule: '空气湿度低于下限，自动开启加湿器。',
    status: 'normal'
  },
  {
    id: 'device-irrigation-1',
    name: '灌溉阀 V-03',
    type: 'irrigationValve',
    position: [-3.2, 0.7, 10.3],
    online: true,
    enabled: true,
    mode: 'auto',
    power: 0.25,
    targetValue: 60,
    lowerLimit: 48,
    upperLimit: 72,
    unit: '%',
    linkedRule: '土壤湿度低于下限，自动开启灌溉阀。',
    status: 'warning'
  },
  {
    id: 'device-light-1',
    name: '补光灯 G-01',
    type: 'growLight',
    position: [-1.5, 5.2, -2],
    online: true,
    enabled: true,
    mode: 'auto',
    power: 3.6,
    targetValue: 32000,
    lowerLimit: 25000,
    upperLimit: 45000,
    unit: 'lux',
    linkedRule: '光照低于下限，自动开启补光灯。',
    status: 'normal'
  },
  {
    id: 'device-fan-1',
    name: '循环风机 F-02',
    type: 'fan',
    position: [7.9, 2.3, 2.6],
    online: true,
    enabled: true,
    mode: 'auto',
    power: 1.2,
    targetValue: 25,
    lowerLimit: 18,
    upperLimit: 28,
    unit: '°C',
    linkedRule: '温度高于上限，自动开启风机或降温空调。',
    status: 'normal'
  },
  {
    id: 'device-ac-1',
    name: '降温空调 AC-01',
    type: 'coolingAc',
    position: [-7.9, 2.3, 2.4],
    online: true,
    enabled: false,
    mode: 'auto',
    power: 4.8,
    targetValue: 26,
    lowerLimit: 18,
    upperLimit: 28,
    unit: '°C',
    linkedRule: '温度高于上限，自动开启降温空调。',
    status: 'normal'
  },
  {
    id: 'device-heater-1',
    name: '土壤加热器 HTR-01',
    type: 'soilHeater',
    position: [3.5, 0.45, 9.2],
    online: true,
    enabled: false,
    mode: 'auto',
    power: 1.5,
    targetValue: 19,
    lowerLimit: 16,
    upperLimit: 24,
    unit: '°C',
    linkedRule: '温度低于下限，自动开启土壤加热器。',
    status: 'normal'
  }
];

export const energyDevices: EnergyDevice[] = [
  {
    id: 'energy-solar-1',
    name: '柔性太阳能板 PV-01',
    type: 'solar',
    position: [0, 6.4, -3],
    generationKw: 12.4,
    todayEnergyKwh: 96.3,
    status: 'normal'
  },
  {
    id: 'energy-wind-1',
    name: '微型风力发电机 WT-01',
    type: 'wind',
    position: [9.8, 5.2, 8.5],
    generationKw: 1.6,
    todayEnergyKwh: 11.7,
    status: 'normal'
  },
  {
    id: 'energy-battery-1',
    name: '储能电池 BESS-01',
    type: 'battery',
    position: [-8.8, 1.2, 8.2],
    generationKw: 0,
    storagePercent: 76,
    todayEnergyKwh: 38.6,
    status: 'normal'
  },
  {
    id: 'energy-ems-1',
    name: '能源管理单元 EMS-01',
    type: 'ems',
    position: [-8.8, 1.4, 6.2],
    generationKw: 0,
    storagePercent: 76,
    todayEnergyKwh: 147.2,
    status: 'normal'
  }
];

export const personnels: Personnel[] = [
  {
    id: 'person-inspector-1',
    name: '周雨晴',
    role: '巡检人员',
    positionName: '北侧传感器走廊',
    position: [-6.8, 0.25, -3.2],
    taskStatus: '巡检湿度点位',
    online: true
  },
  {
    id: 'person-picker-1',
    name: '陈嘉禾',
    role: '采摘人员',
    positionName: 'R-04 采摘区',
    position: [-0.6, 0.25, 2.7],
    taskStatus: '采摘成熟果',
    online: true
  },
  {
    id: 'person-maintainer-1',
    name: '李工',
    role: '维修人员',
    positionName: '能源设备间',
    position: [-8.4, 0.25, 7.1],
    taskStatus: '检查储能柜',
    online: true
  }
];

export const harvestVehicle: HarvestVehicle = {
  id: 'vehicle-harvester-1',
  name: '机械臂草莓采摘小车 AGV-01',
  position: [1.3, 0.38, -1.6],
  route: [
    [1.3, 0.08, -10],
    [1.3, 0.08, -4],
    [1.3, 0.08, 2],
    [2.9, 0.08, 5.5],
    [2.9, 0.08, 10]
  ],
  slamStatus: '厘米级定位，置信度 97%',
  pathPlan: '沿主通道巡航，下一目标 R-06',
  recognitionAccuracy: 96.8,
  pickingEfficiency: 142,
  armStatus: '柔性采摘爪待命'
};

export const alarms: Alarm[] = [
  {
    id: 'alarm-1',
    level: '严重',
    type: '土壤湿度异常',
    target: 'R-03 草莓排',
    targetId: 'row-3',
    targetCategory: 'row',
    location: 'R-03 中段',
    currentValue: '46%',
    threshold: '48% - 72%',
    occurredAt: '2026-04-24 21:11',
    handled: false,
    position: [-2.7, 1.2, 4.8]
  },
  {
    id: 'alarm-2',
    level: '一般',
    type: '湿度异常',
    target: '空气湿度监测器 H-01',
    targetId: 'sensor-air-1',
    targetCategory: 'sensor',
    location: '北侧传感器走廊',
    currentValue: '82%RH',
    threshold: '55%RH - 78%RH',
    occurredAt: '2026-04-24 20:56',
    handled: false,
    position: [-5.5, 3.6, -7.5]
  },
  {
    id: 'alarm-3',
    level: '普通',
    type: '能耗异常',
    target: '降温空调 AC-01',
    targetId: 'device-ac-1',
    targetCategory: 'device',
    location: '西侧设备带',
    currentValue: '4.8 kW',
    threshold: '< 4.2 kW',
    occurredAt: '2026-04-24 19:38',
    handled: true,
    position: [-7.9, 2.8, 2.4]
  }
];

export const energySummary: EnergySummary = {
  todayConsumption: 147.2,
  realTimePower: 28.6,
  lighting: 42.8,
  cooling: 31.4,
  fan: 18.6,
  irrigation: 9.5,
  dehumidify: 22.1,
  sensorGateway: 4.8,
  solarGeneration: 96.3,
  windGeneration: 11.7,
  batterySoc: 76,
  batterySoh: 94,
  suggestions: [
    '13:00-16:00 提高太阳能自用比例，补光灯维持低功率。',
    '湿度回落后关闭除湿器高档位，预计节能 7.8 kWh。',
    '夜间低谷电价时段为储能电池补能至 88%。'
  ]
};

export const dashboardMetrics: MetricCard[] = [
  { id: 'temperature', label: '当前温度', value: 24.8, unit: '°C', trend: 'flat', tone: 'green' },
  { id: 'airHumidity', label: '空气湿度', value: 72, unit: '%RH', trend: 'up', tone: 'cyan' },
  { id: 'soilHumidity', label: '土壤湿度', value: 61, unit: '%', trend: 'down', tone: 'amber' },
  { id: 'light', label: '光照强度', value: '36.8k', unit: 'lux', trend: 'up', tone: 'green' },
  { id: 'co2', label: 'CO₂ 浓度', value: 685, unit: 'ppm', trend: 'flat', tone: 'cyan' },
  { id: 'windSpeed', label: '风速', value: 1.6, unit: 'm/s', trend: 'flat', tone: 'green' },
  { id: 'radiation', label: '辐射强度', value: 420, unit: 'W/m²', trend: 'up', tone: 'amber' },
  { id: 'comfort', label: '热舒适指数', value: 82, unit: '', trend: 'up', tone: 'green' },
  { id: 'energy', label: '当前总能耗', value: 28.6, unit: 'kW', trend: 'down', tone: 'amber' },
  { id: 'generation', label: '今日发电量', value: 108, unit: 'kWh', trend: 'up', tone: 'green' },
  { id: 'personnel', label: '在线人员', value: 3, unit: '人', trend: 'flat', tone: 'cyan' },
  { id: 'alarms', label: '当前告警', value: 2, unit: '条', trend: 'down', tone: 'red' },
  { id: 'onlineRate', label: '设备在线率', value: 98.6, unit: '%', trend: 'flat', tone: 'green' },
  { id: 'health', label: '草莓健康评分', value: 88, unit: '分', trend: 'up', tone: 'green' }
];
