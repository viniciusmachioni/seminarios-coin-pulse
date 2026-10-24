import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { sortPurchases } from '../lib/purchases'
import { PurchaseTable } from './PurchaseTable'

export function RecentPurchases({ purchases, prices, onRemove }) {
  const recent = sortPurchases(purchases, 'recentes').slice(0, 5)

  return (
    <section aria-labelledby="recent-title" className="mt-10">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="recent-title" className="font-medium">
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
  )
}
