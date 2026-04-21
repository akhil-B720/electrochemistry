import { create } from 'zustand'
import type { MetalId } from '../data/electrochemistry'

type State = {
  left: MetalId | null
  right: MetalId | null
  electrolyte: boolean
  bridge: boolean
  wire: boolean
  meter: boolean
  error: string | null
  setLeft: (m: MetalId | null) => void
  setRight: (m: MetalId | null) => void
  setElectrolyte: (v: boolean) => void
  setBridge: (v: boolean) => void
  setWire: (v: boolean) => void
  setMeter: (v: boolean) => void
  setError: (m: string | null) => void
  reset: () => void
}

export const useLabStore = create<State>((set) => ({
  left: null,
  right: null,
  electrolyte: false,
  bridge: false,
  wire: false,
  meter: false,
  error: null,
  setLeft: (left) => set({ left, error: null }),
  setRight: (right) => set({ right, error: null }),
  setElectrolyte: (electrolyte) => set({ electrolyte, error: null }),
  setBridge: (bridge) => set({ bridge, error: null }),
  setWire: (wire) => set({ wire, error: null }),
  setMeter: (meter) => set({ meter, error: null }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      left: null,
      right: null,
      electrolyte: false,
      bridge: false,
      wire: false,
      meter: false,
      error: null,
    }),
}))
