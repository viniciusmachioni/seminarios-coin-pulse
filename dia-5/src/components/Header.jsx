import { Link, NavLink } from 'react-router-dom'
import { ConnectionStatus } from './ConnectionStatus'
import { Logo } from './Logo'

// NavLink sabe se a rota dele é a atual e entrega isActive para o className
function navClass({ isActive }) {
  return `rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive ? 'bg-raised text-ink' : 'text-muted hover:text-ink'
  }`
}

export function Header({ status }) {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link to="/" aria-label="CoinPulse, ir para o painel">
          <Logo />
        </Link>

        <nav aria-label="Principal" className="flex gap-1">
          <NavLink to="/" end className={navClass}>
            Painel
          </NavLink>
          <NavLink to="/compras" className={navClass}>
            Compras
          </NavLink>
        </nav>

        <div className="ml-auto">
          <ConnectionStatus status={status} />
        </div>
      </div>
    </header>
  )
}
