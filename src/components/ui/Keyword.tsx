import { Tooltip } from './Tooltip'

type Props = { term: string; hint: string }

/** Highlighted term with hover explanation (lightweight “hover theory”). */
export function Keyword({ term, hint }: Props) {
  return (
    <Tooltip content={hint}>
      <span className="cursor-help border-b border-dotted border-cyan-400/60 text-cyan-200 decoration-cyan-400/50">
        {term}
      </span>
    </Tooltip>
  )
}
