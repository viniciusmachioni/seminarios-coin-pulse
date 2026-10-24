import Big from 'big.js'
import { useOfficialDollar } from '../hooks/useOfficialDollar'
import { formatPrice } from '../lib/format'
import { Change } from './Change'

export function DollarCompare({ cryptoDollar }) {
  const { dollar, failed } = useOfficialDollar()

  const difference =
    cryptoDollar && dollar
      ? new Big(cryptoDollar).minus(dollar.rate).div(dollar.rate).times(100)
      : null

  const officialDate = dollar
    ? new Date(`${dollar.date}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    : null

  return (
    <section aria-labelledby="dollar-title" className="p-4">
      <h2 id="dollar-title" className="font-medium">
        Câmbio
      </h2>

      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-muted">Dólar cripto (USDT), ao vivo</dt>
          <dd className="tabular-nums">{cryptoDollar ? formatPrice(cryptoDollar) : '—'}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-muted">
            Dólar oficial{officialDate && `, ${officialDate}`}
          </dt>
          <dd className="tabular-nums">
            {dollar ? formatPrice(dollar.rate) : failed ? 'indisponível' : '—'}
          </dd>
        </div>
        {difference && (
          <div className="flex items-baseline justify-between gap-4 border-t border-line pt-2">
            <dt className="text-muted">Diferença</dt>
            <dd>
              <Change percent={difference} />
            </dd>
          </div>
        )}
      </dl>

      <p className="mt-3 text-xs leading-relaxed text-muted">
        O dólar cripto muda a cada segundo, conforme compra e venda na Binance. O oficial é a
        cotação de referência do Banco Central Europeu, atualizada uma vez por dia útil.
      </p>
    </section>
  )
}
