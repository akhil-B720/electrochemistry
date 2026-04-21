import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { GlassCard } from '../components/ui/GlassCard'

type Q =
  | { id: string; type: 'mcq'; prompt: string; choices: string[]; answer: number; explain: string }
  | { id: string; type: 'scenario'; prompt: string; choices: string[]; answer: number; explain: string }

const BANK: Q[] = [
  {
    id: 'nernst-q',
    type: 'mcq',
    prompt: 'Which change increases the driving voltage of a galvanic cell according to the Nernst equation (other factors fixed)?',
    choices: [
      'Increase product activities relative to reactants (Q larger)',
      'Decrease temperature while holding Q constant',
      'Decrease Q (reactant-heavy quotient)',
      'Add a salt bridge blocker',
    ],
    answer: 2,
    explain: 'E = E° − (RT/nF) ln Q. Smaller Q (more reactant-driven) makes ln Q more negative, raising E.',
  },
  {
    id: 'anode-id',
    type: 'mcq',
    prompt: 'In a spontaneous Zn||Cu cell under standard conditions, which metal is the anode?',
    choices: ['Cu', 'Zn', 'Both', 'Neither'],
    answer: 1,
    explain: 'Zinc has the lower (more negative) reduction potential, so it oxidizes—anode in a galvanic cell.',
  },
  {
    id: 'scenario-fead',
    type: 'scenario',
    prompt: 'Two bolts—one Fe, one Cu—are coupled in seawater. Where is the primary anodic attack expected?',
    choices: [
      'Cu bolt (higher E° couples as cathode most often)',
      'Fe bolt (more active metal)',
      'Equal attack on both',
      'Attack only in air above waterline',
    ],
    answer: 1,
    explain: 'Cu is more noble; Fe becomes the sacrificial anode in this galvanic couple.',
  },
]

export function QuizPage() {
  const [idx, setIdx] = useState(0)
  const [choice, setChoice] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle')

  const q = BANK[idx]

  const progress = useMemo(() => ((idx + 1) / BANK.length) * 100, [idx])

  function submit() {
    if (choice === null || feedback !== 'idle') return
    if (choice === q.answer) {
      setFeedback('correct')
      setScore((s) => s + 1)
    } else setFeedback('wrong')
  }

  function next() {
    setChoice(null)
    setFeedback('idle')
    setIdx((i) => (i + 1) % BANK.length)
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-white">Quiz & learning mode</h1>
        <p className="mt-2 max-w-2xl text-slate-400">Instant feedback with reasoning—score persists within the session.</p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-400">
        <div>
          Score: <span className="font-mono text-cyan-300">{score}</span>
        </div>
        <div className="h-2 w-48 overflow-hidden rounded-full bg-slate-800">
          <motion.div className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500" animate={{ width: `${progress}%` }} />
        </div>
      </div>

      <GlassCard>
        <div className="mb-2 text-xs uppercase tracking-widest text-slate-500">
          {q.type === 'scenario' ? 'Scenario' : 'MCQ'} · {idx + 1}/{BANK.length}
        </div>
        <h2 className="text-xl font-semibold text-white">{q.prompt}</h2>
        <div className="mt-5 space-y-3">
          {q.choices.map((c, i) => (
            <button
              key={c}
              type="button"
              onClick={() => feedback === 'idle' && setChoice(i)}
              className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                choice === i ? 'border-cyan-400/60 bg-cyan-500/10 text-cyan-50' : 'border-white/10 bg-slate-950/50 text-slate-300 hover:border-white/20'
              }`}
            >
              <span className="font-mono text-xs text-slate-500">{String.fromCharCode(65 + i)}.</span>
              <span>{c}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={choice === null || feedback !== 'idle'}
            onClick={submit}
            className="rounded-xl bg-gradient-to-r from-cyan-600/80 to-fuchsia-600/80 px-5 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            Check answer
          </button>
          <button type="button" onClick={next} className="rounded-xl border border-white/15 px-5 py-2 text-sm text-slate-200 hover:bg-white/5">
            Next / rotate bank
          </button>
        </div>

        <AnimatePresence>
          {feedback !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-6 rounded-xl border px-4 py-3 text-sm ${
                feedback === 'correct' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100' : 'border-amber-500/40 bg-amber-500/10 text-amber-100'
              }`}
            >
              {feedback === 'correct' ? 'Correct.' : 'Not quite—but here is the reasoning:'} {q.explain}
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </div>
  )
}
