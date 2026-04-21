import { useState } from 'react'

/** Stylized 2D electrolytic schematic with reverse electron sense vs galvanic. */
export function ElectrolyticCellSimulation() {
  const [voltage, setVoltage] = useState(1.8)

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm text-slate-300">
          Driving voltage: <span className="font-mono text-cyan-300">{voltage.toFixed(2)} V</span>
        </label>
        <input
          type="range"
          min={0.5}
          max={4}
          step={0.05}
          value={voltage}
          onChange={(e) => setVoltage(parseFloat(e.target.value))}
          className="w-full accent-fuchsia-500"
        />
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-fuchsia-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-fuchsia-950/40 p-8">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-6">
          <div className="space-y-2 text-sm text-slate-300">
            <div className="text-xs uppercase tracking-widest text-fuchsia-300">Power supply</div>
            <div className="rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 py-3 font-mono text-fuchsia-100">
              + {voltage.toFixed(2)} V
            </div>
            <p className="text-xs text-slate-500">Electrons pushed uphill—non-spontaneous redox becomes favorable.</p>
          </div>

          <svg viewBox="0 0 360 180" className="h-44 w-full max-w-md">
            <defs>
              <linearGradient id="e2" x1="0" x2="1">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
            <rect x="30" y="50" width="70" height="90" rx="8" fill="rgba(34,211,238,0.08)" stroke="rgba(34,211,238,0.5)" />
            <rect x="260" y="50" width="70" height="90" rx="8" fill="rgba(244,114,182,0.08)" stroke="rgba(244,114,182,0.5)" />
            <path d="M100 70 H160 Q 180 70 180 55 V 35 Q 180 20 200 20 H 250" fill="none" stroke="#94a3b8" strokeWidth="3" />
            <circle r="5" fill="url(#e2)">
              <animateMotion
                dur={`${3 / Math.max(voltage, 0.5)}s`}
                repeatCount="indefinite"
                path="M250,20 H200 Q180,20 180,35 V55 Q180,70 160,70 H100"
              />
            </circle>
            <text x="32" y="40" className="fill-cyan-200 text-[10px] font-mono">
              Cathode (−)
            </text>
            <text x="262" y="40" className="fill-fuchsia-200 text-[10px] font-mono">
              Anode (+)
            </text>
          </svg>
        </div>
      </div>
    </div>
  )
}
