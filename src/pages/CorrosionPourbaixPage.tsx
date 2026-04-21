import type { ChartData, ChartOptions } from 'chart.js'
import { useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { GlassCard } from '../components/ui/GlassCard'

type Metal = 'Fe' | 'Zn' | 'Cu'

/** Schematic boundary slopes for teaching — not experimental atlas data. */
function boundaries(m: Metal): { label: string; data: { x: number; y: number }[]; color: string }[] {
  if (m === 'Fe') {
    return [
      {
        label: 'Fe²⁺ / Fe (HER family, schematic)',
        color: '#f87171',
        data: Array.from({ length: 15 }, (_, i) => ({ x: 2 + i * 0.6, y: -0.55 + i * 0.02 })),
      },
      {
        label: 'Fe₂O₃ passivation (illustrative)',
        color: '#fde047',
        data: Array.from({ length: 12 }, (_, i) => ({ x: 4 + i * 0.45, y: 0.35 - i * 0.01 })),
      },
    ]
  }
  if (m === 'Zn') {
    return [
      {
        label: 'Zn²⁺ / Zn',
        color: '#94a3b8',
        data: Array.from({ length: 14 }, (_, i) => ({ x: 2 + i * 0.55, y: -0.9 + i * 0.03 })),
      },
      {
        label: 'ZnO stability (schematic)',
        color: '#a78bfa',
        data: Array.from({ length: 12 }, (_, i) => ({ x: 5 + i * 0.35, y: -0.2 + i * 0.03 })),
      },
    ]
  }
  return [
    {
      label: 'Cu²⁺ / Cu',
      color: '#fb923c',
      data: Array.from({ length: 14 }, (_, i) => ({ x: 2 + i * 0.5, y: 0.1 + i * 0.015 })),
    },
    {
      label: 'Cu₂O (schematic)',
      color: '#22d3ee',
      data: Array.from({ length: 10 }, (_, i) => ({ x: 6 + i * 0.35, y: 0.4 - i * 0.02 })),
    },
  ]
}

export function CorrosionPourbaixPage() {
  const [metal, setMetal] = useState<Metal>('Fe')
  const curves = useMemo(() => boundaries(metal), [metal])

  const chartData: ChartData<'line', { x: number; y: number }[]> = useMemo(
    () => ({
      labels: [],
      datasets: curves.map((c) => ({
        label: c.label,
        data: c.data.map((p) => ({ x: p.x, y: p.y })),
        borderColor: c.color,
        backgroundColor: `${c.color}33`,
        showLine: true,
        parsing: false,
        pointRadius: 0,
        borderWidth: 2,
        tension: 0.25,
        fill: false,
      })),
    }),
    [curves],
  )

  const chartOpts: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#e2e8f0' } },
      tooltip: { mode: 'nearest' as const, intersect: false },
    },
    scales: {
      x: {
        type: 'linear' as const,
        title: { display: true, text: 'pH', color: '#94a3b8' },
        min: 0,
        max: 14,
        grid: { color: 'rgba(148,163,184,0.1)' },
        ticks: { color: '#94a3b8' },
      },
      y: {
        type: 'linear' as const,
        title: { display: true, text: 'E vs SHE (schematic V)', color: '#94a3b8' },
        min: -1.2,
        max: 1.2,
        grid: { color: 'rgba(148,163,184,0.1)' },
        ticks: { color: '#94a3b8' },
      },
    },
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-white">Corrosion & Pourbaix (schematic)</h1>
        <p className="mt-2 max-w-3xl text-slate-400">
          Region colors are didactic overlays; overlay your operating point (pH, potential) to reason about immunity, corrosion, and passivation trends.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {(['Fe', 'Zn', 'Cu'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMetal(m)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              metal === m ? 'bg-emerald-500/20 text-emerald-100 shadow-[0_0_30px_rgba(52,211,153,0.2)]' : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <GlassCard>
          <div className="relative h-[420px]">
            <Line data={chartData} options={chartOpts} />
          </div>
          <div className="mt-4 grid gap-3 text-xs text-slate-500 sm:grid-cols-3">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-emerald-100/90">Immunity: low E, reducing regime (qualitative)</div>
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-amber-100/90">Corrosion: ion-stable + oxidizing E band</div>
            <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3 text-cyan-100/90">Passivation: oxide/hydroxide film fields</div>
          </div>
        </GlassCard>

        <GlassCard glow="green" className="space-y-3 text-sm text-slate-300">
          <h2 className="text-lg font-semibold text-white">How to read this panel</h2>
          <p>
            Pourbaix diagrams map <strong className="text-white">stable species</strong> as a function of potential and pH. Steep lines often signal proton-coupled
            electron transfer; horizontal lines are pH-independent pure redox boundaries for idealized systems.
          </p>
          <p>
            Real surfaces show <strong className="text-white">kinetic metastability</strong>: predicted oxides may nucleate slowly; localized corrosion breaks 1D
            diagrams into spatially coupled micro-cells.
          </p>
          <p className="text-xs text-slate-500">Boundaries here are stylized for classroom reasoning—not for engineering design without validated thermodynamic input files.</p>
        </GlassCard>
      </div>
    </div>
  )
}
