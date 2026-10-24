import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
      <p className="text-6xl font-semibold tracking-tight text-muted tabular-nums">404</p>
      <h1 className="mt-4 text-xl font-semibold">Página não encontrada</h1>
      <p className="mt-2 text-sm text-muted">Esse endereço não existe no CoinPulse.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-full bg-accent px-5 py-2.5 font-semibold text-bg transition hover:brightness-110"
      >
        Voltar ao painel
      </Link>
    </main>
  )
}
