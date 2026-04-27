import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, Preload } from '@react-three/drei';
import { GreenhouseScene } from './GreenhouseScene';
import { useAppStore } from '../../store/useAppStore';

export function Greenhouse3D() {
  const heatmapEnabled = useAppStore((state) => state.layers.heatmap);

  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        camera={{ position: [15, 10, 18], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#031111']} />
        <fog attach="fog" args={['#031111', 14, 44]} />
        <Suspense fallback={null}>
          <GreenhouseScene />
          <Environment preset="night" />
          <Preload all />
        </Suspense>
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          minDistance={8}
          maxDistance={36}
          maxPolarAngle={Math.PI / 2.08}
        />
      </Canvas>
      <div className="pointer-events-none absolute left-4 top-4 rounded border border-leaf-300/20 bg-field-950/70 px-3 py-2 text-xs text-slate-300 backdrop-blur-md">
        鼠标拖拽旋转 · 滚轮缩放 · 右键平移 · 点击对象查看详情
      </div>
      {heatmapEnabled ? (
        <div className="pointer-events-none absolute bottom-4 left-4 rounded border border-leaf-300/20 bg-field-950/72 p-3 text-xs text-slate-300 shadow-glow backdrop-blur-md">
          <div className="mb-2 font-semibold text-leaf-300">环境热力图 · 土壤湿度</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <LegendDot color="#70f2a1" label="适宜" />
            <LegendDot color="#f5ce5b" label="偏低" />
            <LegendDot color="#51d6ff" label="偏高" />
            <LegendDot color="#ff4e72" label="异常" />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
