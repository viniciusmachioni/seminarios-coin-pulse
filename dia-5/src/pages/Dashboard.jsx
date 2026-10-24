import { useState } from 'react'
import { AddPurchaseForm } from '../components/AddPurchaseForm'
import { DollarCompare } from '../components/DollarCompare'
import { MarketList } from '../components/MarketList'
import { PortfolioSummary } from '../components/PortfolioSummary'
import { PriceChart } from '../components/PriceChart'
import { RecentPurchases } from '../components/RecentPurchases'
import { DOLLAR_PAIR, findCoin } from '../data/coins'

export function Dashboard({ purchases, prices, summary, onAdd, onRemove }) {
  const [selected, setSelected] = useState('BTC')
  const [range, setRange] = useState('1D')

  const cryptoDollar = prices[DOLLAR_PAIR]?.price
  const coin = findCoin(selected)

  return (
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
        <RecentPurchases purchases={purchases} prices={prices} onRemove={onRemove} />
      </div>

      <aside className="divide-y divide-line self-start rounded-xl border border-line lg:sticky lg:top-6">
        <MarketList prices={prices} selected={selected} onSelect={setSelected} />
        <AddPurchaseForm prices={prices} onAdd={onAdd} />
        <DollarCompare cryptoDollar={cryptoDollar} />
      </aside>
    </main>
  )
}
