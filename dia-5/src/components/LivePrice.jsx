import Big from 'big.js'
import { useEffect, useRef } from 'react'
import { formatPrice } from '../lib/format'

export function LivePrice({ value }) {
  // useRef guarda algo entre renderizações SEM causar uma renderização nova
  const element = useRef(null)
  const previous = useRef(value)

  useEffect(() => {
    const before = previous.current
    previous.current = value
    if (!before || !value || before === value) return

    // Pisca verde se subiu, vermelho se desceu, e volta à cor normal
    const color = new Big(value).gt(before) ? 'var(--color-up)' : 'var(--color-down)'
    element.current?.animate([{ color }, {}], { duration: 900, easing: 'ease-out' })
  }, [value])

  if (!value) return <span className="text-muted">—</span>
  return (
    <span ref={element} className="tabular-nums">
      {formatPrice(value)}
    </span>
  )
}
