import { Html, Line, Sparkles, Text } from '@react-three/drei';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import {
  alarms,
  energyDevices,
  greenhouseInfo,
  harvestVehicle,
  personnels
} from '../../data/mockData';
import { useAppStore } from '../../store/useAppStore';
import { MultiArmHarvesterMesh } from './MultiArmHarvesterMesh';
import type {
  Alarm,
  ControlDevice,
  EnergyDevice,
  Personnel,
  SensorPoint,
  StrawberryRow
} from '../../types';

const sensorColors: Record<SensorPoint['type'], string> = {
  airHumidity: '#51d6ff',
  soilHumidity: '#f5ce5b',
  light: '#fff1a8',
  temperature: '#ff7590',
  co2: '#70f2a1'
};

const deviceColors: Record<ControlDevice['type'], string> = {
  dehumidifier: '#51d6ff',
  humidifier: '#82e4ff',
  irrigationValve: '#54b5ff',
  growLight: '#fff1a8',
  fan: '#a9ffd0',
  coolingAc: '#8fd5ff',
  soilHeater: '#ff9d70'
};

const energyColors: Record<EnergyDevice['type'], string> = {
  solar: '#f5ce5b',
  wind: '#d5f5ff',
  battery: '#70f2a1',
  ems: '#51d6ff'
};

export function GreenhouseScene() {
  const layers = useAppStore((state) => state.layers);
  const liveRows = useAppStore((state) => state.liveRows);
  const liveSensors = useAppStore((state) => state.liveSensors);
  const liveDevices = useAppStore((state) => state.liveDevices);
  const selectTarget = useAppStore((state) => state.selectTarget);
  const resolvedAlarms = useAppStore((state) => state.resolvedAlarms);
  const activeAlarms = alarms.filter((alarm) => !alarm.handled && !resolvedAlarms[alarm.id]);

  const selectGreenhouse = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    selectTarget({ category: 'greenhouse', id: greenhouseInfo.id });
  };

  const selectHarvestVehicle = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    selectTarget({ category: 'vehicle', id: harvestVehicle.id });
  };

  return (
    <group>
      <ambientLight intensity={0.72} />
      <directionalLight position={[8, 12, 8]} intensity={1.7} castShadow />
      <pointLight position={[-9, 6, -8]} intensity={1.2} color="#70f2a1" />
      <pointLight position={[8, 5, 8]} intensity={0.8} color="#51d6ff" />

      <Ground />
      <GreenhouseShell onClick={selectGreenhouse} />
      <GreenhouseSkeleton />
      <Entrance />

      {layers.heatmap ? <HeatmapLayer rows={liveRows} /> : null}
      {layers.rows ? liveRows.map((row) => <StrawberryRowMesh key={row.id} row={row} />) : null}
      {layers.sensors ? liveSensors.map((sensor) => <SensorMarker key={sensor.id} sensor={sensor} />) : null}
      {layers.devices
        ? liveDevices.map((device) => <DeviceMarker key={device.id} device={device} />)
        : null}
      {layers.energy
        ? energyDevices.map((device) => <EnergyMarker key={device.id} device={device} />)
        : null}
      {layers.personnel
        ? personnels.map((person) => <PersonnelMarker key={person.id} person={person} />)
        : null}
      <MultiArmHarvesterMesh vehicle={harvestVehicle} onSelect={selectHarvestVehicle} />
      {layers.alarms ? activeAlarms.map((alarm) => <AlarmMarker key={alarm.id} alarm={alarm} />) : null}

      <Sparkles
        count={70}
        scale={[17, 4, 24]}
        size={1.2}
        speed={0.18}
        position={[0, 4.6, 0]}
        color="#70f2a1"
      />
      <Text
        position={[0, 0.05, -12.2]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.42}
        color="#a9ffd0"
        anchorX="center"
      >
        A1 DIGITAL STRAWBERRY GREENHOUSE
      </Text>
    </group>
  );
}

function Ground() {
  return (
    <group>
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, -0.04, 0]}>
        <planeGeometry args={[24, 34]} />
        <meshStandardMaterial color="#08221d" roughness={0.86} metalness={0.12} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.002, 0]}>
        <planeGeometry args={[3.1, 25]} />
        <meshStandardMaterial color="#102924" roughness={0.8} />
      </mesh>
      <Line
        points={[
          [-1.55, 0.03, -12.4],
          [-1.55, 0.03, 12.4],
          [1.55, 0.03, 12.4],
          [1.55, 0.03, -12.4],
          [-1.55, 0.03, -12.4]
        ]}
        color="#70f2a1"
        lineWidth={1}
        transparent
        opacity={0.36}
      />
    </group>
  );
}

function GreenhouseShell({ onClick }: { onClick: (event: ThreeEvent<MouseEvent>) => void }) {
  const geometry = useMemo(() => {
    const width = 17;
    const height = 7.2;
    const length = 27;
    const shape = new THREE.Shape();

    shape.moveTo(-width / 2, 0);
    for (let index = 0; index <= 36; index += 1) {
      const angle = Math.PI - (index / 36) * Math.PI;
      shape.lineTo(Math.cos(angle) * (width / 2), Math.sin(angle) * height);
    }
    shape.lineTo(width / 2, 0);
    shape.lineTo(-width / 2, 0);

    const shell = new THREE.ExtrudeGeometry(shape, {
      depth: length,
      bevelEnabled: false,
      steps: 1
    });
    shell.translate(0, 0, -length / 2);
    return shell;
  }, []);

  return (
    <mesh geometry={geometry} onClick={onClick} receiveShadow>
      <meshPhysicalMaterial
        color="#9fffd0"
        transparent
        opacity={0.13}
        roughness={0.18}
        metalness={0.08}
        transmission={0.25}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function GreenhouseSkeleton() {
  const zPositions = [-12, -8, -4, 0, 4, 8, 12];

  return (
    <group>
      {zPositions.map((z) => (
        <ArchHoop key={z} z={z} />
      ))}
      {[-7.9, -4.2, 0, 4.2, 7.9].map((x) => (
        <mesh key={x} position={[x, 0.12, 0]}>
          <boxGeometry args={[0.08, 0.08, 26]} />
          <meshStandardMaterial color="#4fe39a" emissive="#153d2b" />
        </mesh>
      ))}
    </group>
  );
}

function ArchHoop({ z }: { z: number }) {
  const curve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let index = 0; index <= 34; index += 1) {
      const angle = Math.PI - (index / 34) * Math.PI;
      points.push(new THREE.Vector3(Math.cos(angle) * 8.5, Math.sin(angle) * 7.2, z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, [z]);

  return (
    <mesh>
      <tubeGeometry args={[curve, 48, 0.035, 8, false]} />
      <meshStandardMaterial color="#70f2a1" emissive="#0b2f22" />
    </mesh>
  );
}

function Entrance() {
  return (
    <group position={[0, 0, -13.45]}>
      <mesh position={[0, 1.55, 0]}>
        <boxGeometry args={[3.2, 3.1, 0.12]} />
        <meshStandardMaterial color="#0c2722" transparent opacity={0.84} />
      </mesh>
      <mesh position={[0, 1.1, -0.08]}>
        <boxGeometry args={[1.65, 2.2, 0.16]} />
        <meshStandardMaterial color="#133d35" emissive="#09251e" />
      </mesh>
      <Line
        points={[
          [-1.9, 0.06, -0.14],
          [-1.9, 3.35, -0.14],
          [1.9, 3.35, -0.14],
          [1.9, 0.06, -0.14]
        ]}
        color="#70f2a1"
        lineWidth={1.5}
      />
    </group>
  );
}

function StrawberryRowMesh({ row }: { row: StrawberryRow }) {
  const selectTarget = useAppStore((state) => state.selectTarget);
  const color = row.abnormal ? '#f5ce5b' : '#44d17d';
  const plantSlots = Array.from({ length: 16 }, (_, index) => ({
    z: -10.5 + index * 1.4,
    x: index % 2 === 0 ? -0.24 : 0.24,
    abnormal: row.abnormal && index % 5 === 2
  }));

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    selectTarget({ category: 'row', id: row.id });
  };

  return (
    <group position={row.position} onClick={handleClick}>
      <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
        <boxGeometry args={[1.06, 0.34, 23]} />
        <meshStandardMaterial color="#244237" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.36, 0]}>
        <boxGeometry args={[0.86, 0.16, 22.4]} />
        <meshStandardMaterial color="#183b2b" />
      </mesh>
      <mesh position={[-0.42, 0.56, 0]}>
        <boxGeometry args={[0.06, 0.08, 22.6]} />
        <meshStandardMaterial color="#3d5b4b" metalness={0.18} roughness={0.46} />
      </mesh>
      <mesh position={[0.42, 0.56, 0]}>
        <boxGeometry args={[0.06, 0.08, 22.6]} />
        <meshStandardMaterial color="#3d5b4b" metalness={0.18} roughness={0.46} />
      </mesh>
      <Line
        points={[
          [-0.18, 0.68, -11.1],
          [-0.18, 0.68, 11.1]
        ]}
        color="#51d6ff"
        lineWidth={1.2}
        transparent
        opacity={0.5}
      />
      <Line
        points={[
          [0.18, 0.68, -11.1],
          [0.18, 0.68, 11.1]
        ]}
        color="#51d6ff"
        lineWidth={1.2}
        transparent
        opacity={0.42}
      />
      <Line
        points={[
          [-0.55, 0.62, -11.2],
          [-0.55, 0.62, 11.2],
          [0.55, 0.62, 11.2],
          [0.55, 0.62, -11.2],
          [-0.55, 0.62, -11.2]
        ]}
        color={color}
        lineWidth={row.abnormal ? 2 : 1}
        transparent
        opacity={0.82}
      />
      {[-8.5, -4.2, 0, 4.2, 8.5].map((z) => (
        <group key={z} position={[0, 0.79, z]}>
          <mesh position={[-0.52, 0, 0]}>
            <cylinderGeometry args={[0.022, 0.022, 0.72, 8]} />
            <meshStandardMaterial color="#8ba597" metalness={0.2} roughness={0.5} />
          </mesh>
          <mesh position={[0.52, 0, 0]}>
            <cylinderGeometry args={[0.022, 0.022, 0.72, 8]} />
            <meshStandardMaterial color="#8ba597" metalness={0.2} roughness={0.5} />
          </mesh>
          <Line points={[[-0.52, 0.34, 0], [0.52, 0.34, 0]]} color="#9db7a9" lineWidth={1} />
        </group>
      ))}
      {plantSlots.map((slot, index) => (
        <StrawberryPlant key={index} x={slot.x} z={slot.z} abnormal={slot.abnormal} index={index} />
      ))}
      <Html position={[0, 1.05, -11.45]} center>
        <div className={`scene-label ${row.abnormal ? 'warning' : ''}`}>{row.code}</div>
      </Html>
    </group>
  );
}

function StrawberryPlant({
  x,
  z,
  abnormal,
  index
}: {
  x: number;
  z: number;
  abnormal: boolean;
  index: number;
}) {
  const leafColor = abnormal ? '#9aa855' : '#42c870';
  const leafDark = abnormal ? '#6d7a3b' : '#1d8f55';
  const fruitColor = abnormal ? '#d89445' : '#ff4e72';

  return (
    <group position={[x, 0.62, z]} scale={index % 3 === 0 ? 1.08 : 1}>
      <mesh castShadow position={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.035, 0.055, 0.22, 8]} />
        <meshStandardMaterial color="#5a3f24" roughness={0.78} />
      </mesh>
      {Array.from({ length: 7 }, (_, leafIndex) => {
        const angle = (leafIndex / 7) * Math.PI * 2 + (index % 2) * 0.18;
        const radius = leafIndex % 2 === 0 ? 0.18 : 0.12;

        return (
          <mesh
            key={leafIndex}
            castShadow
            position={[Math.cos(angle) * radius, 0.03 + leafIndex * 0.006, Math.sin(angle) * radius]}
            rotation={[0.18, -angle, 0.55]}
            scale={[1.28, 0.34, 0.18]}
          >
            <sphereGeometry args={[0.16, 14, 8]} />
            <meshStandardMaterial color={leafIndex % 2 === 0 ? leafColor : leafDark} roughness={0.72} />
          </mesh>
        );
      })}
      <mesh castShadow position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.11, 12, 8]} />
        <meshStandardMaterial color={leafColor} roughness={0.78} />
      </mesh>
      {[
        [-0.15, 0.02, 0.16],
        [0.17, 0, -0.1],
        [0.02, -0.02, 0.22]
      ].map(([fruitX, fruitY, fruitZ], fruitIndex) => (
        <group key={fruitIndex}>
          <Line points={[[0, 0.12, 0], [fruitX * 0.72, 0.04, fruitZ * 0.72]]} color="#8ee9a8" lineWidth={0.75} />
          <mesh castShadow position={[fruitX, fruitY, fruitZ]} scale={[0.9, 1.18, 0.9]}>
            <sphereGeometry args={[fruitIndex === 2 ? 0.055 : 0.07, 10, 8]} />
            <meshStandardMaterial color={fruitColor} emissive="#4a0715" roughness={0.42} />
          </mesh>
          <mesh position={[fruitX, fruitY + 0.058, fruitZ]} scale={[1, 0.35, 1]}>
            <sphereGeometry args={[0.025, 6, 4]} />
            <meshStandardMaterial color="#f6ffd5" roughness={0.55} />
          </mesh>
        </group>
      ))}
      {index % 4 === 0 ? (
        <mesh castShadow position={[0.12, 0.15, 0.06]}>
          <sphereGeometry args={[0.04, 8, 6]} />
          <meshStandardMaterial color="#f7fff0" emissive="#fff1a8" emissiveIntensity={0.12} />
        </mesh>
      ) : null}
      {abnormal ? (
        <mesh rotation-x={-Math.PI / 2} position={[0, -0.13, 0]}>
          <ringGeometry args={[0.22, 0.26, 28]} />
          <meshBasicMaterial color="#f5ce5b" transparent opacity={0.36} side={THREE.DoubleSide} />
        </mesh>
      ) : null}
    </group>
  );
}

function SensorMarker({ sensor }: { sensor: SensorPoint }) {
  const selectTarget = useAppStore((state) => state.selectTarget);
  const color = sensorColors[sensor.type];

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    selectTarget({ category: 'sensor', id: sensor.id });
  };

  return (
    <group position={sensor.position} onClick={handleClick}>
      <mesh castShadow position={[0, -0.44, 0]}>
        <cylinderGeometry args={[0.035, 0.045, 0.92, 10]} />
        <meshStandardMaterial color="#d8fff1" metalness={0.22} roughness={0.38} />
      </mesh>
      <mesh castShadow position={[0, 0.06, 0]}>
        <boxGeometry args={[0.42, 0.34, 0.24]} />
        <meshStandardMaterial color="#102820" metalness={0.18} roughness={0.34} />
      </mesh>
      <mesh position={[0, 0.08, -0.13]}>
        <boxGeometry args={[0.26, 0.16, 0.018]} />
        <meshStandardMaterial color="#06131a" emissive={color} emissiveIntensity={0.26} />
      </mesh>
      <mesh castShadow position={[0, 0.31, 0]}>
        <sphereGeometry args={[0.16, 18, 14]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.36} roughness={0.42} />
      </mesh>
      <mesh position={[0, 0.48, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.19, 0.014, 8, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.42} />
      </mesh>
      <Line points={[[0.17, 0.29, 0], [0.34, 0.52, 0]]} color={color} lineWidth={1} />
      <Line points={[[-0.17, 0.29, 0], [-0.34, 0.52, 0]]} color={color} lineWidth={1} />
      <PulseRing color={color} />
      <Html position={[0, 0.72, 0]} center>
        <div className={`scene-label ${sensor.status === 'warning' ? 'warning' : ''}`}>{sensor.name}</div>
      </Html>
    </group>
  );
}

function DeviceMarker({ device }: { device: ControlDevice }) {
  const selectTarget = useAppStore((state) => state.selectTarget);
  const overrides = useAppStore((state) => state.deviceOverrides[device.id]);
  const merged = { ...device, ...overrides };
  const color = deviceColors[device.type];

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    selectTarget({ category: 'device', id: device.id });
  };

  return (
    <group position={device.position} onClick={handleClick}>
      <DeviceBody device={device} enabled={merged.enabled} color={color} />
      <mesh position={[0, 0.58, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.43, 0.022, 8, 36]} />
        <meshStandardMaterial
          color={merged.enabled ? color : '#53615d'}
          emissive={merged.enabled ? color : '#111'}
          emissiveIntensity={merged.enabled ? 0.2 : 0.02}
        />
      </mesh>
      <Html position={[0, 0.96, 0]} center>
        <div className={`scene-label ${device.status === 'warning' ? 'warning' : ''}`}>{device.name}</div>
      </Html>
    </group>
  );
}

function DeviceBody({
  device,
  enabled,
  color
}: {
  device: ControlDevice;
  enabled: boolean;
  color: string;
}) {
  const activeColor = enabled ? color : '#53615d';
  const emissive = enabled ? color : '#111111';

  if (device.type === 'fan') {
    return (
      <group>
        <mesh castShadow position={[0, 0.08, 0]}>
          <boxGeometry args={[0.54, 0.72, 0.22]} />
          <meshStandardMaterial color="#15211e" metalness={0.2} roughness={0.34} />
        </mesh>
        <mesh position={[0, 0.1, -0.13]}>
          <torusGeometry args={[0.25, 0.025, 10, 36]} />
          <meshStandardMaterial color={activeColor} emissive={emissive} emissiveIntensity={enabled ? 0.25 : 0.03} />
        </mesh>
        <FanRotor enabled={enabled} color={activeColor} />
      </group>
    );
  }

  if (device.type === 'growLight') {
    return (
      <group>
        <mesh castShadow position={[0, 0.05, 0]}>
          <boxGeometry args={[0.92, 0.16, 0.22]} />
          <meshStandardMaterial color="#1d2628" metalness={0.28} roughness={0.3} />
        </mesh>
        {[-0.28, 0, 0.28].map((x) => (
          <mesh key={x} position={[x, -0.05, 0]}>
            <boxGeometry args={[0.18, 0.035, 0.16]} />
            <meshStandardMaterial color={activeColor} emissive={emissive} emissiveIntensity={enabled ? 0.56 : 0.04} />
          </mesh>
        ))}
        <mesh rotation-x={-Math.PI / 2} position={[0, -0.32, 0]}>
          <coneGeometry args={[0.58, 0.72, 32, 1, true]} />
          <meshBasicMaterial color={color} transparent opacity={enabled ? 0.12 : 0.035} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      </group>
    );
  }

  if (device.type === 'irrigationValve') {
    return (
      <group>
        <mesh castShadow rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.1, 0.1, 0.72, 16]} />
          <meshStandardMaterial color="#26343a" metalness={0.34} roughness={0.32} />
        </mesh>
        <mesh castShadow>
          <sphereGeometry args={[0.18, 16, 12]} />
          <meshStandardMaterial color={activeColor} emissive={emissive} emissiveIntensity={enabled ? 0.22 : 0.02} />
        </mesh>
        <mesh position={[0, 0.22, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.18, 0.018, 8, 26]} />
          <meshStandardMaterial color="#d8fff1" metalness={0.22} roughness={0.38} />
        </mesh>
      </group>
    );
  }

  if (device.type === 'soilHeater') {
    return (
      <group>
        <mesh castShadow position={[0, -0.05, 0]}>
          <boxGeometry args={[0.62, 0.22, 0.5]} />
          <meshStandardMaterial color="#2b211d" metalness={0.2} roughness={0.42} />
        </mesh>
        {[-0.18, 0, 0.18].map((x) => (
          <mesh key={x} position={[x, 0.11, 0]} rotation-x={Math.PI / 2}>
            <torusGeometry args={[0.09, 0.012, 8, 24]} />
            <meshStandardMaterial color={activeColor} emissive={emissive} emissiveIntensity={enabled ? 0.34 : 0.04} />
          </mesh>
        ))}
      </group>
    );
  }

  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[0.64, 0.72, 0.48]} />
        <meshStandardMaterial
          color={activeColor}
          emissive={emissive}
          emissiveIntensity={enabled ? 0.2 : 0.02}
          metalness={0.18}
          roughness={0.42}
        />
      </mesh>
      <mesh position={[0, 0.07, -0.25]}>
        <boxGeometry args={[0.34, 0.22, 0.025]} />
        <meshStandardMaterial color="#06131a" emissive={emissive} emissiveIntensity={enabled ? 0.18 : 0.02} />
      </mesh>
      {device.type === 'humidifier' || device.type === 'dehumidifier' || device.type === 'coolingAc' ? (
        <group position={[0, 0.44, 0]}>
          {[0, 1, 2].map((index) => (
            <mesh key={index} position={[-0.18 + index * 0.18, 0, 0]} rotation-x={Math.PI / 2}>
              <torusGeometry args={[0.055, 0.006, 6, 18]} />
              <meshBasicMaterial color={color} transparent opacity={enabled ? 0.38 : 0.12} />
            </mesh>
          ))}
        </group>
      ) : null}
    </group>
  );
}

function FanRotor({ enabled, color }: { enabled: boolean; color: string }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current && enabled) {
      ref.current.rotation.z += delta * 6;
    }
  });

  return (
    <group ref={ref} position={[0, 0.1, -0.16]}>
      {[0, 1, 2].map((index) => (
        <mesh key={index} rotation-z={(index / 3) * Math.PI * 2} position={[0.12, 0, 0]}>
          <boxGeometry args={[0.25, 0.055, 0.018]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={enabled ? 0.22 : 0.03} />
        </mesh>
      ))}
    </group>
  );
}

function EnergyMarker({ device }: { device: EnergyDevice }) {
  const selectTarget = useAppStore((state) => state.selectTarget);
  const color = energyColors[device.type];

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    selectTarget({ category: 'energy', id: device.id });
  };

  if (device.type === 'solar') {
    return (
      <group position={device.position} rotation={[0.2, 0, 0]} onClick={handleClick}>
        <mesh castShadow>
          <boxGeometry args={[7.2, 0.08, 3.2]} />
          <meshStandardMaterial color="#0b4a5a" emissive="#0d8e9d" emissiveIntensity={0.25} />
        </mesh>
        {[-2.7, -0.9, 0.9, 2.7].map((x) => (
          <Line key={`solar-x-${x}`} points={[[x, 0.08, -1.55], [x, 0.08, 1.55]]} color="#7ee9ff" lineWidth={0.7} transparent opacity={0.58} />
        ))}
        {[-0.8, 0, 0.8].map((z) => (
          <Line key={`solar-z-${z}`} points={[[-3.55, 0.09, z], [3.55, 0.09, z]]} color="#7ee9ff" lineWidth={0.7} transparent opacity={0.48} />
        ))}
        <Line
          points={[
            [-3.6, 0.07, -1.6],
            [3.6, 0.07, -1.6],
            [3.6, 0.07, 1.6],
            [-3.6, 0.07, 1.6],
            [-3.6, 0.07, -1.6]
          ]}
          color={color}
          lineWidth={1}
        />
        <Html position={[0, 0.5, 0]} center>
          <div className="scene-label">{device.name}</div>
        </Html>
      </group>
    );
  }

  return (
    <group position={device.position} onClick={handleClick}>
      {device.type === 'wind' ? <WindTurbine color={color} /> : <EnergyCabinet device={device} color={color} />}
      <Html position={[0, device.type === 'wind' ? 2.5 : 1.18, 0]} center>
        <div className="scene-label">{device.name}</div>
      </Html>
    </group>
  );
}

function WindTurbine({ color }: { color: string }) {
  return (
    <group>
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.16, 3.8, 14]} />
        <meshStandardMaterial color="#d5f5ff" metalness={0.22} roughness={0.34} />
      </mesh>
      <mesh position={[0, 2.02, 0]}>
        <sphereGeometry args={[0.16, 16, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.18} />
      </mesh>
      <WindBlades />
      <Line points={[[0, 0.1, 0], [0.38, -0.55, 0.22]]} color={color} lineWidth={1} transparent opacity={0.55} />
      <Line points={[[0, 0.1, 0], [-0.38, -0.55, -0.22]]} color={color} lineWidth={1} transparent opacity={0.55} />
    </group>
  );
}

function EnergyCabinet({ device, color }: { device: EnergyDevice; color: string }) {
  const bars = device.type === 'battery' ? Math.max(1, Math.round((device.storagePercent ?? 70) / 18)) : 4;

  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[0.9, 1.25, 0.75]} />
        <meshStandardMaterial color="#12251f" emissive={color} emissiveIntensity={0.12} metalness={0.2} roughness={0.36} />
      </mesh>
      <mesh position={[0, 0.08, -0.39]}>
        <boxGeometry args={[0.62, 0.52, 0.025]} />
        <meshStandardMaterial color="#06131a" emissive={color} emissiveIntensity={0.18} />
      </mesh>
      {Array.from({ length: 5 }, (_, index) => (
        <mesh key={index} position={[-0.24 + index * 0.12, -0.14, -0.415]}>
          <boxGeometry args={[0.075, 0.18 + (index < bars ? 0.12 : 0), 0.018]} />
          <meshStandardMaterial color={index < bars ? color : '#2c3a36'} emissive={index < bars ? color : '#000'} emissiveIntensity={0.24} />
        </mesh>
      ))}
      <mesh position={[0, -0.54, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.46, 0.012, 8, 36]} />
        <meshBasicMaterial color={color} transparent opacity={0.28} />
      </mesh>
    </group>
  );
}

function WindBlades() {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * 3.4;
    }
  });

  return (
    <group ref={ref} position={[0, 2.05, 0.08]}>
      {[0, 1, 2].map((index) => (
        <mesh key={index} rotation-z={(index / 3) * Math.PI * 2} position={[0.32, 0, 0]}>
          <boxGeometry args={[0.74, 0.08, 0.035]} />
          <meshStandardMaterial color="#d5f5ff" emissive="#51d6ff" emissiveIntensity={0.28} />
        </mesh>
      ))}
    </group>
  );
}

function PersonnelMarker({ person }: { person: Personnel }) {
  const selectTarget = useAppStore((state) => state.selectTarget);
  const roleTone = getPersonnelTone(person);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    selectTarget({ category: 'personnel', id: person.id });
  };

  return (
    <group position={person.position} onClick={handleClick}>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.34, 0.38, 32]} />
        <meshBasicMaterial color={roleTone} transparent opacity={0.22} side={THREE.DoubleSide} />
      </mesh>
      <mesh castShadow position={[0, 0.28, 0]}>
        <capsuleGeometry args={[0.08, 0.34, 5, 10]} />
        <meshStandardMaterial color="#1b2528" roughness={0.58} />
      </mesh>
      <mesh castShadow position={[0, 0.75, 0]}>
        <capsuleGeometry args={[0.16, 0.42, 8, 14]} />
        <meshStandardMaterial color={roleTone} emissive={roleTone} emissiveIntensity={0.16} roughness={0.48} />
      </mesh>
      <mesh castShadow position={[0, 0.79, -0.14]}>
        <boxGeometry args={[0.24, 0.28, 0.06]} />
        <meshStandardMaterial color="#0c1518" metalness={0.16} roughness={0.36} />
      </mesh>
      <mesh castShadow position={[0, 1.12, 0]}>
        <sphereGeometry args={[0.18, 14, 12]} />
        <meshStandardMaterial color="#ffe1c4" roughness={0.6} />
      </mesh>
      <mesh castShadow position={[0, 1.25, 0]} scale={[1.12, 0.42, 1]}>
        <sphereGeometry args={[0.18, 16, 8]} />
        <meshStandardMaterial color="#f5ce5b" metalness={0.12} roughness={0.34} />
      </mesh>
      <mesh position={[0, 1.18, -0.16]}>
        <boxGeometry args={[0.24, 0.035, 0.08]} />
        <meshStandardMaterial color="#11181b" />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh castShadow position={[side * 0.18, 0.78, 0]} rotation-z={side * 0.42}>
            <capsuleGeometry args={[0.035, 0.32, 5, 8]} />
            <meshStandardMaterial color="#d8fff1" roughness={0.48} />
          </mesh>
          <mesh castShadow position={[side * 0.25, 0.55, 0.03]}>
            <sphereGeometry args={[0.045, 8, 6]} />
            <meshStandardMaterial color="#ffe1c4" roughness={0.52} />
          </mesh>
          <mesh castShadow position={[side * 0.08, 0.22, 0]} rotation-z={side * 0.1}>
            <capsuleGeometry args={[0.04, 0.32, 5, 8]} />
            <meshStandardMaterial color="#182124" roughness={0.6} />
          </mesh>
        </group>
      ))}
      {person.id.includes('maintainer') ? (
        <mesh castShadow position={[0.33, 0.54, 0.08]} rotation-z={-0.7}>
          <cylinderGeometry args={[0.025, 0.025, 0.42, 8]} />
          <meshStandardMaterial color="#d5f5ff" metalness={0.4} roughness={0.28} />
        </mesh>
      ) : null}
      {person.id.includes('picker') ? (
        <mesh castShadow position={[0.29, 0.47, 0.1]}>
          <sphereGeometry args={[0.045, 8, 6]} />
          <meshStandardMaterial color="#ff4e72" emissive="#4a0715" />
        </mesh>
      ) : null}
      <Html position={[0, 1.52, 0]} center>
        <div className="scene-label">{person.name}</div>
      </Html>
    </group>
  );
}

function getPersonnelTone(person: Personnel) {
  if (person.id.includes('inspector')) {
    return '#51d6ff';
  }

  if (person.id.includes('picker')) {
    return '#70f2a1';
  }

  return '#f5ce5b';
}

function AlarmMarker({ alarm }: { alarm: Alarm }) {
  const selectTarget = useAppStore((state) => state.selectTarget);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    selectTarget({ category: 'alarm', id: alarm.id });
  };

  return (
    <group position={alarm.position} onClick={handleClick}>
      <PulseRing color="#ff4e72" fast />
      <mesh>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#ff4e72" emissive="#ff4e72" emissiveIntensity={0.55} />
      </mesh>
      <Html position={[0, 0.46, 0]} center>
        <div className="scene-label alarm">{alarm.level} · {alarm.type}</div>
      </Html>
    </group>
  );
}

function HeatmapLayer({ rows }: { rows: StrawberryRow[] }) {
  return (
    <group>
      {rows.map((row) => (
        <HeatmapCell key={row.id} row={row} />
      ))}
    </group>
  );
}

function HeatmapCell({ row }: { row: StrawberryRow }) {
  const ref = useRef<THREE.Mesh>(null);
  const humidity = row.env.soilHumidity;
  const stress = row.abnormal || humidity < row.bounds.soilHumidity[0] || humidity > row.bounds.soilHumidity[1];
  const color = stress ? '#ff4e72' : humidity < 55 ? '#f5ce5b' : humidity > 68 ? '#51d6ff' : '#70f2a1';
  const baseOpacity = stress ? 0.38 : 0.2;

  useFrame(({ clock }) => {
    if (!ref.current) {
      return;
    }
    const pulse = 0.5 + Math.sin(clock.elapsedTime * 1.8 + row.position[0]) * 0.5;
    ref.current.scale.set(1 + pulse * 0.045, 1 + pulse * 0.018, 1);
    const material = ref.current.material as THREE.MeshBasicMaterial;
    material.opacity = baseOpacity + pulse * 0.12;
  });

  return (
    <group position={[row.position[0], 0.035, row.position[2]]}>
      <mesh ref={ref} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[1.42, 23.8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={baseOpacity}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <Line
        points={[
          [-0.72, 0.04, -11.9],
          [-0.72, 0.04, 11.9],
          [0.72, 0.04, 11.9],
          [0.72, 0.04, -11.9],
          [-0.72, 0.04, -11.9]
        ]}
        color={color}
        lineWidth={stress ? 2 : 1}
        transparent
        opacity={0.72}
      />
      <Html position={[0, 0.18, 10.8]} center>
        <div className={`scene-label ${stress ? 'alarm' : ''}`}>
          {row.code} · {humidity}%
        </div>
      </Html>
    </group>
  );
}

function PulseRing({ color, fast = false }: { color: string; fast?: boolean }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) {
      return;
    }
    const speed = fast ? 2.4 : 1.4;
    const scale = 1 + ((clock.elapsedTime * speed) % 1) * 1.8;
    ref.current.scale.setScalar(scale);
    const material = ref.current.material as THREE.MeshBasicMaterial;
    material.opacity = Math.max(0, 0.42 - (scale - 1) * 0.2);
  });

  return (
    <mesh ref={ref} rotation-x={-Math.PI / 2}>
      <ringGeometry args={[0.28, 0.32, 36]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
    </mesh>
  );
}
