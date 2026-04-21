import { motion } from 'framer-motion'
import { useCallback, useRef, useState } from 'react'
import { GlassCard } from '../components/ui/GlassCard'

type Msg = { role: 'user' | 'assistant'; text: string }

async function askAssistant(message: string): Promise<string> {
  try {
    const res = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    if (!res.ok) throw new Error('bad status')
    const data = (await res.json()) as { reply: string }
    return data.reply
  } catch {
    return offlineFallback(message)
  }
}

function offlineFallback(message: string) {
  const m = message.toLowerCase()
  if (m.includes('nernst'))
    return 'Nernst form: E = E° − (RT/nF) ln Q. Rises when Q drops (more reactants), all else equal. Wire this to ΔG = −nFE.'
  if (m.includes('galvanic') || m.includes('cell'))
    return 'Galvanic cells convert chemical spontaneity (ΔG<0) into electrical work; electrons travel external anode→cathode through load/voltmeter; ions migrate internally.'
  if (m.includes('pourbaix'))
    return 'Pourbaix plots map stable phases vs E and pH. Compare your operating point to immunity vs active corrosion domains—remember kinetics can delay predicted oxides.'
  if (m.includes('salt bridge'))
    return 'Salt bridges preserve electroneutrality by ion migration without large junction potentials in this idealized model; a porous barrier separates reservoirs physically.'
  return 'Backend offline—showing local heuristics. Start the Express server and POST /api/assistant for richer context-aware replies from the platform model.'
}

export function AIAssistantPage() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      text: 'Ask about cells, corrosion, Nernst math, or battery mechanisms—I will answer stepwise with equations where helpful.',
    },
  ])
  const [loading, setLoading] = useState(false)
  const bottom = useRef<HTMLDivElement>(null)

  const send = useCallback(async () => {
    const q = input.trim()
    if (!q || loading) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text: q }])
    setLoading(true)
    const reply = await askAssistant(q)
    setMessages((m) => [...m, { role: 'assistant', text: reply }])
    setLoading(false)
    queueMicrotask(() => bottom.current?.scrollIntoView({ behavior: 'smooth' }))
  }, [input, loading])

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-white">AI assistant panel</h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          The Express router hosts a lightweight electrochemistry tutor (offline fallbacks if the API is unreachable).
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <GlassCard className="flex min-h-[460px] flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            {messages.map((m, i) => (
              <motion.div
                key={`${m.role}-${i}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-[90%] rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'ml-auto border-cyan-500/30 bg-cyan-500/10 text-cyan-50'
                    : 'border-white/10 bg-slate-950/70 text-slate-200'
                }`}
              >
                {m.text}
              </motion.div>
            ))}
            {loading && <div className="text-xs text-slate-500">Thinking…</div>}
            <div ref={bottom} />
          </div>
          <div className="mt-4 flex gap-2 border-t border-white/10 pt-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={2}
              placeholder="e.g., Walk me through balancing the Zn/Cu voltaic half-reactions"
              className="flex-1 resize-none rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-500/0 focus:ring-2 focus:ring-cyan-500/40"
            />
            <button
              type="button"
              onClick={send}
              disabled={loading}
              className="self-end rounded-xl bg-gradient-to-br from-cyan-500/90 to-fuchsia-600/90 px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </GlassCard>

        <GlassCard glow="green" className="space-y-3 text-sm text-slate-300">
          <h2 className="text-lg font-semibold text-white">Session hints</h2>
          <ul className="list-inside list-disc space-y-2 text-slate-400">
            <li>Anchor questions with context (cell type, concentrations).</li>
            <li>Ask for derivations: Nernst from reaction quotient.</li>
            <li>Use quizzes to test recall, then ask the assistant to explain misses.</li>
          </ul>
        </GlassCard>
      </div>
    </div>
  )
}
