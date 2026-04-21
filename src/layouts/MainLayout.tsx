import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/theory', label: 'Theory Hub' },
  { to: '/simulations', label: 'Simulations' },
  { to: '/virtual-lab', label: 'Virtual Lab' },
  { to: '/calculators', label: 'Calculators' },
  { to: '/data-viz', label: 'Data Viz' },
  { to: '/battery-lab', label: 'Battery Lab' },
  { to: '/corrosion', label: 'Corrosion' },
  { to: '/quiz', label: 'Quiz' },
  { to: '/assistant', label: 'AI Assistant' },
] as const

export function MainLayout() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3">
          <NavLink to="/" className="group flex items-center gap-2">
            <motion.span
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-500/10 font-mono text-sm font-bold text-cyan-300 shadow-glow"
              whileHover={{ scale: 1.05 }}
            >
              e⁻
            </motion.span>
            <div>
              <div className="text-sm font-semibold tracking-tight text-white">ElectroLab</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Platform</div>
            </div>
          </NavLink>

          <nav className="flex flex-1 flex-wrap items-center justify-end gap-1 lg:gap-2">
            {NAV.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  [
                    'rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all lg:text-sm',
                    isActive ? 'bg-cyan-500/20 text-cyan-200 shadow-glow' : 'text-slate-400 hover:bg-white/5 hover:text-cyan-100',
                  ].join(' ')
                }
                end={to === '/'}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-[1600px] flex-1 px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-white/5 py-4 text-center text-xs text-slate-500">
        Educational electrochemistry sandbox · Standard potentials are simplified for learning
      </footer>
    </div>
  )
}
