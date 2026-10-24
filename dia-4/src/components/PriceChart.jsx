import Big from 'big.js'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useCandles } from '../hooks/useCandles'
import { RANGES } from '../lib/binance'
import { formatPrice } from '../lib/format'
import { Change } from './Change'
import { LivePrice } from './LivePrice'

// O Recharts escreve as cores como atributos SVG, que não leem var(--...)
const UP = 'oklch(0.8 0.18 152)'
const DOWN = 'oklch(0.72 0.17 40)'

const RANGE_LABELS = { '1D': '1 dia', '7D': '7 dias', '30D': '30 dias' }

export function PriceChart({ coin, live, range, onRangeChange }) {
  const { candles, status } = useCandles(coin.pair, range)

  const first = candles[0]?.price
  const last = candles[candles.length - 1]?.price
  const rangePercent = first ? new Big(last).minus(first).div(first).times(100) : null
  const color = rangePercent?.lt(0) ? DOWN : UP

  return (
    <section aria-labelledby="chart-title" className="mt-10">
      <div className="flex items-center gap-3">
        <img src={coin.logo} alt="" className="size-9" />
        <div>
          <h2 id="chart-title" className="font-medium">
            {coin.name} <span className="text-muted">{coin.symbol}</span>
          </h2>
          <p className="flex flex-wrap items-center gap-x-2 text-sm">
            <LivePrice value={live?.price} />
            {rangePercent && (
              <>
                <Change percent={rangePercent} />
                <span className="text-muted">em {RANGE_LABELS[range]}</span>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="mt-4 h-64 sm:h-72">
        {status === 'loading' && <div className="h-full animate-pulse rounded-lg bg-surface" />}

        {status === 'error' && (
          <p className="flex h-full items-center justify-center rounded-lg bg-surface text-sm text-muted">
            Não foi possível carregar o histórico de {coin.name}.
          </p>
        )}

        {status === 'ready' && (
          <ResponsiveContainer width="100%" height="100%" className="motion-safe:animate-fade-in">
            <AreaChart data={candles} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis domain={['dataMin', 'dataMax']} hide />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'oklch(0.45 0.01 260)' }} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={color}
                strokeWidth={2}
                fill="url(#chart-fill)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-3 flex gap-1 border-b border-line" role="group" aria-label="Período do gráfico">
        {Object.keys(RANGES).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onRangeChange(key)}
            aria-pressed={range === key}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              range === key
                ? 'border-accent text-accent'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            {key}
          </button>
        ))}
      </div>
    </section>
  )
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { time, price } = payload[0].payload
  const date = new Date(time).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="rounded-md border border-line bg-raised px-3 py-2 text-sm shadow-lg">
      <p className="font-medium tabular-nums">{formatPrice(String(price))}</p>
      <p className="text-muted">{date}</p>
    </div>
  )
}
