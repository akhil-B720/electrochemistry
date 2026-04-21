import { Canvas, useFrame } from '@react-three/fiber'
import { Line, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import type { Group } from 'three'
import * as THREE from 'three'

function Beaker({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<Group>(null)
  return (
    <group ref={ref} position={position}>
      <mesh>
        <cylinderGeometry args={[0.55, 0.55, 1.2, 32]} />
        <meshPhysicalMaterial
          color={color}
          transmission={0.65}
          thickness={0.4}
          roughness={0.15}
          metalness={0}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.52, 0.52, 0.5, 32]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#0369a1" emissiveIntensity={0.35} />
      </mesh>
    </group>
  )
}

function SaltBridge() {
  return (
    <group position={[0, 0.9, 0]} rotation={[0, 0, Math.PI / 2]}>
      <mesh>
        <capsuleGeometry args={[0.12, 1.6, 8, 16]} />
        <meshPhysicalMaterial
          color="#a78bfa"
          transmission={0.5}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  )
}

function ElectronArc() {
  const meshRef = useRef<THREE.Mesh>(null)
  const points = useMemo(() => {
    const pts: [number, number, number][] = []
    for (let i = 0; i <= 40; i++) {
      const t = (i / 40) * Math.PI
      pts.push([-1.1 + (2.2 * i) / 40, 0.45 + Math.sin(t) * 0.38, 0])
    }
    return pts
  }, [])

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = (clock.elapsedTime * 0.7) % 1
      const idx = Math.floor(t * (points.length - 1))
      const p = points[idx]
      meshRef.current.position.set(p[0], p[1], p[2])
    }
  })

  return (
    <group>
      <Line points={points} color="#fbbf24" lineWidth={2} opacity={0.55} transparent />
      <mesh ref={meshRef} position={points[0]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#fde047" emissive="#facc15" emissiveIntensity={1.2} />
      </mesh>
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 4]} intensity={1.2} color="#e0f2fe" />
      <pointLight position={[-3, 2, 2]} intensity={0.8} color="#a78bfa" />
      <Beaker position={[-1.4, -0.2, 0]} color="#22d3ee" />
      <Beaker position={[1.4, -0.2, 0]} color="#c084fc" />
      <SaltBridge />
      <ElectronArc />
      <mesh position={[-1.4, 0.85, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.35, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[1.4, 0.85, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.35, 16]} />
        <meshStandardMaterial color="#ea580c" metalness={0.85} roughness={0.28} />
      </mesh>
    </>
  )
}

/** 3D rotating galvanic-style cell preview for the landing page. */
export function ElectrochemicalCell3D() {
  return (
    <div className="relative h-[min(420px,55vh)] w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 shadow-glow">
      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 1.6, 5.2]} fov={42} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.9} />
        <Scene />
      </Canvas>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 to-transparent py-3 text-center text-xs text-cyan-200/80">
        Drag to rotate · Auto-spin enabled
      </div>
    </div>
  )
}
