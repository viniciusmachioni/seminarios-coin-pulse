import { useEffect, useState } from 'react'
import { RANGES, candleSocketUrl, fetchCandles } from '../lib/binance'

export function useCandles(pair, range) {
  const [candles, setCandles] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const { interval, limit } = RANGES[range]
    let ignore = false

    // 1. O passado vem do REST
    fetchCandles(pair, interval, limit)
      .then((history) => {
        if (ignore) return
        setCandles(history)
        setStatus('ready')
      })
      .catch(() => {
        if (!ignore) setStatus('error')
      })

    // 2. O presente vem do WebSocket: atualiza o último candle ou abre um novo
    const socket = new WebSocket(candleSocketUrl(pair, interval))
    socket.onmessage = (event) => {
      const { k } = JSON.parse(event.data)
      const point = { time: k.t, price: Number(k.c) }

      setCandles((current) => {
        if (current.length === 0) return current
        const last = current[current.length - 1]
        if (point.time === last.time) return [...current.slice(0, -1), point]
        if (point.time > last.time) return [...current.slice(1), point]
        return current
      })
    }

    // Saiu da tela? Ignora a resposta que ainda vai chegar e fecha o socket
    return () => {
      ignore = true
      socket.close()
    }
  }, [pair, range])

  return { candles, status }
}
