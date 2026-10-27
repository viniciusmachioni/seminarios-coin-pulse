import { Link, useSearchParams } from 'react-router-dom'
import { PurchaseTable } from '../components/PurchaseTable'
import { COINS } from '../data/coins'
import { sortPurchases } from '../lib/purchases'

export function Purchases({ purchases, prices, onRemove }) {
  // O filtro mora na URL: /compras?moeda=BTC
  const [searchParams, setSearchParams] = useSearchParams()
  const coin = searchParams.get('moeda') ?? ''

  function changeCoin(symbol) {
    setSearchParams(symbol ? { moeda: symbol } : {})
  }

  // Estado derivado: filtra a cada renderização, sem tocar na lista original
  const visible = sortPurchases(
    purchases.filter((purchase) => !coin || purchase.symbol === coin),
    'recentes',
  )

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Compras</h1>
      <p className="mt-1 text-sm text-muted">
        {visible.length === 1 ? '1 compra' : `${visible.length} compras`}
      </p>

      <label className="mt-6 block text-sm text-muted sm:max-w-xs">
        Moeda
        <select
          value={coin}
          onChange={(event) => changeCoin(event.target.value)}
          className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-ink hover:border-muted/60 focus:border-accent focus:outline-none"
        >
          <option value="">Todas</option>
          {COINS.map((item) => (
            <option key={item.symbol} value={item.symbol}>
              {item.name} ({item.symbol})
            </option>
          ))}
        </select>
      </label>

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
              onClick={() => changeCoin('')}
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
