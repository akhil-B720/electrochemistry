import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { useMemo, useState, type ReactNode } from 'react'
import { METALS, STANDARD_POTENTIALS, deltaG0KJ, potentialKeyForMetal, standardCellPotential, type MetalId } from '../data/electrochemistry'
import { GlassCard } from '../components/ui/GlassCard'
import { useLabStore } from '../store/useLabStore'

type PaletteId = string

const PALETTE: { id: PaletteId; label: string; kind: 'electrode' | 'electrolyte' | 'bridge' | 'wire' | 'meter'; metal?: MetalId }[] = [
  { id: 'e-Zn', label: 'Zn electrode', kind: 'electrode', metal: 'Zn' },
  { id: 'e-Cu', label: 'Cu electrode', kind: 'electrode', metal: 'Cu' },
  { id: 'e-Fe', label: 'Fe electrode', kind: 'electrode', metal: 'Fe' },
  { id: 'e-Ag', label: 'Ag electrode', kind: 'electrode', metal: 'Ag' },
  { id: 'ely', label: 'Electrolyte (1 M)', kind: 'electrolyte' },
  { id: 'br', label: 'Salt bridge', kind: 'bridge' },
  { id: 'w', label: 'Wire', kind: 'wire' },
  { id: 'vm', label: 'Voltmeter', kind: 'meter' },
]

function DraggableChip({ id, label }: { id: PaletteId; label: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id })
  const style = transform ? { transform: `translate3d(${transform.x}px,${transform.y}px,0)` } : undefined

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      type="button"
      className={`rounded-xl border border-white/15 bg-slate-900/90 px-3 py-2 text-xs font-medium text-slate-200 shadow-md transition ${
        isDragging ? 'scale-95 opacity-70 ring-2 ring-cyan-400/50' : 'hover:bg-white/10'
      }`}
    >
      {label}
    </button>
  )
}

function DropZone({
  id,
  label,
  children,
  className,
}: {
  id: string
  label: string
  children?: ReactNode
  className?: string
}) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div
      ref={setNodeRef}
      className={`relative flex min-h-[88px] flex-col rounded-2xl border-2 border-dashed p-3 transition-colors ${
        isOver ? 'border-cyan-400/60 bg-cyan-500/10' : 'border-white/15 bg-slate-950/50'
      } ${className ?? ''}`}
    >
      <span className="mb-2 text-[10px] uppercase tracking-widest text-slate-500">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function findPalette(id: string | undefined) {
  return PALETTE.find((p) => p.id === id)
}

export function VirtualLabPage() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const { left, right, electrolyte, bridge, wire, meter, setLeft, setRight, setElectrolyte, setBridge, setWire, setMeter, error, setError, reset } =
    useLabStore()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const onDragStart = (e: DragStartEvent) => {
    setActiveId(String(e.active.id))
    setError(null)
  }

  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null)
    const item = findPalette(String(e.active.id))
    const overId = e.over?.id ? String(e.over.id) : null
    if (!item || !overId) return

    if (item.kind === 'electrode') {
      if (overId === 'zone-left') setLeft(item.metal!)
      else if (overId === 'zone-right') setRight(item.metal!)
      else setError('Drop metal electrodes onto the left or right beaker.')
      return
    }
    if (item.kind === 'electrolyte' && (overId === 'zone-left' || overId === 'zone-right')) {
      setElectrolyte(true)
      return
    }
    if (item.kind === 'bridge' && overId === 'zone-bridge') {
      setBridge(true)
      return
    }
    if (item.kind === 'wire' && overId === 'zone-meter') {
      setWire(true)
      return
    }
    if (item.kind === 'meter' && overId === 'zone-meter') {
      setMeter(true)
      return
    }
    setError('Invalid target for that component.')
  }

  const calc = useMemo(() => {
    if (left === null || right === null) return { ok: false as const, msg: 'Assign electrodes in both half-cells.' }
    if (!electrolyte) return { ok: false as const, msg: 'Add aqueous electrolyte (1 M ideal) to complete the cell interior.' }
    if (!bridge) return { ok: false as const, msg: 'Add a salt bridge for ionically connected half-cells.' }
    if (!wire || !meter) return { ok: false as const, msg: 'Wire the electrodes through the voltmeter (external circuit).' }

    const eL = STANDARD_POTENTIALS[potentialKeyForMetal(left)]
    const eR = STANDARD_POTENTIALS[potentialKeyForMetal(right)]
    const anode: MetalId = eL < eR ? left : right
    const cathode: MetalId = eL < eR ? right : left
    const Ecell = standardCellPotential(anode, cathode)
    const n = METALS[anode].n
    const dG = deltaG0KJ(n, Ecell)
    const spontaneous = Ecell > 0
    const rx = `${anode}(s) + ${METALS[cathode].ion}(aq) → ${METALS[anode].ion}(aq) + ${cathode}(s)`

    return { ok: true as const, anode, cathode, Ecell, dG, spontaneous, rx, n }
  }, [left, right, electrolyte, bridge, wire, meter])

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white">Virtual lab</h1>
          <p className="mt-2 max-w-2xl text-slate-400">
            Drag components into snap targets; the bench validates your cell before unlocking quantitative readouts.
          </p>
        </div>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
        >
          Reset bench
        </button>
      </header>

      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <GlassCard className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <DropZone id="zone-left" label="Left half-cell">
                <span className="text-xs text-slate-400">{left ? `${left}(s)` : 'No metal'}</span>
              </DropZone>
              <DropZone id="zone-right" label="Right half-cell">
                <span className="text-xs text-slate-400">{right ? `${right}(s)` : 'No metal'}</span>
              </DropZone>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <DropZone id="zone-bridge" label="Salt bridge">
                <span className="text-xs text-fuchsia-200/90">{bridge ? 'Installed' : 'Missing'}</span>
              </DropZone>
              <DropZone id="zone-meter" label="Circuit / meter">
                <div className="flex gap-3 text-xs text-slate-400">
                  <span>Wire: {wire ? '✓' : '—'}</span>
                  <span>Voltmeter: {meter ? '✓' : '—'}</span>
                </div>
              </DropZone>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-xs text-slate-500">
              Aqueous fill: {electrolyte ? '1 M ideal electrolyte in both beakers' : 'not yet poured'}
            </div>

            {error && (
              <motion.p
                initial={{ x: [0, -6, 6, -4, 4, 0] }}
                transition={{ duration: 0.4 }}
                className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200"
              >
                {error}
              </motion.p>
            )}
          </GlassCard>

          <GlassCard glow="green" className="h-fit space-y-4">
            <div className="text-xs uppercase tracking-widest text-slate-500">Palette</div>
            <div className="flex flex-wrap gap-2">
              {PALETTE.map((p) => (
                <DraggableChip key={p.id} id={p.id} label={p.label} />
              ))}
            </div>
          </GlassCard>
        </div>

        <DragOverlay>{activeId ? <div className="rounded-lg bg-cyan-500/30 px-3 py-1 text-xs text-white">Dragging…</div> : null}</DragOverlay>
      </DndContext>

      <GlassCard>
        <h2 className="mb-4 text-lg font-semibold text-white">Readouts</h2>
        {!calc.ok && <p className="text-sm text-amber-200/90">{calc.msg}</p>}
        {calc.ok && (
          <div className="grid gap-4 font-mono text-sm md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
              <div className="text-xs uppercase text-slate-500">Net (conceptual)</div>
              <div className="mt-2 text-cyan-100">{calc.rx}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
              <div className="text-xs uppercase text-slate-500">Standard stack (ideal)</div>
              <div className="mt-2 space-y-1 text-slate-200">
                <div>
                  E°cell ≈ <span className="text-fuchsia-300">{calc.Ecell.toFixed(3)} V</span>
                </div>
                <div>
                  ΔG° ≈ <span className="text-emerald-300">{calc.dG.toFixed(2)} kJ/mol</span> (n = {calc.n})
                </div>
                <div>
                  Spontaneous (standard):{' '}
                  <span className={calc.spontaneous ? 'text-emerald-400' : 'text-red-400'}>
                    {calc.spontaneous ? 'yes (E° > 0)' : 'no'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
