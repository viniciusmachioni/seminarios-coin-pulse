import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { useLivePrices } from './hooks/useLivePrices'
import { useLocalStorage } from './hooks/useLocalStorage'
import { portfolioSummary } from './lib/money'
import { Dashboard } from './pages/Dashboard'
import { NotFound } from './pages/NotFound'
import { Purchases } from './pages/Purchases'

export default function App() {
  const [purchases, setPurchases] = useLocalStorage('coinpulse:compras', [])
  const { prices, status } = useLivePrices()

  // Estado derivado: calculado a cada renderização, nunca guardado num useState
  const summary = portfolioSummary(purchases, prices)
  const tone = summary.profit.lt(0) ? 'down' : 'up'

  function addPurchase(purchase) {
    setPurchases([...purchases, purchase])
  }

  function removePurchase(id) {
    setPurchases(purchases.filter((purchase) => purchase.id !== id))
  }

  return (
    <Routes>
      {/* Rota "pai" sem path: o Layout envolve todas as páginas */}
      <Route element={<Layout status={status} tone={tone} />}>
        <Route
          index
          element={
            <Dashboard
              purchases={purchases}
              prices={prices}
              summary={summary}
              onAdd={addPurchase}
              onRemove={removePurchase}
            />
          }
        />
        <Route
          path="compras"
          element={<Purchases purchases={purchases} prices={prices} onRemove={removePurchase} />}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
