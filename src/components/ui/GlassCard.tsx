import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  glow?: 'cyan' | 'purple' | 'green'
}

const glowClass = {
  cyan: 'hover:shadow-glow hover:border-cyan-500/30',
  purple: 'hover:shadow-glow-purple hover:border-purple-500/30',
  green: 'hover:shadow-[0_0_40px_rgba(52,211,153,0.2)] hover:border-emerald-500/30',
}

export function GlassCard({ children, className = '', glow = 'cyan' }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`glass-panel p-5 transition-all duration-300 ${glowClass[glow]} ${className}`}
    >
      {children}
    </motion.div>
  )
}
