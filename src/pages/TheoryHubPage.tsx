import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { THEORY_TOPICS } from '../data/theoryTopics'
import { GlassCard } from '../components/ui/GlassCard'
import { Keyword } from '../components/ui/Keyword'

/** Interactive schematic: electron flow + half-cell labels (SVG, not to scale). */
function CellDiagram({ variant }: { variant: 'galvanic' | 'electrolytic' }) {
  const forward = variant === 'galvanic'
  return (
    <svg viewBox="0 0 420 200" className="h-auto w-full max-w-lg text-slate-200">
      <defs>
        <linearGradient id="wire" x1="0" x2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <rect x="20" y="40" width="90" height="110" fill="rgba(34,211,238,0.08)" stroke="rgba(34,211,238,0.45)" rx="8" />
      <rect x="310" y="40" width="90" height="110" fill="rgba(167,139,250,0.08)" stroke="rgba(167,139,250,0.45)" rx="8" />
      <text x="35" y="35" className="fill-cyan-200 text-[11px] font-mono">
        Anode (−)
      </text>
      <text x="325" y="35" className="fill-fuchsia-200 text-[11px] font-mono">
        Cathode (+)
      </text>
      <path
        d="M 115 70 H 200 Q 210 70 210 55 V 35 Q 210 20 220 20 H 300"
        fill="none"
        stroke="url(#wire)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle r="5" fill="#fde047">
        <animateMotion
          dur="3s"
          repeatCount="indefinite"
          path={forward ? 'M115,70 H200 Q210,70 210,55 V35 Q210,20 220,20 H300' : 'M300,20 H220 Q210,20 210,35 V55 Q210,70 200,70 H115'}
        />
      </circle>
      <text x="130" y="22" className="fill-slate-300 text-[10px] font-mono">
        e⁻ {forward ? '→' : '←'} salt bridge Ions ⇄
      </text>
    </svg>
  )
}

export function TheoryHubPage() {
  const [openId, setOpenId] = useState<string | null>('basics')

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-white">Theory hub</h1>
        <p className="mt-2 max-w-3xl text-slate-400">
          Expand each topic for structured explanations. Keywords expose instant micro-theory on hover.
        </p>
      </header>

      <GlassCard className="overflow-hidden">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Interactive reference schematic</h2>
            <p className="text-sm text-slate-400">Compare galvanic vs driven (electrolytic) electron sense in the external circuit.</p>
          </div>
          <div className="flex gap-2">
            <span className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">Galvanic</span>
            <span className="rounded-lg border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-1 text-xs text-fuchsia-200">Electrolytic</span>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <CellDiagram variant="galvanic" />
          </div>
          <div>
            <CellDiagram variant="electrolytic" />
          </div>
        </div>
      </GlassCard>

      <div className="space-y-3">
        {THEORY_TOPICS.map((topic) => {
          const open = openId === topic.id
          return (
            <GlassCard key={topic.id} className="overflow-hidden !p-0" glow="purple">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : topic.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-white/5"
              >
                <div>
                  <h3 className="text-lg font-medium text-white">{topic.title}</h3>
                  <p className="text-sm text-slate-400">{topic.summary}</p>
                  {topic.keywords && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {topic.keywords.map((k) => (
                        <Keyword key={k.term} term={k.term} hint={k.hint} />
                      ))}
                    </div>
                  )}
                </div>
                <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-cyan-300">
                  ⌄
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="border-t border-white/10"
                  >
                    <div className="space-y-4 px-5 py-4">{topic.body}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
