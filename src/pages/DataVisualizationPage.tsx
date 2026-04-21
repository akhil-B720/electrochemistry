import { useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { GlassCard } from '../components/ui/GlassCard'
import { F, R } from '../data/constants'

function useVoltageVsConc() {
  const [e0, setE0] = useState(1.1)
  const [n, setN] = useState(2)
  const xs = useMemo(() => {
    const pts: number[] = []
    for (let i = -3; i <= 1; i += 0.1) pts.push(Math.pow(10, i))
    return pts
  }, [])
  const data = useMemo(() => {
    const T = 298
    return {
      labels: xs.map((c) => c.toExponential(1)),
      datasets: [
        {
          label: 'E (Nernst, Q = [red]/[ox] illustrative)',
          data: xs.map((Q) => e0 - ((R * T) / (n * F)) * Math.log(Q)),
          borderColor: '#22d3ee',
          backgroundColor: 'rgba(34,211,238,0.15)',
          fill: true,
          tension: 0.3,
          pointRadius: 0,
        },
      ],
    }
  }, [e0, n, xs])

  return { data, e0, setE0, n, setN }
}

function useConductivityCurve() {
  const [c0, setC0] = useState(1)
  const cs = useMemo(() => {
    const out: number[] = []
    for (let i = 0.05; i <= c0; i += c0 / 30) out.push(i)
    return out
  }, [c0])
  const data = useMemo(
    () => ({
      labels: cs.map((c) => c.toFixed(2)),
      datasets: [
        {
          label: 'κ (arb. Λm scaling)',
          data: cs.map((c) => c * (120 + 30 * Math.sqrt(c0 - c + 1e-6))),
          borderColor: '#a78bfa',
          backgroundColor: 'rgba(167,139,250,0.12)',
          fill: true,
          tension: 0.35,
          pointRadius: 0,
        },
      ],
    }),
    [c0, cs],
  )
  return { data, c0, setC0 }
}

function useArrheniusStyle() {
  const [ea, setEa] = useState(45)
  const Ts = useMemo(() => {
    const t: number[] = []
    for (let T = 280; T <= 360; T += 2) t.push(T)
    return t
  }, [])
  const data = useMemo(() => {
    const A = 1e11
    return {
      labels: Ts.map((T) => `${T}`),
      datasets: [
        {
          label: 'Relative rate ∝ exp(−Ea/RT) (model)',
          data: Ts.map((T) => A * Math.exp(-(ea * 1000) / (R * T))),
          borderColor: '#34d399',
          backgroundColor: 'rgba(52,211,153,0.12)',
          fill: true,
          tension: 0.35,
          pointRadius: 0,
        },
      ],
    }
  }, [Ts, ea, R])

  return { data, ea, setEa }
}

export function DataVisualizationPage() {
  const v = useVoltageVsConc()
  const c = useConductivityCurve()
  const a = useArrheniusStyle()

  const opts = {
    responsive: true,
    plugins: { legend: { labels: { color: '#e2e8f0' } } },
    scales: {
      x: { ticks: { color: '#94a3b8', maxTicksLimit: 8 }, grid: { color: 'rgba(148,163,184,0.1)' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.1)' } },
    },
  } as const

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-white">Data visualization</h1>
        <p className="mt-2 max-w-3xl text-slate-400">
          Zoom/pan with pointer drag (Chart.js); tooltips track the curve live while you tune parameters.
        </p>
      </header>

      <GlassCard>
        <h2 className="mb-2 text-lg font-semibold text-white">Voltage vs concentration (Nernst shape)</h2>
        <div className="mb-4 grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-300">
            E°: {v.e0.toFixed(3)} V
            <input
              type="range"
              min={0}
              max={2}
              step={0.01}
              value={v.e0}
              onChange={(e) => v.setE0(parseFloat(e.target.value))}
              className="mt-2 w-full accent-cyan-500"
            />
          </label>
          <label className="text-sm text-slate-300">
            n: {v.n}
            <input
              type="range"
              min={1}
              max={6}
              step={1}
              value={v.n}
              onChange={(e) => v.setN(parseInt(e.target.value, 10))}
              className="mt-2 w-full accent-cyan-500"
            />
          </label>
        </div>
        <div className="h-[320px]">
          <Line data={v.data} options={opts} />
        </div>
      </GlassCard>

      <GlassCard glow="purple">
        <h2 className="mb-2 text-lg font-semibold text-white">Conductivity vs dilution path (schematic)</h2>
        <label className="mb-4 block text-sm text-slate-300">
          Max c: {c.c0.toFixed(2)} mol/L
          <input
            type="range"
            min={0.2}
            max={2}
            step={0.05}
            value={c.c0}
            onChange={(e) => c.setC0(parseFloat(e.target.value))}
            className="mt-2 w-full accent-fuchsia-500"
          />
        </label>
        <div className="h-[320px]">
          <Line data={c.data} options={opts} />
        </div>
      </GlassCard>

      <GlassCard glow="green">
        <h2 className="mb-2 text-lg font-semibold text-white">Temperature vs relative rate (Arrhenius-style)</h2>
        <label className="mb-4 block text-sm text-slate-300">
          Ea: {a.ea} kJ/mol
          <input
            type="range"
            min={10}
            max={90}
            step={1}
            value={a.ea}
            onChange={(e) => a.setEa(parseFloat(e.target.value))}
            className="mt-2 w-full accent-emerald-500"
          />
        </label>
        <div className="h-[320px]">
          <Line data={a.data} options={opts} />
        </div>
      </GlassCard>
    </div>
  )
}
