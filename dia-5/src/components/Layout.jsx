import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export function Layout({ status, tone }) {
  return (
    <div data-tone={tone} className="min-h-dvh bg-bg text-ink">
      <Header status={status} />
      {/* Outlet é onde a página da rota atual aparece */}
      <Outlet />
    </div>
  )
}
