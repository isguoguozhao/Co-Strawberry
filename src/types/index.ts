export type Vector3Tuple = [number, number, number];

export type ModuleKey =
  | 'dashboard'
  | 'greenhouse'
  | 'strawberryRows'
  | 'environment'
  | 'devices'
  | 'energy'
  | 'personnel'
  | 'alarms'
  | 'settings';

export type LayerKey =
  | 'personnel'
  | 'sensors'
  | 'devices'
  | 'energy'
  | 'rows'
  | 'alarms'
  | 'heatmap';

export type ObjectCategory =
  | 'greenhouse'
  | 'row'
  | 'sensor'
  | 'device'
  | 'energy'
  | 'personnel'
  | 'vehicle'
  | 'alarm';

export type SelectedTarget = {
  category: ObjectCategory;
  id: string;
};

export type StatusLevel = 'normal' | 'warning' | 'critical' | 'offline';

export type EnvironmentSnapshot = {
  temperature: number;
  airHumidity: number;
  soilHumidity: number;
  light: number;
  co2: number;
  windSpeed: number;
  radiation: number;
  comfortIndex: number;
};

export type MetricCard = {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  trend: 'up' | 'down' | 'flat';
  tone: 'green' | 'cyan' | 'amber' | 'red';
};

export type TrendPoint = {
  time: string;
  temperature: number;
  airHumidity: number;
  soilHumidity: number;
  light: number;
  co2: number;
  energy: number;
};

export type MetricBounds = {
  temperature: [number, number];
  airHumidity: [number, number];
  soilHumidity: [number, number];
  light: [number, number];
  co2: [number, number];
};

export type StrawberryRow = {
  id: string;
  code: string;
  variety: string;
  plantedAt: string;
  growthStage: string;
  plantCount: number;
  position: Vector3Tuple;
  env: Pick<
    EnvironmentSnapshot,
    'temperature' | 'airHumidity' | 'soilHumidity' | 'light' | 'co2'
  >;
  bounds: MetricBounds;
  abnormal: boolean;
  healthScore: number;
  deviceAdvice: string[];
  aiAdvice: string[];
  trend: TrendPoint[];
};

export type SensorType =
  | 'airHumidity'
  | 'soilHumidity'
  | 'light'
  | 'temperature'
  | 'co2';

export type SensorPoint = {
  id: string;
  name: string;
  type: SensorType;
  position: Vector3Tuple;
  value: number;
  unit: string;
  min: number;
  max: number;
  status: StatusLevel;
};

export type DeviceType =
  | 'dehumidifier'
  | 'humidifier'
  | 'irrigationValve'
  | 'growLight'
  | 'fan'
  | 'coolingAc'
  | 'soilHeater';

export type DeviceMode = 'auto' | 'manual';

export type ControlDevice = {
  id: string;
  name: string;
  type: DeviceType;
  position: Vector3Tuple;
  online: boolean;
  enabled: boolean;
  mode: DeviceMode;
  power: number;
  targetValue: number;
  lowerLimit: number;
  upperLimit: number;
  unit: string;
  linkedRule: string;
  status: StatusLevel;
};

export type EnergyDeviceType = 'solar' | 'wind' | 'battery' | 'ems';

export type EnergyDevice = {
  id: string;
  name: string;
  type: EnergyDeviceType;
  position: Vector3Tuple;
  generationKw: number;
  storagePercent?: number;
  todayEnergyKwh: number;
  status: StatusLevel;
};

export type Personnel = {
  id: string;
  name: string;
  role: '巡检人员' | '采摘人员' | '维修人员';
  positionName: string;
  position: Vector3Tuple;
  taskStatus: string;
  online: boolean;
};

export type HarvestVehicle = {
  id: string;
  name: string;
  position: Vector3Tuple;
  route: Vector3Tuple[];
  slamStatus: string;
  pathPlan: string;
  recognitionAccuracy: number;
  pickingEfficiency: number;
  armStatus: string;
};

export type AlarmLevel = '普通' | '一般' | '严重' | '紧急';

export type AlarmType =
  | '温度异常'
  | '湿度异常'
  | '土壤湿度异常'
  | '光照异常'
  | '设备离线'
  | '能耗异常'
  | '人员安全异常';

export type Alarm = {
  id: string;
  level: AlarmLevel;
  type: AlarmType;
  target: string;
  targetId?: string;
  targetCategory?: ObjectCategory;
  location: string;
  currentValue: string;
  threshold: string;
  occurredAt: string;
  handled: boolean;
  position: Vector3Tuple;
};

export type GreenhouseInfo = {
  id: string;
  name: string;
  builtAt: string;
  area: string;
  structure: string;
  rows: number;
  gateway: string;
  network: string;
  description: string;
};

export type EnergySummary = {
  todayConsumption: number;
  realTimePower: number;
  lighting: number;
  cooling: number;
  fan: number;
  irrigation: number;
  dehumidify: number;
  sensorGateway: number;
  solarGeneration: number;
  windGeneration: number;
  batterySoc: number;
  batterySoh: number;
  suggestions: string[];
};
