/**
 * Standard reduction potentials E° (V) vs SHE at 25°C — educational subset.
 * Used by virtual lab, calculators, and quizzes.
 */
export const STANDARD_POTENTIALS: Record<string, number> = {
  'Li+': -3.04,
  Zn2: -0.76,
  Fe2: -0.44,
  Cu2: 0.34,
  'Ag+': 0.8,
  H: 0,
}

export type MetalId = 'Zn' | 'Cu' | 'Fe' | 'Ag'

export const METALS: Record<
  MetalId,
  { name: string; symbol: string; ion: string; n: number; color: string }
> = {
  Zn: { name: 'Zinc', symbol: 'Zn', ion: 'Zn²⁺', n: 2, color: '#94a3b8' },
  Cu: { name: 'Copper', symbol: 'Cu', ion: 'Cu²⁺', n: 2, color: '#ea580c' },
  Fe: { name: 'Iron', symbol: 'Fe', ion: 'Fe²⁺', n: 2, color: '#78716c' },
  Ag: { name: 'Silver', symbol: 'Ag', ion: 'Ag⁺', n: 1, color: '#cbd5e1' },
}

/** Map metal to reduction half-cell key used in STANDARD_POTENTIALS */
export function potentialKeyForMetal(m: MetalId): keyof typeof STANDARD_POTENTIALS {
  switch (m) {
    case 'Zn':
      return 'Zn2'
    case 'Cu':
      return 'Cu2'
    case 'Fe':
      return 'Fe2'
    case 'Ag':
      return 'Ag+'
  }
}

/**
 * Galvanic: cathode = higher E°, anode = lower E°.
 * E°cell = E°cathode − E°anode
 */
export function standardCellPotential(anode: MetalId, cathode: MetalId): number {
  const Ean = STANDARD_POTENTIALS[potentialKeyForMetal(anode)]
  const Ecat = STANDARD_POTENTIALS[potentialKeyForMetal(cathode)]
  return Ecat - Ean
}

/** ΔG° = −n F E°cell  (J/mol); F = 96485 C/mol */
export function deltaG0Joules(n: number, Ecell: number): number {
  const F = 96485
  return -n * F * Ecell
}

export function deltaG0KJ(n: number, Ecell: number): number {
  return deltaG0Joules(n, Ecell) / 1000
}
