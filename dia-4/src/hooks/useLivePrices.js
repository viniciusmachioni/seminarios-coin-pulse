import { useEffect, useState } from 'react'
import { COINS, DOLLAR_PAIR } from '../data/coins'
import { fetchTickers, tickerSocketUrl } from '../lib/binance'

const PAIRS = [...COINS.map((coin) => coin.pair), DOLLAR_PAIR]

export function useLivePrices() {
  const [prices, setPrices] = useState({})
  const [status, setStatus] = useState('connecting')

  useEffect(() => {
    let socket
    let retryTimer
    let stopped = false

    function connect() {
      setStatus('connecting')
      socket = new WebSocket(tickerSocketUrl(PAIRS))

      socket.onopen = () => setStatus('online')

      socket.onmessage = (event) => {
        const { data } = JSON.parse(event.data)
        // Preços chegam como texto ("403717.00000000") e continuam texto
        setPrices((current) => ({
          ...current,
          [data.s]: { price: data.c, open: data.o },
        }))
      }

      socket.onclose = () => {
        if (stopped) return
        setStatus('offline')
        retryTimer = setTimeout(connect, 3000)
      }
    }

    // A foto do REST só preenche o que o WebSocket ainda não trouxe
    fetchTickers(PAIRS)
      .then((snapshot) => {
        if (!stopped) setPrices((current) => ({ ...snapshot, ...current }))
      })
      .catch(() => {})

    connect()

    // Cleanup: sem isso, cada renderização abriria uma conexão nova
    return () => {
      stopped = true
      clearTimeout(retryTimer)
      socket.close()
    }
  }, [])

  return { prices, status }
}
