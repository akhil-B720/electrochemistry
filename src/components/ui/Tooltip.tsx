import { AnimatePresence, motion } from 'framer-motion'
import { useState, type ReactNode } from 'react'

type Props = { content: string; children: ReactNode }

export function Tooltip({ content, children }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="pointer-events-none absolute left-1/2 top-full z-40 mt-2 w-64 -translate-x-1/2 rounded-lg border border-white/10 bg-slate-900/95 px-3 py-2 text-xs font-normal text-slate-200 shadow-xl backdrop-blur-md"
            role="tooltip"
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
