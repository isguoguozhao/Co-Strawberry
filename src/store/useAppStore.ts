import { create } from 'zustand';
import {
  controlDevices,
  currentEnvironment,
  energySummary,
  sensors,
  strawberryRows,
  trend24h
} from '../data/mockData';
import type {
  ControlDevice,
  EnergySummary,
  EnvironmentSnapshot,
  LayerKey,
  ModuleKey,
  SelectedTarget,
  SensorPoint,
  StatusLevel,
  StrawberryRow,
  TrendPoint
} from '../types';

type LayerState = Record<LayerKey, boolean>;

type AppStore = {
  activeModule: ModuleKey;
  selectedTarget: SelectedTarget;
  layers: LayerState;
  liveEnvironment: EnvironmentSnapshot;
  liveRows: StrawberryRow[];
  liveSensors: SensorPoint[];
  liveDevices: ControlDevice[];
  liveEnergySummary: EnergySummary;
  liveTrend: TrendPoint[];
  liveUpdatedAt: string;
  liveSequence: number;
  deviceOverrides: Record<string, Partial<ControlDevice>>;
  resolvedAlarms: Record<string, boolean>;
  setActiveModule: (module: ModuleKey) => void;
  selectTarget: (target: SelectedTarget) => void;
  toggleLayer: (layer: LayerKey) => void;
  setLayers: (patch: Partial<LayerState>) => void;
  tickRealtime: () => void;
  updateDevice: (id: string, patch: Partial<ControlDevice>) => void;
  resolveAlarm: (id: string) => void;
};

const cloneRows = () =>
  strawberryRows.map((row) => ({
    ...row,
    env: { ...row.env },
    bounds: { ...row.bounds },
    deviceAdvice: [...row.deviceAdvice],
    aiAdvice: [...row.aiAdvice],
    trend: row.trend.map((point) => ({ ...point }))
  }));

const cloneSensors = () => sensors.map((sensor) => ({ ...sensor }));
const cloneDevices = () => controlDevices.map((device) => ({ ...device }));

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, digits = 1) {
  return Number(value.toFixed(digits));
}

function jitter(range: number) {
  return (Math.random() - 0.5) * range;
}

function statusByRange(value: number, min: number, max: number): StatusLevel {
  if (value < min || value > max) {
    return 'warning';
  }
  const near = (max - min) * 0.08;
  if (value < min + near || value > max - near) {
    return 'warning';
  }
  return 'normal';
}

function sensorValueFromEnvironment(sensor: SensorPoint, env: EnvironmentSnapshot) {
  const valueMap: Record<SensorPoint['type'], number> = {
    airHumidity: env.airHumidity + jitter(2.2),
    soilHumidity: env.soilHumidity + jitter(2),
    light: env.light + jitter(900),
    temperature: env.temperature + jitter(0.6),
    co2: env.co2 + jitter(18)
  };

  return sensor.type === 'light' || sensor.type === 'co2'
    ? Math.round(valueMap[sensor.type])
    : round(valueMap[sensor.type]);
}

function nextDeviceState(device: ControlDevice, env: EnvironmentSnapshot): ControlDevice {
  const autoEnabled: Partial<Record<ControlDevice['type'], boolean>> = {
    dehumidifier: env.airHumidity > device.upperLimit,
    humidifier: env.airHumidity < device.lowerLimit,
    irrigationValve: env.soilHumidity < device.lowerLimit,
    growLight: env.light < device.lowerLimit,
    fan: env.temperature > device.upperLimit,
    coolingAc: env.temperature > device.upperLimit + 1,
    soilHeater: env.temperature < device.lowerLimit
  };
  const enabled = device.mode === 'auto' ? Boolean(autoEnabled[device.type]) : device.enabled;
  const power = enabled ? round(device.power * (0.82 + Math.random() * 0.34), 2) : 0;
  const status: StatusLevel = device.online ? (enabled && device.mode === 'auto' ? 'normal' : device.status) : 'offline';

  return {
    ...device,
    enabled,
    power,
    status
  };
}

function rowAbnormal(row: StrawberryRow) {
  return (
    row.env.temperature < row.bounds.temperature[0] ||
    row.env.temperature > row.bounds.temperature[1] ||
    row.env.airHumidity < row.bounds.airHumidity[0] ||
    row.env.airHumidity > row.bounds.airHumidity[1] ||
    row.env.soilHumidity < row.bounds.soilHumidity[0] ||
    row.env.soilHumidity > row.bounds.soilHumidity[1] ||
    row.env.light < row.bounds.light[0] ||
    row.env.light > row.bounds.light[1] ||
    row.env.co2 < row.bounds.co2[0] ||
    row.env.co2 > row.bounds.co2[1]
  );
}

export const useAppStore = create<AppStore>((set) => ({
  activeModule: 'dashboard',
  selectedTarget: { category: 'greenhouse', id: 'greenhouse-main' },
  layers: {
    personnel: true,
    sensors: true,
    devices: true,
    energy: true,
    rows: true,
    alarms: true,
    heatmap: false
  },
  liveEnvironment: currentEnvironment,
  liveRows: cloneRows(),
  liveSensors: cloneSensors(),
  liveDevices: cloneDevices(),
  liveEnergySummary: { ...energySummary, suggestions: [...energySummary.suggestions] },
  liveTrend: trend24h.map((point) => ({ ...point })),
  liveUpdatedAt: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
  liveSequence: 0,
  deviceOverrides: {},
  resolvedAlarms: {},
  setActiveModule: (module) => set({ activeModule: module }),
  selectTarget: (target) => set({ selectedTarget: target }),
  toggleLayer: (layer) =>
    set((state) => ({
      layers: {
        ...state.layers,
        [layer]: !state.layers[layer]
      }
    })),
  setLayers: (patch) =>
    set((state) => ({
      layers: {
        ...state.layers,
        ...patch
      }
    })),
  tickRealtime: () =>
    set((state) => {
      const nextSequence = state.liveSequence + 1;
      const wave = Math.sin(nextSequence / 5);
      const env: EnvironmentSnapshot = {
        temperature: round(clamp(24.4 + wave * 1.1 + jitter(0.4), 18, 30)),
        airHumidity: Math.round(clamp(71 + Math.cos(nextSequence / 4) * 4 + jitter(2), 50, 86)),
        soilHumidity: Math.round(clamp(60 + Math.sin(nextSequence / 6) * 3 + jitter(1.8), 42, 76)),
        light: Math.round(clamp(36800 + Math.sin(nextSequence / 3) * 2500 + jitter(900), 22000, 47000)),
        co2: Math.round(clamp(685 + Math.cos(nextSequence / 7) * 35 + jitter(14), 420, 930)),
        windSpeed: round(clamp(1.5 + Math.sin(nextSequence / 4) * 0.45 + jitter(0.12), 0.4, 3.8)),
        radiation: Math.round(clamp(420 + Math.sin(nextSequence / 3.5) * 46 + jitter(16), 260, 540)),
        comfortIndex: Math.round(clamp(82 - Math.abs(wave) * 5 + jitter(2), 68, 94))
      };

      const rows = state.liveRows.map((row, index) => {
        const nextRow: StrawberryRow = {
          ...row,
          env: {
            temperature: round(clamp(env.temperature + (index - 3) * 0.16 + jitter(0.35), 16, 31)),
            airHumidity: Math.round(clamp(env.airHumidity + (index % 3) * 1.4 + jitter(1.8), 48, 88)),
            soilHumidity: Math.round(clamp(env.soilHumidity - index * 0.7 + jitter(2.4), 38, 78)),
            light: Math.round(clamp(env.light + index * 260 + jitter(800), 21000, 48000)),
            co2: Math.round(clamp(env.co2 + index * 4 + jitter(12), 410, 960))
          }
        };
        const abnormal = rowAbnormal(nextRow);
        return {
          ...nextRow,
          abnormal,
          healthScore: Math.round(clamp(nextRow.healthScore + jitter(1.2) - (abnormal ? 0.4 : -0.2), 62, 98))
        };
      });

      const sensors = state.liveSensors.map((sensor) => {
        const value = sensorValueFromEnvironment(sensor, env);
        return {
          ...sensor,
          value,
          status: statusByRange(value, sensor.min, sensor.max)
        };
      });

      const devices = state.liveDevices.map((device) => {
        const patchedDevice = {
          ...device,
          ...state.deviceOverrides[device.id]
        };
        return nextDeviceState(patchedDevice, env);
      });

      const realTimePower = round(
        devices.reduce((sum, device) => sum + (device.enabled ? device.power : 0), 0) +
          energySummary.sensorGateway,
        1
      );

      return {
        liveSequence: nextSequence,
        liveEnvironment: env,
        liveRows: rows,
        liveSensors: sensors,
        liveDevices: devices,
        liveEnergySummary: {
          ...state.liveEnergySummary,
          realTimePower,
          todayConsumption: round(state.liveEnergySummary.todayConsumption + realTimePower / 1440, 1),
          solarGeneration: round(energySummary.solarGeneration + Math.max(0, Math.sin(nextSequence / 6)) * 1.6, 1),
          windGeneration: round(energySummary.windGeneration + Math.max(0, Math.cos(nextSequence / 5)) * 0.5, 1),
          batterySoc: Math.round(clamp(state.liveEnergySummary.batterySoc + jitter(0.7), 62, 92))
        },
        liveTrend: [
          ...state.liveTrend.slice(-35),
          {
            time: new Date().toLocaleTimeString('zh-CN', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            }),
            temperature: env.temperature,
            airHumidity: env.airHumidity,
            soilHumidity: env.soilHumidity,
            light: env.light,
            co2: env.co2,
            energy: realTimePower
          }
        ],
        liveUpdatedAt: new Date().toLocaleTimeString('zh-CN', { hour12: false })
      };
    }),
  updateDevice: (id, patch) =>
    set((state) => ({
      deviceOverrides: {
        ...state.deviceOverrides,
        [id]: {
          ...state.deviceOverrides[id],
          ...patch
        }
      },
      liveDevices: state.liveDevices.map((device) =>
        device.id === id ? { ...device, ...patch } : device
      )
    })),
  resolveAlarm: (id) =>
    set((state) => ({
      resolvedAlarms: {
        ...state.resolvedAlarms,
        [id]: true
      }
    }))
}));
