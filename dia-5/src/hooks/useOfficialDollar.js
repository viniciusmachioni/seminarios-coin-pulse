import { useEffect, useState } from 'react'

const URL = 'https://api.frankfurter.dev/v1/latest?base=USD&symbols=BRL'

// Cotação oficial do Banco Central Europeu: muda uma vez por dia útil
export function useOfficialDollar() {
  const [dollar, setDollar] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let ignore = false

    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        if (!ignore) setDollar({ rate: String(data.rates.BRL), date: data.date })
      })
      .catch(() => {
        if (!ignore) setFailed(true)
      })

    return () => {
      ignore = true
    }
  }, [])

  return { dollar, failed }
}
