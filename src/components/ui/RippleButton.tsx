import { motion } from 'framer-motion'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'ghost'
}

export function RippleButton({ children, className = '', variant = 'primary', ...rest }: Props) {
  const base =
    variant === 'primary'
      ? 'rounded-xl bg-gradient-to-r from-cyan-600/80 to-fuchsia-600/80 px-5 py-2.5 font-medium text-white shadow-lg hover:from-cyan-500 hover:to-fuchsia-500'
      : 'rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 font-medium text-slate-200 hover:bg-white/10'

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden ripple ${base} ${className}`}
      {...rest}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
