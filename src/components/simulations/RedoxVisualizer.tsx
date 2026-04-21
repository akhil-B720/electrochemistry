import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'

const EXAMPLE = {
  title: 'Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s)',
  steps: [
    { label: 'Oxidation (anode)', eq: 'Zn(s) → Zn²⁺(aq) + 2e⁻' },
    { label: 'Reduction (cathode)', eq: 'Cu²⁺(aq) + 2e⁻ → Cu(s)' },
    { label: 'Net', eq: 'Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s)' },
  ],
}

export function RedoxVisualizer() {
  const [step, setStep] = useState(0)
  const progress = useMemo(() => (step / (EXAMPLE.steps.length - 1)) * 100, [step])

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4 text-center font-mono text-sm text-cyan-100">
        {EXAMPLE.title}
      </div>

      <div className="relative h-3 overflow-hidden rounded-full bg-slate-800">
        <motion.div className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500" animate={{ width: `${progress}%` }} />
      </div>

      <div className="flex flex-wrap gap-2">
        {EXAMPLE.steps.map((s, i) => (
          <button
            key={`${s.label}-${i}`}
            type="button"
            onClick={() => setStep(i)}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              step === i ? 'bg-cyan-500/25 text-cyan-100' : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            {i + 1}. {s.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          className="min-h-[120px] rounded-xl border border-white/10 bg-slate-950/70 p-6"
        >
          <div className="mb-2 text-xs uppercase tracking-widest text-slate-500">{EXAMPLE.steps[step].label}</div>
          <div className="font-mono text-lg text-fuchsia-100">{EXAMPLE.steps[step].eq}</div>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-2">
        <button
          type="button"
          className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/5"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          Back
        </button>
        <button
          type="button"
          className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/5"
          onClick={() => setStep((s) => Math.min(EXAMPLE.steps.length - 1, s + 1))}
        >
          Next half-reaction
        </button>
      </div>
    </div>
  )
}
