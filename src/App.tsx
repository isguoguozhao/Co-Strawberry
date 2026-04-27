import { Greenhouse3D } from './components/greenhouse/Greenhouse3D';
import { TopBar } from './components/layout/TopBar';
import { ModuleNavigationBar } from './components/layout/ModuleNavigationBar';
import { MetricStrip } from './components/layout/MetricStrip';
import { InfoPanel } from './components/panels/InfoPanel';
import { ModulePanel } from './components/panels/ModulePanel';
import { RealtimeMockEngine } from './components/RealtimeMockEngine';

function App() {
  return (
    <div className="relative h-screen overflow-hidden bg-grid bg-[length:44px_44px] p-4 text-slate-100">
      <RealtimeMockEngine />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 border-b border-leaf-300/10 bg-gradient-to-b from-leaf-400/10 to-transparent" />
      <TopBar />
      <ModuleNavigationBar />
      <div className="relative z-10 grid h-[calc(100vh-218px)] grid-cols-[320px_minmax(0,1fr)_366px] gap-4">
        <InfoPanel />
        <main className="flex min-w-0 flex-col gap-4">
          <section className="glass-panel relative min-h-0 flex-1 overflow-hidden rounded-lg">
            <Greenhouse3D />
          </section>
          <MetricStrip />
        </main>
        <aside className="min-h-0 overflow-hidden rounded-lg">
          <div className="scrollbar-thin h-full overflow-y-auto">
            <ModulePanel />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
