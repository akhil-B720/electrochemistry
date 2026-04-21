import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { GlassCard } from '../components/ui/GlassCard'

/** Minimal jelly-roll / prismatic hint for Li-ion visualization. */
function LiCellScene({ soc }: { soc: number }) {
  const shift = (1 - soc) * 0.4
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.4, 0.15, 1.2]} />
        <meshStandardMaterial color="#1e293b" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[-0.4 + shift, 0.2, 0]}>
        <boxGeometry args={[0.9, 0.35, 0.9]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#0369a1" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.5 - shift, 0.25, 0]}>
        <boxGeometry args={[0.85, 0.3, 0.85]} />
        <meshStandardMaterial color="#f472b6" emissive="#9d174d" emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.08, 0.45, 0.9]} />
        <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={soc * 0.6} />
      </mesh>
    </group>
  )
}

function useVoltageTrace(kind: 'li' | 'pb', soc: number, loss: number) {
  return useMemo(() => {
    const pts: { t: number; v: number }[] = []
    for (let i = 0; i <= 40; i++) {
      const t = i * 0.25
      const fade = kind === 'li' ? 3.6 + 0.4 * Math.sin(soc * Math.PI) - t * 0.02 * loss : 2.1 - t * 0.01 * loss
      pts.push({ t, v: Math.max(fade, kind === 'li' ? 2.5 : 1.6) })
    }
    return {
      labels: pts.map((p) => p.t.toFixed(1)),
      datasets: [
        {
          label: kind === 'li' ? 'Li-ion stack (model)' : 'Pb–acid terminal (model)',
          data: pts.map((p) => p.v),
          borderColor: kind === 'li' ? '#22d3ee' : '#fbbf24',
          backgroundColor: kind === 'li' ? 'rgba(34,211,238,0.15)' : 'rgba(251,191,36,0.15)',
          fill: true,
          tension: 0.35,
          pointRadius: 0,
        },
      ],
    }
  }, [kind, soc, loss])
}

export function BatteryLabPage() {
  const [kind, setKind] = useState<'li' | 'pb'>('li')
  const [soc, setSoc] = useState(0.72)
  const [loss, setLoss] = useState(1)
  const data = useVoltageTrace(kind, soc, loss)

  const chartOpts = {
    responsive: true,
    plugins: { legend: { labels: { color: '#e2e8f0' } } },
    scales: {
      x: { title: { display: true, text: 'Time (arb.)', color: '#94a3b8' }, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.1)' } },
      y: { title: { display: true, text: 'Voltage (model V)', color: '#94a3b8' }, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.1)' } },
    },
  } as const

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-white">Battery lab</h1>
        <p className="mt-2 max-w-3xl text-slate-400">
          Blend qualitative 3D structure with charge/discharge sliders, efficiency loss, and a live terminal-voltage trace (model curves for pedagogy).
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ['li', 'Li-ion'],
            ['pb', 'Pb–acid'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setKind(id)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              kind === id ? 'bg-cyan-500/20 text-cyan-100 shadow-glow' : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <GlassCard className="h-[360px] overflow-hidden">
          <Canvas>
            <PerspectiveCamera makeDefault position={[2.6, 2.2, 3.4]} />
            <OrbitControls enableZoom={false} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[3, 5, 2]} intensity={1.2} />
            <LiCellScene soc={soc} />
          </Canvas>
          <div className="px-3 py-2 text-center text-xs text-slate-500">Ion shuttle brightness tracks state-of-charge (schematic)</div>
        </GlassCard>

        <GlassCard glow="purple" className="space-y-6">
          <div>
            <div className="mb-2 flex justify-between text-sm text-slate-300">
              <span>State of charge</span>
              <span className="font-mono text-cyan-300">{(soc * 100).toFixed(0)}%</span>
            </div>
            <input type="range" min={0} max={1} step={0.01} value={soc} onChange={(e) => setSoc(parseFloat(e.target.value))} className="w-full accent-cyan-500" />
          </div>
          <div>
            <div className="mb-2 flex justify-between text-sm text-slate-300">
              <span>Efficiency / resistive loss stress</span>
              <span className="font-mono text-fuchsia-300">{loss.toFixed(1)}×</span>
            </div>
            <input type="range" min={0.5} max={3} step={0.1} value={loss} onChange={(e) => setLoss(parseFloat(e.target.value))} className="w-full accent-fuchsia-500" />
          </div>
          <motion.div
            key={kind}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300"
          >
            {kind === 'li'
              ? 'Graphite ↔ NMC/LCO style intercalation with Li⁺ shuttling through electrolyte + SEI polarization (not explicit here).'
              : 'Pb ↔ PbO₂ in sulfuric acid; voltage tracks acid strength and PbSO₄ accumulation paths (highly simplified trace).'}
          </motion.div>
        </GlassCard>
      </div>

      <GlassCard>
        <h2 className="mb-4 text-lg font-semibold text-white">Voltage vs time (model)</h2>
        <div className="h-[300px]">
          <Line data={data} options={chartOpts} />
        </div>
      </GlassCard>
    </div>
  )
}
