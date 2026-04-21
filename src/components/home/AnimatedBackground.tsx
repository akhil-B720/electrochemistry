import { motion } from 'framer-motion'

/** Floating particles + soft gradients for a futuristic electrochemistry backdrop. */
export function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[size:48px_48px] bg-grid-glow opacity-40" />
      {[...Array(18)].map((_, i) => (
        <motion.span
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          className="absolute h-1 w-1 rounded-full bg-cyan-400/40"
          style={{
            left: `${(i * 17) % 100}%`,
            top: `${(i * 23) % 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 4 + (i % 5),
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
      <motion.div
        className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 8, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div
        className="absolute -right-10 bottom-10 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
    </div>
  )
}
