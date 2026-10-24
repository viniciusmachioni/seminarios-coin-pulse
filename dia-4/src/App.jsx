import { useState } from 'react'
import { AddPurchaseForm } from './components/AddPurchaseForm'
import { DollarCompare } from './components/DollarCompare'
import { Header } from './components/Header'
import { MarketList } from './components/MarketList'
import { PortfolioSummary } from './components/PortfolioSummary'
import { PriceChart } from './components/PriceChart'
import { PurchaseTable } from './components/PurchaseTable'
import { DOLLAR_PAIR, findCoin } from './data/coins'
import { useLivePrices } from './hooks/useLivePrices'
import { useLocalStorage } from './hooks/useLocalStorage'
import { portfolioSummary } from './lib/money'
import { sortPurchases } from './lib/purchases'

export default function App() {
  const [purchases, setPurchases] = useLocalStorage('coinpulse:compras', [])
  const [selected, setSelected] = useState('BTC')
  const [range, setRange] = useState('1D')
  const { prices, status } = useLivePrices()

  // Estado derivado: calculado a cada renderização, nunca guardado num useState
  const summary = portfolioSummary(purchases, prices)
  const tone = summary.profit.lt(0) ? 'down' : 'up'
  const cryptoDollar = prices[DOLLAR_PAIR]?.price
  const coin = findCoin(selected)

  function addPurchase(purchase) {
    setPurchases([...purchases, purchase])
  }

  function removePurchase(id) {
    setPurchases(purchases.filter((purchase) => purchase.id !== id))
  }

  return (
    <div data-tone={tone} className="min-h-dvh bg-bg text-ink">
      <Header status={status} />

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-x-12 gap-y-10 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          <PortfolioSummary summary={summary} dollar={cryptoDollar} hasPurchases={purchases.length > 0} />
          {/* key nova = componente novo: trocar moeda ou período recomeça o gráfico do zero */}
          <PriceChart
            key={`${coin.pair}-${range}`}
            coin={coin}
            live={prices[coin.pair]}
            range={range}
            onRangeChange={setRange}
          />

          <section aria-labelledby="purchases-title" className="mt-10">
            <h2 id="purchases-title" className="font-medium">
              Suas compras
            </h2>
            {purchases.length === 0 ? (
              <p className="mt-3 rounded-lg border border-dashed border-line px-4 py-6 text-sm text-muted">
                Nenhuma compra registrada ainda. Use o formulário para adicionar a primeira: dá para
                registrar até 0,00000001 BTC.
              </p>
            ) : (
              <div className="mt-3">
                <PurchaseTable
                  purchases={sortPurchases(purchases, 'recentes')}
                  prices={prices}
                  onRemove={removePurchase}
                />
              </div>
            )}
          </section>
        </div>

        <aside className="divide-y divide-line self-start rounded-xl border border-line lg:sticky lg:top-6">
          <MarketList prices={prices} selected={selected} onSelect={setSelected} />
          <AddPurchaseForm prices={prices} onAdd={addPurchase} />
          <DollarCompare cryptoDollar={cryptoDollar} />
        </aside>
      </main>
    </div>
  )
}
