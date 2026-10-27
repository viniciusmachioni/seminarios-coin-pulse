import { useEffect, useState } from 'react'
import { COINS, DOLLAR_PAIR } from '../data/coins'
import { tickerSocketUrl } from '../lib/binance'

const PAIRS = [...COINS.map((coin) => coin.pair), DOLLAR_PAIR]

export function useLivePrices() {
  const [prices, setPrices] = useState({})
  const [status, setStatus] = useState('connecting')

  useEffect(() => {
    const socket = new WebSocket(tickerSocketUrl(PAIRS))

    socket.onopen = () => setStatus('online')
    socket.onclose = () => setStatus('offline')

    socket.onmessage = (event) => {
      const { data } = JSON.parse(event.data)
      // Preços chegam como texto ("403717.00000000") e continuam texto
      setPrices((current) => ({
        ...current,
        [data.s]: { price: data.c, open: data.o },
      }))
    }

    // Cleanup: sem isso, cada renderização abriria uma conexão nova.
    // Desligamos o onclose antes: fechar de propósito não é uma queda de conexão
    return () => {
      socket.onclose = null
      socket.close()
    }
  }, [])

  return { prices, status }
}
