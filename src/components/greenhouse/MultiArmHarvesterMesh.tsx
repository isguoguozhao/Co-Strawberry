import { Html, Line } from '@react-three/drei';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { HarvestVehicle, Vector3Tuple } from '../../types';

type MultiArmHarvesterMeshProps = {
  vehicle: HarvestVehicle;
  onSelect: (event: ThreeEvent<MouseEvent>) => void;
};

const WHITE = '#f2f6f4';
const PANEL = '#141b1f';
const CARBON = '#070a0c';
const METAL = '#aeb8bd';
const CYAN = '#51d6ff';
const LEAF = '#70f2a1';
const BERRY = '#ff4e72';

export function MultiArmHarvesterMesh({ vehicle, onSelect }: MultiArmHarvesterMeshProps) {
  const lidarRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    if (lidarRef.current) {
      lidarRef.current.rotation.y += delta * 1.8;
    }

    if (screenRef.current) {
      const material = screenRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.28 + Math.sin(clock.elapsedTime * 2.1) * 0.12;
    }
  });

  return (
    <group>
      <Line points={vehicle.route} color={BERRY} lineWidth={2.5} dashed dashScale={0.72} />
      <group position={vehicle.position} onClick={onSelect}>
        <mesh rotation-x={-Math.PI / 2} position={[0, -0.2, 0]}>
          <circleGeometry args={[1.62, 42]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.22} depthWrite={false} />
        </mesh>

        <TrackModule side={-1} />
        <TrackModule side={1} />

        <mesh castShadow receiveShadow position={[0, 0.28, 0]}>
          <boxGeometry args={[1.68, 0.34, 2.26]} />
          <meshStandardMaterial color="#20272b" metalness={0.28} roughness={0.42} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.57, -0.2]}>
          <boxGeometry args={[1.46, 0.42, 1.82]} />
          <meshStandardMaterial color="#dce2de" metalness={0.22} roughness={0.34} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 1.1, -0.18]}>
          <boxGeometry args={[1.26, 1.05, 1.42]} />
          <meshStandardMaterial color={WHITE} metalness={0.18} roughness={0.28} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 1.72, -0.12]}>
          <boxGeometry args={[1.05, 0.24, 1.1]} />
          <meshStandardMaterial color="#e8efec" metalness={0.2} roughness={0.26} />
        </mesh>

        <mesh castShadow position={[0, 1.1, -0.91]}>
          <boxGeometry args={[0.92, 0.74, 0.045]} />
          <meshStandardMaterial color={PANEL} metalness={0.26} roughness={0.2} />
        </mesh>
        <mesh ref={screenRef} position={[0, 1.1, -0.938]}>
          <boxGeometry args={[0.62, 0.42, 0.025]} />
          <meshStandardMaterial color="#06131a" emissive={CYAN} emissiveIntensity={0.34} roughness={0.2} />
        </mesh>
        <ScreenTelemetry />

        <mesh castShadow position={[0, 0.59, -1.14]}>
          <boxGeometry args={[1.34, 0.24, 0.2]} />
          <meshStandardMaterial color="#11181b" metalness={0.3} roughness={0.38} />
        </mesh>
        {[-0.47, 0.47].map((x) => (
          <mesh key={x} position={[x, 0.7, -1.27]}>
            <boxGeometry args={[0.36, 0.13, 0.06]} />
            <meshStandardMaterial color="#d8fff1" emissive={CYAN} emissiveIntensity={0.55} />
          </mesh>
        ))}

        <group ref={lidarRef} position={[0, 1.98, -0.35]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.22, 0.18, 0.12, 24]} />
            <meshStandardMaterial color={CARBON} metalness={0.45} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.09, 0]}>
            <boxGeometry args={[0.42, 0.12, 0.32]} />
            <meshStandardMaterial color="#11181b" emissive={CYAN} emissiveIntensity={0.18} />
          </mesh>
          <mesh position={[0, 0.18, 0]} rotation-x={Math.PI / 2}>
            <torusGeometry args={[0.19, 0.016, 8, 32]} />
            <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.5} />
          </mesh>
        </group>

        <StorageRack side={-1} />
        <StorageRack side={1} />

        <ArmAssembly side={-1} zBase={-0.62} zSpread={-1} phase={0.2} />
        <ArmAssembly side={1} zBase={-0.62} zSpread={-1} phase={1.1} />
        <ArmAssembly side={-1} zBase={0.64} zSpread={1} phase={2.4} />
        <ArmAssembly side={1} zBase={0.64} zSpread={1} phase={3.1} />

        <Html position={[0, 2.38, 0]} center>
          <div className="scene-label alarm">大型多机械臂草莓采摘车</div>
        </Html>
      </group>
    </group>
  );
}

function ScreenTelemetry() {
  return (
    <group position={[-0.3, 0.96, -0.956]}>
      {[0, 1, 2].map((index) => (
        <mesh key={`line-${index}`} position={[0.18, index * 0.09, 0]}>
          <boxGeometry args={[0.3 - index * 0.05, 0.012, 0.01]} />
          <meshBasicMaterial color={index === 1 ? LEAF : CYAN} />
        </mesh>
      ))}
      <Line
        points={[
          [0.02, -0.02, 0.006],
          [0.1, 0.08, 0.006],
          [0.22, 0.02, 0.006],
          [0.35, 0.16, 0.006],
          [0.5, 0.08, 0.006]
        ]}
        color={LEAF}
        lineWidth={1}
      />
      <mesh position={[0.52, -0.04, 0]}>
        <boxGeometry args={[0.09, 0.026, 0.01]} />
        <meshBasicMaterial color={BERRY} />
      </mesh>
    </group>
  );
}

function TrackModule({ side }: { side: -1 | 1 }) {
  return (
    <group position={[side * 0.72, 0.06, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.36, 2.36]} />
        <meshStandardMaterial color={CARBON} metalness={0.18} roughness={0.68} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.46, 0.18, 2.5]} />
        <meshStandardMaterial color="#13191b" metalness={0.12} roughness={0.75} />
      </mesh>
      {[-0.84, -0.34, 0.34, 0.84].map((z, index) => (
        <AnimatedWheel key={z} z={z} phase={index * 0.35} />
      ))}
      {Array.from({ length: 13 }, (_, index) => (
        <mesh key={index} position={[0, -0.16, -1.08 + index * 0.18]}>
          <boxGeometry args={[0.5, 0.045, 0.1]} />
          <meshStandardMaterial color="#050708" roughness={0.82} />
        </mesh>
      ))}
    </group>
  );
}

function AnimatedWheel({ z, phase }: { z: number; phase: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * (1.2 + phase * 0.08);
    }
  });

  return (
    <mesh ref={ref} castShadow position={[0, 0.02, z]} rotation-z={Math.PI / 2}>
      <cylinderGeometry args={[0.24, 0.24, 0.18, 24]} />
      <meshStandardMaterial color="#2e3437" metalness={0.42} roughness={0.36} />
    </mesh>
  );
}

function StorageRack({ side }: { side: -1 | 1 }) {
  return (
    <group position={[side * 0.82, 1.08, 0.38]}>
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.12, 1.02, 1.08]} />
        <meshStandardMaterial color="#2a3235" metalness={0.28} roughness={0.42} />
      </mesh>
      {[0, 1, 2, 3].map((level) => (
        <group key={level} position={[side * 0.12, -0.38 + level * 0.25, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.48, 0.045, 1.02]} />
            <meshStandardMaterial color="#cdd6d1" metalness={0.24} roughness={0.36} />
          </mesh>
          {[-0.34, 0, 0.34].map((z, index) => (
            <mesh key={z} castShadow position={[side * (0.08 + index * 0.035), 0.065, z]}>
              <sphereGeometry args={[0.055, 10, 8]} />
              <meshStandardMaterial color={index === 1 ? '#ff7590' : BERRY} emissive="#4a0715" />
            </mesh>
          ))}
        </group>
      ))}
      <Line
        points={[
          [side * 0.34, -0.5, -0.58],
          [side * 0.34, 0.55, -0.58],
          [side * 0.34, 0.55, 0.58],
          [side * 0.34, -0.5, 0.58]
        ]}
        color={LEAF}
        lineWidth={1}
        transparent
        opacity={0.65}
      />
    </group>
  );
}

function ArmAssembly({
  side,
  zBase,
  zSpread,
  phase
}: {
  side: -1 | 1;
  zBase: number;
  zSpread: -1 | 1;
  phase: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const shoulder: Vector3Tuple = [0, 0, 0];
  const upper: Vector3Tuple = [side * 0.48, -0.08, zSpread * 0.34];
  const elbow: Vector3Tuple = [side * 1.04, -0.34, zSpread * 0.72];
  const wrist: Vector3Tuple = [side * 1.36, -0.6, zSpread * 1.02];

  useFrame(({ clock }) => {
    if (!ref.current) {
      return;
    }

    ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.72 + phase) * 0.055 * side;
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.62 + phase) * 0.026;
  });

  return (
    <group ref={ref} position={[side * 0.78, 1.42, zBase]}>
      <mesh castShadow>
        <sphereGeometry args={[0.18, 18, 14]} />
        <meshStandardMaterial color="#e7eeee" metalness={0.38} roughness={0.24} />
      </mesh>
      <mesh rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.22, 0.22, 0.14, 24]} />
        <meshStandardMaterial color={PANEL} metalness={0.42} roughness={0.25} />
      </mesh>
      <ArmSegment start={shoulder} end={upper} radius={0.08} color="#dce2de" />
      <ArmSegment start={upper} end={elbow} radius={0.075} color="#f3f7f5" />
      <ArmSegment start={elbow} end={wrist} radius={0.058} color="#cbd4d1" />
      {[upper, elbow, wrist].map((point, index) => (
        <Joint key={index} position={point} alert={index === 2} />
      ))}
      <Cable points={[shoulder, [side * 0.36, 0.08, zSpread * 0.22], elbow, wrist]} />
      <FlexibleClaw side={side} zSpread={zSpread} position={wrist} />
    </group>
  );
}

function ArmSegment({
  start,
  end,
  radius,
  color
}: {
  start: Vector3Tuple;
  end: Vector3Tuple;
  radius: number;
  color: string;
}) {
  const transform = useMemo(() => {
    const startVector = new THREE.Vector3(...start);
    const endVector = new THREE.Vector3(...end);
    const midpoint = startVector.clone().add(endVector).multiplyScalar(0.5);
    const direction = endVector.clone().sub(startVector);
    const length = direction.length();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.clone().normalize()
    );

    return { midpoint, length, quaternion };
  }, [start, end]);

  return (
    <mesh castShadow position={transform.midpoint} quaternion={transform.quaternion}>
      <cylinderGeometry args={[radius, radius, transform.length, 18]} />
      <meshStandardMaterial color={color} metalness={0.34} roughness={0.25} />
    </mesh>
  );
}

function Joint({ position, alert = false }: { position: Vector3Tuple; alert?: boolean }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <sphereGeometry args={[0.13, 16, 12]} />
        <meshStandardMaterial
          color={alert ? CYAN : '#1b2326'}
          emissive={alert ? CYAN : '#000000'}
          emissiveIntensity={alert ? 0.24 : 0}
          metalness={0.38}
          roughness={0.28}
        />
      </mesh>
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.14, 0.018, 8, 24]} />
        <meshStandardMaterial color={METAL} metalness={0.42} roughness={0.22} />
      </mesh>
    </group>
  );
}

function Cable({ points }: { points: Vector3Tuple[] }) {
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
  }, [points]);

  return (
    <mesh>
      <tubeGeometry args={[curve, 32, 0.018, 7, false]} />
      <meshStandardMaterial color={CARBON} roughness={0.65} />
    </mesh>
  );
}

function FlexibleClaw({
  side,
  zSpread,
  position
}: {
  side: -1 | 1;
  zSpread: -1 | 1;
  position: Vector3Tuple;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(clock.elapsedTime * 1.8) * 0.05 * side;
    }
  });

  return (
    <group ref={ref} position={position} rotation-y={side * 0.36}>
      <mesh castShadow>
        <sphereGeometry args={[0.08, 12, 10]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.38} />
      </mesh>
      <mesh castShadow position={[side * 0.1, -0.04, zSpread * 0.08]}>
        <boxGeometry args={[0.16, 0.1, 0.12]} />
        <meshStandardMaterial color="#11191c" metalness={0.34} roughness={0.32} />
      </mesh>
      {[-0.16, 0, 0.16].map((offset, index) => (
        <group key={offset} position={[side * 0.2, -0.1, zSpread * (0.12 + offset)]}>
          <mesh rotation-z={side * 0.55}>
            <cylinderGeometry args={[0.018, 0.024, 0.24, 8]} />
            <meshStandardMaterial color="#d9e3df" metalness={0.24} roughness={0.36} />
          </mesh>
          <mesh position={[side * 0.08, -0.11, 0]}>
            <sphereGeometry args={[0.026, 8, 6]} />
            <meshStandardMaterial color={index === 1 ? LEAF : BERRY} emissive={index === 1 ? '#113f2b' : '#4a0715'} />
          </mesh>
        </group>
      ))}
      <mesh position={[side * 0.25, -0.22, zSpread * 0.12]}>
        <sphereGeometry args={[0.05, 10, 8]} />
        <meshStandardMaterial color={BERRY} emissive="#5f0f1c" emissiveIntensity={0.18} />
      </mesh>
    </group>
  );
}
