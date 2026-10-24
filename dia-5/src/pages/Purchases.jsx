import Big from 'big.js'
import { Link, useSearchParams } from 'react-router-dom'
import { PurchaseTable } from '../components/PurchaseTable'
import { COINS } from '../data/coins'
import { formatBRL } from '../lib/format'
import { ORDERS, sortPurchases } from '../lib/purchases'

const selectClass =
  'mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-ink hover:border-muted/60 focus:border-accent focus:outline-none'

export function Purchases({ purchases, prices, onRemove }) {
  // O filtro mora na URL: /compras?moeda=BTC&ordem=maior
  const [searchParams, setSearchParams] = useSearchParams()
  const coin = searchParams.get('moeda') ?? ''
  const order = ORDERS[searchParams.get('ordem')] ? searchParams.get('ordem') : 'recentes'

  function updateParam(name, value) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(name, value)
    else next.delete(name)
    setSearchParams(next)
  }

  // Estado derivado: filtra e ordena a cada renderização, sem tocar na lista original
  const filtered = purchases.filter((purchase) => !coin || purchase.symbol === coin)
  const visible = sortPurchases(filtered, order)
  const invested = visible.reduce(
    (total, purchase) => total.plus(new Big(purchase.quantity).times(purchase.price)),
    new Big(0),
  )

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Compras</h1>
      <p className="mt-1 text-sm text-muted">
        {visible.length === 1 ? '1 compra' : `${visible.length} compras`} ·{' '}
        <span className="tabular-nums">{formatBRL(invested.toFixed(2))}</span> investidos
      </p>

      <div className="mt-6 grid gap-3 sm:max-w-xl sm:grid-cols-2">
        <label className="block text-sm text-muted">
          Moeda
          <select
            value={coin}
            onChange={(event) => updateParam('moeda', event.target.value)}
            className={selectClass}
          >
            <option value="">Todas</option>
            {COINS.map((item) => (
              <option key={item.symbol} value={item.symbol}>
                {item.name} ({item.symbol})
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm text-muted">
          Ordenar por
          <select
            value={order}
            onChange={(event) => updateParam('ordem', event.target.value)}
            className={selectClass}
          >
            {Object.entries(ORDERS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6">
        {purchases.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line px-4 py-6 text-sm text-muted">
            Você ainda não registrou compras.{' '}
            <Link to="/" className="font-medium text-accent hover:underline hover:underline-offset-4">
              Registre a primeira no painel.
            </Link>
          </p>
        ) : visible.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line px-4 py-6 text-sm text-muted">
            Nenhuma compra de {coin} registrada.{' '}
            <button
              type="button"
              onClick={() => updateParam('moeda', '')}
              className="font-medium text-accent hover:underline hover:underline-offset-4"
            >
              Mostrar todas as moedas
            </button>
          </p>
        ) : (
          <PurchaseTable purchases={visible} prices={prices} onRemove={onRemove} />
        )}
      </div>
    </main>
  )
}
