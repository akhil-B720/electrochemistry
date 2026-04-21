import type { ReactNode } from 'react'

export type TheorySection = {
  id: string
  title: string
  summary: string
  body: ReactNode
  keywords?: { term: string; hint: string }[]
}

/** Structured theory content — JSX bodies keep diagrams/snippets modular. */
export const THEORY_TOPICS: TheorySection[] = [
  {
    id: 'basics',
    title: 'Electrochemistry basics',
    summary: 'The bridge between electron transfer and chemical change.',
    keywords: [
      { term: 'Redox', hint: 'Reactions where electrons move between species (reduction + oxidation).' },
      { term: 'Electrode', hint: 'Conductive surface where half-reactions occur.' },
    ],
    body: (
      <div className="space-y-3 text-slate-300">
        <p>
          Electrochemistry studies chemical change driven by—or coupled to—electric current. Charge conservation ties the
          anodic and cathodic half-reactions together; what happens at one electrode must be balanced by the other.
        </p>
        <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4 font-mono text-xs text-cyan-200/90">
          <div>Oxidation: species loses electrons (anode in galvanic cell)</div>
          <div>Reduction: species gains electrons (cathode in galvanic cell)</div>
        </div>
      </div>
    ),
  },
  {
    id: 'redox',
    title: 'Redox reactions & examples',
    summary: 'Track electrons explicitly—bookkeeping beats memorizing patterns.',
    body: (
      <div className="space-y-3 text-slate-300">
        <p>
          <strong className="text-white">Example:</strong> Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s). Zinc is oxidized (0 → +2),
          copper ion is reduced (+2 → 0). Net reaction couples two half-reactions with balanced charge and mass.
        </p>
      </div>
    ),
  },
  {
    id: 'leo-oil',
    title: 'LEO/GER & OIL-RIG',
    summary: 'Two mnemonics, same physics.',
    body: (
      <ul className="list-inside list-disc space-y-2 text-slate-300">
        <li>
          <strong className="text-emerald-300">LEO says GER:</strong> Lose Electrons = Oxidation; Gain Electrons = Reduction.
        </li>
        <li>
          <strong className="text-cyan-300">OIL-RIG:</strong> Oxidation Is Loss; Reduction Is Gain (of electrons).
        </li>
      </ul>
    ),
  },
  {
    id: 'cells',
    title: 'Electrochemical cells',
    summary: 'Galvanic vs electrolytic—same energy accounting, opposite driving force.',
    body: (
      <div className="grid gap-4 text-slate-300 md:grid-cols-2">
        <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/5 p-4">
          <h4 className="mb-2 font-semibold text-cyan-200">Galvanic (voltaic)</h4>
          <p>Spontaneous ΔG &lt; 0; chemical energy → electrical work. Salt bridge maintains electroneutrality.</p>
        </div>
        <div className="rounded-xl border border-fuchsia-500/25 bg-fuchsia-500/5 p-4">
          <h4 className="mb-2 font-semibold text-fuchsia-200">Electrolytic</h4>
          <p>Non-spontaneous driven by external voltage; electrical energy drives redox (electroplating, water splitting).</p>
        </div>
      </div>
    ),
  },
  {
    id: 'potential',
    title: 'Electrode & standard potentials',
    summary: 'Potentials quantify electron tendency versus the hydrogen reference.',
    body: (
      <p className="text-slate-300">
        The <strong className="text-white">standard hydrogen electrode (SHE)</strong> defines 0 V. More positive E° means
        stronger tendency to be reduced (better oxidizing agent in the paired sense).
      </p>
    ),
  },
  {
    id: 'series',
    title: 'Electrochemical series',
    summary: 'Ranked reduction potentials for comparative reasoning.',
    body: (
      <p className="text-slate-300">
        Metals below hydrogen in activity series often evolve H₂ in acid; placement reflects relative E° ordering (activity,
        kinetics, and passivation modify real behavior).
      </p>
    ),
  },
  {
    id: 'nernst',
    title: 'Nernst equation',
    summary: 'Concentration and temperature shift potentials away from standard state.',
    body: (
      <div className="space-y-3 text-slate-300">
        <p className="rounded-lg border border-white/10 bg-slate-950/80 p-4 text-center font-mono text-sm text-fuchsia-200">
          E = E° − (RT / nF) ln Q
        </p>
        <p>At 298.15 K, RT/F ≈ 0.025693 V; include stoichiometric exponents in reaction quotient Q.</p>
      </div>
    ),
  },
  {
    id: 'gibbs',
    title: 'Gibbs free energy relation',
    summary: 'ΔG ties cell voltage to reaction spontaneity.',
    body: (
      <p className="rounded-lg border border-white/10 bg-slate-950/80 p-4 font-mono text-sm text-emerald-200">
        ΔG = −nFE &nbsp;&nbsp; (per reaction as written)
      </p>
    ),
  },
  {
    id: 'batteries',
    title: 'Batteries (Li-ion, Pb–acid)',
    summary: 'Engineered interfaces, not ideal half-cells.',
    body: (
      <div className="space-y-2 text-slate-300">
        <p>
          <strong className="text-white">Li-ion:</strong> graphite ↔ layered oxide shuttles Li⁺ through electrolyte;
          voltage window and SEI chemistry dominate life.
        </p>
        <p>
          <strong className="text-white">Lead–acid:</strong> Pb + PbO₂ + 2H₂SO₄ ⇄ 2PbSO₄ + 2H₂O; acid concentration feeds
          open-circuit potential and rate capability.
        </p>
      </div>
    ),
  },
  {
    id: 'corrosion',
    title: 'Corrosion pathways',
    summary: 'Wet, dry, and electrochemical mechanisms.',
    body: (
      <p className="text-slate-300">
        Wet corrosion couples anodic metal dissolution to cathodic oxygen or proton reduction; differential aeration and
        galvanic pairing localize attack. Dry high-temperature oxidation grows oxide scales.
      </p>
    ),
  },
  {
    id: 'pourbaix',
    title: 'Pourbaix diagrams',
    summary: 'E–pH maps of stable species and corrosion immunity.',
    body: (
      <p className="text-slate-300">
        Superimpose metal/water equilibria: lines are thermodynamic boundaries; real kinetics may metastabilize phases.
      </p>
    ),
  },
  {
    id: 'conductivity',
    title: 'Conductivity & molar conductivity',
    summary: 'How ions and concentration shape solution resistance.',
    body: (
      <p className="text-slate-300">
        Molar conductivity Λm rises on dilution (ionic pairing weakens); strong electrolytes follow Kohlrausch trends; use
        Kohlrausch’s law to extrapolate Λm°.
      </p>
    ),
  },
]
