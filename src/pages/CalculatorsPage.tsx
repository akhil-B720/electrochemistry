import { useMemo, useState } from 'react'
import { GlassCard } from '../components/ui/GlassCard'
import { F, R } from '../data/constants'
import {
  METALS,
  STANDARD_POTENTIALS,
  potentialKeyForMetal,
  deltaG0KJ,
  standardCellPotential,
  type MetalId,
} from '../data/electrochemistry'

function NernstCalc() {
  const [e0, setE0] = useState(1.1)
  const [n, setN] = useState(2)
  const [Q, setQ] = useState(0.1)
  const [T, setT] = useState(298)
  const E = useMemo(() => e0 - ((R * T) / (n * F)) * Math.log(Q), [e0, n, Q, T])
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        <code className="text-cyan-200">E = E° − (RT/nF) ln Q</code>. Uses natural logarithm; Q is dimensionless for your chosen reference states.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="E° (V)" value={e0} onChange={setE0} min={-4} max={4} step={0.001} />
        <Field label="n (electrons)" value={n} onChange={setN} min={1} max={8} step={1} />
        <Field label="Q (reaction quotient)" value={Q} onChange={setQ} min={1e-9} max={1e9} step={0.01} />
        <Field label="T (K)" value={T} onChange={setT} min={200} max={500} step={1} />
      </div>
      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 font-mono text-cyan-100">
        E = {E.toFixed(5)} V
      </div>
    </div>
  )
}

function GibbsCalc() {
  const [n, setN] = useState(2)
  const [E, setE] = useState(1.1)
  const dG = useMemo(() => -n * F * E, [n, E])
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="n" value={n} onChange={setN} min={1} max={8} step={1} />
        <Field label="Ecell (V)" value={E} onChange={setE} min={-5} max={5} step={0.001} />
      </div>
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 font-mono text-emerald-100">
        ΔG = {dG.toFixed(1)} J/mol ≈ {(dG / 1000).toFixed(3)} kJ/mol
      </div>
    </div>
  )
}

function CellPotentialCalc() {
  const [a, setA] = useState<MetalId>('Zn')
  const [c, setC] = useState<MetalId>('Cu')
  const E = useMemo(() => standardCellPotential(a, c), [a, c])
  const dG = useMemo(() => deltaG0KJ(METALS[a].n === METALS[c].n ? METALS[a].n : 2, E), [a, c, E])
  return (
    <div className="space-y-4 text-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-slate-300">
          Anode (oxidation)
          <select
            value={a}
            onChange={(e) => setA(e.target.value as MetalId)}
            className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950 px-2 py-2 text-cyan-100"
          >
            {(Object.keys(METALS) as MetalId[]).map((m) => (
              <option key={m} value={m}>
                {m} (E°={STANDARD_POTENTIALS[potentialKeyForMetal(m)].toFixed(2)} V)
              </option>
            ))}
          </select>
        </label>
        <label className="text-slate-300">
          Cathode (reduction)
          <select
            value={c}
            onChange={(e) => setC(e.target.value as MetalId)}
            className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950 px-2 py-2 text-fuchsia-100"
          >
            {(Object.keys(METALS) as MetalId[]).map((m) => (
              <option key={m} value={m}>
                {m} (E°={STANDARD_POTENTIALS[potentialKeyForMetal(m)].toFixed(2)} V)
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/5 p-4 font-mono text-fuchsia-100">
        E°cell = E°cathode − E°anode = {E.toFixed(3)} V · ΔG° ≈ {dG.toFixed(2)} kJ/mol (illustrative n)
      </div>
    </div>
  )
}

function ConductivityCalc() {
  const [cM, setCm] = useState(0.05)
  const [lambdaM, setLambdaM] = useState(120)
  const kappa = useMemo(() => (cM * lambdaM) / 1000, [cM, lambdaM])
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        κ ≈ c × Λm with c in mol/L and Λm in S·cm²/mol (debye–hückel not included—exploratory scale only).
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Concentration c (mol/L)" value={cM} onChange={setCm} min={0.0001} max={5} step={0.001} />
        <Field label="Λm (S·cm²/mol)" value={lambdaM} onChange={setLambdaM} min={1} max={400} step={1} />
      </div>
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 font-mono text-purple-100">
        κ ≈ {kappa.toFixed(5)} S/cm
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step: number
}) {
  return (
    <label className="block text-sm text-slate-300">
      {label}: <span className="font-mono text-white">{value}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-2 w-full accent-cyan-500"
      />
    </label>
  )
}

const TABS = [
  { id: 'nernst', label: 'Nernst', content: <NernstCalc /> },
  { id: 'gibbs', label: 'ΔG = −nFE', content: <GibbsCalc /> },
  { id: 'ecell', label: 'E°cell', content: <CellPotentialCalc /> },
  { id: 'cond', label: 'Conductivity', content: <ConductivityCalc /> },
] as const

export function CalculatorsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('nernst')
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-white">Quant engines</h1>
        <p className="mt-2 max-w-3xl text-slate-400">Sliders update continuously—use them to build intuition before exporting numbers.</p>
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
      <GlassCard glow="cyan">{TABS.find((x) => x.id === tab)?.content}</GlassCard>
    </div>
  )
}
