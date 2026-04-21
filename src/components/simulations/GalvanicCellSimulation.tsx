import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { Group } from 'three'
import { METALS, type MetalId } from '../../data/electrochemistry'

function Ion({
  start,
  end,
  color,
  offset,
}: {
  start: THREE.Vector3
  end: THREE.Vector3
  color: string
  offset: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  const curve = useMemo(() => new THREE.LineCurve3(start, end), [start, end])
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = ((clock.elapsedTime * 0.35 + offset) % 1 + 1) % 1
    const p = curve.getPoint(t)
    ref.current.position.copy(p)
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.05, 12, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
    </mesh>
  )
}

function HalfCell({ position, liquid }: { position: [number, number, number]; liquid: string }) {
  const g = useRef<Group>(null)
  return (
    <group ref={g} position={position}>
      <mesh>
        <cylinderGeometry args={[0.65, 0.65, 1.35, 40]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          transmission={0.55}
          thickness={0.5}
          roughness={0.12}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.55, 40]} />
        <meshStandardMaterial color={liquid} emissive={liquid} emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[0, 0.82, 0]}>
        <cylinderGeometry args={[0.09, 0.12, 0.45, 16]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* HTML overlay could label; keep 3D clean */}
      <mesh position={[0, -1.1, 0]}>
        <boxGeometry args={[1.4, 0.08, 1.4]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, 0.5, 0.66]}>
        <planeGeometry args={[1.1, 0.35]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={0} />
      </mesh>
    </group>
  )
}

function Bridge() {
  return (
    <group position={[0, 1.05, 0]} rotation={[0, 0, Math.PI / 2]}>
      <mesh>
        <capsuleGeometry args={[0.13, 1.8, 8, 20]} />
        <meshPhysicalMaterial color="#c4b5fd" transmission={0.45} roughness={0.25} transparent opacity={0.92} />
      </mesh>
    </group>
  )
}

function ElectronBeam({ on }: { on: boolean }) {
  const mesh = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!mesh.current) return
    mesh.current.visible = on
    const t = clock.elapsedTime
    mesh.current.scale.x = 0.6 + Math.sin(t * 4) * 0.06
  })
  return (
    <mesh ref={mesh} position={[0, 0.35, 0]}>
      <boxGeometry args={[2.4, 0.04, 0.04]} />
      <meshStandardMaterial color="#fde047" emissive="#facc15" emissiveIntensity={on ? 1.2 : 0} transparent opacity={0.9} />
    </mesh>
  )
}

export function GalvanicCellSimulation() {
  const [left, setLeft] = useState<MetalId>('Zn')
  const [right, setRight] = useState<MetalId>('Cu')
  const [showIons, setShowIons] = useState(true)
  const [showE, setShowE] = useState(true)

  const anodeColor = METALS[left].color
  const cathodeColor = METALS[right].color
  const startA = useMemo(() => new THREE.Vector3(-1.15, 0.5, 0), [])
  const endA = useMemo(() => new THREE.Vector3(1.15, 0.5, 0), [])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-2 text-slate-300">
          Anode metal
          <select
            value={left}
            onChange={(e) => setLeft(e.target.value as MetalId)}
            className="rounded-lg border border-white/15 bg-slate-950/80 px-2 py-1 text-cyan-100"
          >
            {(Object.keys(METALS) as MetalId[]).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-slate-300">
          Cathode metal
          <select
            value={right}
            onChange={(e) => setRight(e.target.value as MetalId)}
            className="rounded-lg border border-white/15 bg-slate-950/80 px-2 py-1 text-fuchsia-100"
          >
            {(Object.keys(METALS) as MetalId[]).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-slate-400">
          <input type="checkbox" checked={showE} onChange={() => setShowE(!showE)} />
          e⁻ flow
        </label>
        <label className="flex items-center gap-2 text-slate-400">
          <input type="checkbox" checked={showIons} onChange={() => setShowIons(!showIons)} />
          Ion shuttling (schematic)
        </label>
      </div>

      <div className="h-[420px] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 shadow-glow">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 1.8, 5.4]} fov={40} />
          <OrbitControls enableDamping />
          <ambientLight intensity={0.4} />
          <directionalLight position={[4, 8, 3]} intensity={1.1} />
          <HalfCell position={[-1.45, -0.2, 0]} liquid={anodeColor} />
          <HalfCell position={[1.45, -0.2, 0]} liquid={cathodeColor} />
          <Bridge />
          <ElectronBeam on={showE} />
          {showIons && (
            <>
              <Ion start={new THREE.Vector3(-1.15, 0.4, 0)} end={endA} color="#f472b6" offset={0} />
              <Ion start={startA} end={new THREE.Vector3(1.15, 0.4, 0)} color="#34d399" offset={0.5} />
            </>
          )}
        </Canvas>
      </div>
      <p className="text-xs text-slate-500">
        3D model is pedagogical: colors reflect chosen metals; quantitative E° values appear in calculators & virtual lab.
      </p>
    </div>
  )
}
