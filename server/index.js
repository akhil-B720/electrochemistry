/**
 * Lightweight Express tutor for electrochemistry.
 * Extensible: plug OpenAI/Anthropic here with the same /api/assistant contract.
 */
import cors from 'cors'
import express from 'express'

const app = express()
app.use(cors())
app.use(express.json({ limit: '32kb' }))

/** Expanded local heuristic — keyword + light structure to keep responses educational without an LLM. */
function tutorReply(message) {
  const m = message.toLowerCase()

  if (m.includes('nernst')) {
    return [
      '1) Write the balanced net reaction and reaction quotient Q with relative activities.',
      '2) Use E = E° − (RT/nF) ln Q (natural log). At 298 K you may swap to base-10 with 2.303 factor if preferred.',
      '3) Check units: R in J·mol⁻¹·K⁻¹, F in C·mol⁻¹, n as stoichiometric electron count for the reaction as written.',
    ].join('\n')
  }

  if (m.includes('galvanic') && m.includes('electron')) {
    return 'Electrons leave the anode (oxidation) through the external conductor toward the cathode (reduction). Internally, ions migrate and the salt bridge balances charge build-up.'
  }

  if (m.includes('pourbaix') || m.includes('corrosion')) {
    return 'Pourbaix diagrams outline thermodynamic domains. Compare your potential and pH to immunity vs dissolution boundaries—but remember localized cells and kinetics dominate real corrosion morphology.'
  }

  if (m.includes('li') && m.includes('battery')) {
    return 'Li-ion couples intercalation hosts: lithiation/delithiation potentials depend on staging, electrolyte, and SEI. Side reactions at high voltage windows mimic “efficiency loss” in the battery lab slider.'
  }

  return [
    'I can explain cells, Nernst math, corrosion maps, and battery intuition.',
    'Try: “Derive ΔG = −nFE from electrical work,” or “What does lowering Q do to E?”',
  ].join(' ')
}

app.post('/api/assistant', (req, res) => {
  const msg = typeof req.body?.message === 'string' ? req.body.message.trim() : ''
  if (!msg) {
    return res.status(400).json({ error: 'message required' })
  }
  const reply = tutorReply(msg)
  res.json({ reply })
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Electrochemistry API listening on http://localhost:${port}`)
})
