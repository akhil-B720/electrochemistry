import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { AnimatedBackground } from '../components/home/AnimatedBackground'
import { ElectrochemicalCell3D } from '../components/home/ElectrochemicalCell3D'
import { GlassCard } from '../components/ui/GlassCard'
import { RippleButton } from '../components/ui/RippleButton'

const MODULES = [
  { to: '/theory', title: 'Theory Hub', desc: 'Deep explanations, diagrams, expandable sections', glow: 'cyan' as const },
  { to: '/simulations', title: 'Simulations', desc: 'Galvanic, electrolytic & redox visualizations', glow: 'purple' as const },
  { to: '/virtual-lab', title: 'Virtual Lab', desc: 'Drag-drop cells, validation, live thermodynamics', glow: 'green' as const },
  { to: '/calculators', title: 'Calculators', desc: 'Nernst, ΔG, Ecell, conductivity', glow: 'cyan' as const },
  { to: '/data-viz', title: 'Data Visualization', desc: 'Interactive charts with zoom & tooltips', glow: 'purple' as const },
  { to: '/battery-lab', title: 'Battery Lab', desc: 'Li-ion & lead–acid charge curves', glow: 'green' as const },
  { to: '/corrosion', title: 'Corrosion & Pourbaix', desc: 'Zone diagrams for Fe, Zn, Cu', glow: 'cyan' as const },
  { to: '/quiz', title: 'Quiz Mode', desc: 'MCQs, scenarios, instant feedback', glow: 'purple' as const },
  { to: '/assistant', title: 'AI Assistant', desc: 'Step-by-step tutoring API', glow: 'green' as const },
]

export function HomePage() {
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 400], [0, 80])
  const opacity = useTransform(scrollY, [0, 300], [1, 0.35])

  return (
    <div className="relative">
      <AnimatedBackground />

      <section className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <motion.div style={{ y: heroY, opacity }} className="space-y-6">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-cyan-400/90">Electrochemistry OS</p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
            Simulate, explore, and <span className="neon-text">master</span> redox chemistry
          </h1>
          <p className="max-w-xl text-lg text-slate-400">
            A premium learning cockpit combining theory, 3D simulation, virtual instrumentation, and quantitative tools—built
            for students, instructors, and researchers who care about clarity and polish.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/simulations">
              <RippleButton>Launch Simulations</RippleButton>
            </Link>
            <Link to="/virtual-lab">
              <RippleButton variant="ghost">Open Virtual Lab</RippleButton>
            </Link>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <div>
              <div className="font-mono text-2xl text-cyan-300">10</div>
              <div>integrated modules</div>
            </div>
            <div>
              <div className="font-mono text-2xl text-fuchsia-300">3D</div>
              <div>reactive visuals</div>
            </div>
            <div>
              <div className="font-mono text-2xl text-emerald-300">Live</div>
              <div>thermo & kinetics</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <ElectrochemicalCell3D />
        </motion.div>
      </section>

      <section id="modules" className="relative mt-24 scroll-mt-28">
        <div className="mb-10 flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">Mission control</h2>
          <p className="text-slate-400">Jump into any subsystem—each route is wired for rich interaction and feedback.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {MODULES.map((m, i) => (
            <Link key={m.to} to={m.to} className="group block outline-none">
              <GlassCard glow={m.glow} className="h-full hover:-translate-y-1">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{m.title}</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-cyan-300/90">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-sm text-slate-400">{m.desc}</p>
                <div className="mt-4 text-xs font-medium text-cyan-400/80 opacity-0 transition-opacity group-hover:opacity-100">
                  Enter module →
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
