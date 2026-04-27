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
import type {
  Alarm,
  ControlDevice,
  EnergyDevice,
  Personnel,
  SensorPoint,
  StrawberryRow,
  Vector3Tuple
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
      <HarvestVehicleMesh />
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
      {Array.from({ length: 12 }, (_, index) => (
        <StrawberryPlant key={index} z={-10 + index * 1.82} abnormal={row.abnormal && index % 4 === 1} />
      ))}
      <Html position={[0, 1.05, -11.45]} center>
        <div className={`scene-label ${row.abnormal ? 'warning' : ''}`}>{row.code}</div>
      </Html>
    </group>
  );
}

function StrawberryPlant({ z, abnormal }: { z: number; abnormal: boolean }) {
  return (
    <group position={[0, 0.58, z]}>
      <mesh castShadow position={[0, 0.04, 0]}>
        <sphereGeometry args={[0.24, 10, 8]} />
        <meshStandardMaterial color={abnormal ? '#b6a457' : '#42c870'} roughness={0.8} />
      </mesh>
      <mesh castShadow position={[-0.14, 0.09, 0.12]}>
        <sphereGeometry args={[0.075, 8, 6]} />
        <meshStandardMaterial color="#ff4e72" emissive="#4a0715" roughness={0.45} />
      </mesh>
      <mesh castShadow position={[0.16, 0.07, -0.1]}>
        <sphereGeometry args={[0.062, 8, 6]} />
        <meshStandardMaterial color="#ff7590" emissive="#3f0814" roughness={0.45} />
      </mesh>
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
      <mesh castShadow>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.32} />
      </mesh>
      <mesh position={[0, -0.42, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.82, 8]} />
        <meshStandardMaterial color="#d8fff1" />
      </mesh>
      <PulseRing color={color} />
      <Html position={[0, 0.52, 0]} center>
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
      <mesh castShadow>
        <boxGeometry args={[0.64, 0.64, 0.64]} />
        <meshStandardMaterial
          color={merged.enabled ? color : '#53615d'}
          emissive={merged.enabled ? color : '#111'}
          emissiveIntensity={merged.enabled ? 0.22 : 0.02}
          roughness={0.48}
        />
      </mesh>
      <mesh position={[0, 0.45, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.38, 0.028, 8, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.18} />
      </mesh>
      <Html position={[0, 0.78, 0]} center>
        <div className={`scene-label ${device.status === 'warning' ? 'warning' : ''}`}>{device.name}</div>
      </Html>
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
      <mesh castShadow>
        {device.type === 'wind' ? (
          <cylinderGeometry args={[0.12, 0.18, 3.8, 12]} />
        ) : (
          <boxGeometry args={[0.9, 1.25, 0.75]} />
        )}
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.18} />
      </mesh>
      {device.type === 'wind' ? <WindBlades /> : null}
      <Html position={[0, device.type === 'wind' ? 2.25 : 0.95, 0]} center>
        <div className="scene-label">{device.name}</div>
      </Html>
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

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    selectTarget({ category: 'personnel', id: person.id });
  };

  return (
    <group position={person.position} onClick={handleClick}>
      <mesh castShadow position={[0, 0.42, 0]}>
        <capsuleGeometry args={[0.18, 0.58, 6, 12]} />
        <meshStandardMaterial color="#51d6ff" emissive="#0b3f4f" emissiveIntensity={0.22} />
      </mesh>
      <mesh castShadow position={[0, 0.91, 0]}>
        <sphereGeometry args={[0.18, 14, 12]} />
        <meshStandardMaterial color="#ffe1c4" roughness={0.6} />
      </mesh>
      <Html position={[0, 1.34, 0]} center>
        <div className="scene-label">{person.name}</div>
      </Html>
    </group>
  );
}

function HarvestVehicleMesh() {
  const selectTarget = useAppStore((state) => state.selectTarget);
  const vehicle = harvestVehicle;

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    selectTarget({ category: 'vehicle', id: vehicle.id });
  };

  return (
    <group>
      <Line points={vehicle.route} color="#ff7590" lineWidth={2} dashed dashScale={0.7} />
      <group position={vehicle.position} onClick={handleClick}>
        <mesh castShadow position={[0, 0.2, 0]}>
          <boxGeometry args={[1.2, 0.36, 0.86]} />
          <meshStandardMaterial color="#26333a" metalness={0.22} roughness={0.44} />
        </mesh>
        {[-0.43, 0.43].map((x) =>
          [-0.32, 0.32].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, -0.03, z]} rotation-z={Math.PI / 2}>
              <cylinderGeometry args={[0.15, 0.15, 0.16, 16]} />
              <meshStandardMaterial color="#101518" />
            </mesh>
          ))
        )}
        <mesh position={[0.05, 0.62, 0]} rotation-z={-0.55}>
          <boxGeometry args={[0.18, 0.92, 0.18]} />
          <meshStandardMaterial color="#70f2a1" emissive="#113f2b" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0.42, 1.05, 0]} rotation-z={0.45}>
          <boxGeometry args={[0.16, 0.72, 0.16]} />
          <meshStandardMaterial color="#70f2a1" emissive="#113f2b" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0.72, 1.24, 0]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#51d6ff" emissive="#51d6ff" emissiveIntensity={0.35} />
        </mesh>
        <mesh position={[0.86, 1.18, 0]}>
          <coneGeometry args={[0.16, 0.36, 12]} />
          <meshStandardMaterial color="#ff7590" emissive="#5f0f1c" emissiveIntensity={0.2} />
        </mesh>
        <Html position={[0, 1.58, 0]} center>
          <div className="scene-label alarm">AGV-01 采摘小车</div>
        </Html>
      </group>
    </group>
  );
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
