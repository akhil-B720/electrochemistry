import { useState } from 'react'
import { GlassCard } from '../components/ui/GlassCard'
import { GalvanicCellSimulation } from '../components/simulations/GalvanicCellSimulation'
import { ElectrolyticCellSimulation } from '../components/simulations/ElectrolyticCellSimulation'
import { RedoxVisualizer } from '../components/simulations/RedoxVisualizer'

const TABS = [
  { id: 'galvanic', label: 'Galvanic cell (3D)' },
  { id: 'electrolytic', label: 'Electrolytic cell' },
  { id: 'redox', label: 'Redox visualizer' },
] as const

export function SimulationsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('galvanic')

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-white">Interactive simulations</h1>
        <p className="mt-2 max-w-3xl text-slate-400">
          Toggle reactions, watch schematic ion and electron flows, and step through half-reactions with animation.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              tab === t.id ? 'bg-cyan-500/20 text-cyan-100 shadow-glow' : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <GlassCard glow={tab === 'galvanic' ? 'cyan' : tab === 'electrolytic' ? 'purple' : 'green'}>
        {tab === 'galvanic' && <GalvanicCellSimulation />}
        {tab === 'electrolytic' && <ElectrolyticCellSimulation />}
        {tab === 'redox' && <RedoxVisualizer />}
      </GlassCard>
    </div>
  )
}
