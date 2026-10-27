import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AddPurchaseForm } from '../components/AddPurchaseForm'
import { MarketList } from '../components/MarketList'
import { PortfolioSummary } from '../components/PortfolioSummary'
import { PriceChart } from '../components/PriceChart'
import { PurchaseTable } from '../components/PurchaseTable'
import { DOLLAR_PAIR, findCoin } from '../data/coins'
import { sortPurchases } from '../lib/purchases'

export function Dashboard({ purchases, prices, summary, onAdd, onRemove }) {
  const [selected, setSelected] = useState('BTC')
  const [range, setRange] = useState('1D')

  const coin = findCoin(selected)
  const recent = sortPurchases(purchases, 'recentes').slice(0, 5)

  return (
    <main className="mx-auto grid max-w-6xl grid-cols-1 gap-x-12 gap-y-10 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div>
        <PortfolioSummary
          summary={summary}
          dollar={prices[DOLLAR_PAIR]?.price}
          hasPurchases={purchases.length > 0}
        />
        {/* key nova = componente novo: trocar moeda ou período recomeça o gráfico do zero */}
        <PriceChart
          key={`${coin.pair}-${range}`}
          coin={coin}
          live={prices[coin.pair]}
          range={range}
          onRangeChange={setRange}
        />

        <section aria-labelledby="purchases-title" className="mt-10">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="purchases-title" className="font-medium">
              Últimas compras
            </h2>
            {purchases.length > 0 && (
              <Link
                to="/compras"
                className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline hover:underline-offset-4"
              >
                Ver todas ({purchases.length})
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            )}
          </div>

          {purchases.length === 0 ? (
            <p className="mt-3 rounded-lg border border-dashed border-line px-4 py-6 text-sm text-muted">
              Nenhuma compra registrada ainda. Use o formulário para adicionar a primeira: dá para
              registrar até 0,00000001 BTC.
            </p>
          ) : (
            <div className="mt-3">
              <PurchaseTable purchases={recent} prices={prices} onRemove={onRemove} />
            </div>
          )}
        </section>
      </div>

      <aside className="divide-y divide-line self-start rounded-xl border border-line lg:sticky lg:top-6">
        <MarketList prices={prices} selected={selected} onSelect={setSelected} />
        <AddPurchaseForm prices={prices} onAdd={onAdd} />
      </aside>
    </main>
  )
}
